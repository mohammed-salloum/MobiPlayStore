// SignIn.jsx
import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login as reduxLogin } from "../../redux/slices/userSlice"; 
import { mergeGuestReviews } from "../../redux/slices/reviewsSlice";
import "./SignIn.css";

const API_BASE = "http://localhost:5000";

function SignIn() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const { lang, "*": subPath } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromCart = location.state?.fromCart || false;

  // Determine view based on path (login / register / reset)
  const getViewFromPath = (path) => (path === "reset-password" ? "reset" : path || "login");
  const [view, setView] = useState(getViewFromPath(subPath));
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ key: "", type: "", values: {} });
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Welcome toast

  // Define validation schemas using yup
  const schema = useMemo(() => {
    const loginSchema = yup.object().shape({
      email: yup.string().trim().email(t("signIn.login.messages.invalidEmail")).required(t("signIn.login.messages.emailRequired")),
      password: yup.string().required(t("signIn.login.messages.passwordRequired")),
    });

    const registerSchema = yup.object().shape({
      username: yup
        .string()
        .trim()
        .required(t("signIn.register.messages.nameRequired"))
        .test("no-double-spaces", t("signIn.register.messages.nameDoubleSpaces"), (v) => !/\s{2,}/.test(v))
        .test("valid-fullname", t("signIn.register.messages.nameInvalid"), (v) => {
          if (!v) return false;
          const words = v.split(" ");
          return words.length >= 2 && words.length <= 4 && words.every(w => /^[A-Za-z\u0621-\u064A]{3,}$/.test(w));
        })
        .max(50, t("signIn.register.messages.max50Chars")),
      email: yup.string().trim().email(t("signIn.register.messages.invalidEmail")).required(t("signIn.register.messages.emailRequired")),
      password: yup.string()
        .required(t("signIn.register.messages.passwordRequired"))
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, t("signIn.register.messages.passwordWeak")),
      confirmPassword: yup.string()
        .required(t("signIn.register.messages.confirmPasswordRequired"))
        .oneOf([yup.ref("password")], t("signIn.register.messages.passwordsNotMatch")),
    });

    const resetSchema = yup.object().shape({
      email: yup.string().trim().email(t("signIn.reset.messages.invalidEmail")).required(t("signIn.reset.messages.emailRequired")),
    });

    if (view === "login") return loginSchema;
    if (view === "register") return registerSchema;
    if (view === "reset") return resetSchema;
  }, [view, t, i18n.language]);

  const { register: formRegister, handleSubmit, formState: { errors }, reset, setError, clearErrors, getValues, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  // Clear errors when fields are modified
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        clearErrors(name);
        setFormMessage({ key: "", type: "", values: {} });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  // Re-validate fields on language change
  useEffect(() => {
    Object.keys(errors).forEach((field) => {
      const value = getValues(field);
      schema.validateAt(field, { [field]: value })
        .then(() => clearErrors(field))
        .catch(err => setError(field, { type: "manual", message: err.message }));
    });
  }, [i18n.language, errors, schema, getValues, setError, clearErrors]);

  // Merge guest cart into logged-in user cart
  const mergeGuestCartWithUser = (userId) => {
    const guestCart = JSON.parse(localStorage.getItem("cart_guest")) || [];
    const userCartKey = `cart_${userId}`;
    const userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    const mergedCart = [...userCart];
    guestCart.forEach(item => {
      const index = mergedCart.findIndex(i => i.id === item.id);
      if (index >= 0) mergedCart[index].quantity += item.quantity;
      else mergedCart.push(item);
    });
    localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
    localStorage.removeItem("cart_guest");
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setFormMessage({ key: "", type: "", values: {} });

    try {
      let res;
      if (view === "login")
        res = await axios.post(`${API_BASE}/api/auth/login`, { email: data.email, password: data.password });
      else if (view === "register")
        res = await axios.post(`${API_BASE}/api/auth/register`, data);
      else if (view === "reset")
        res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email: data.email });

      const code = res?.data?.code;
      if (!code) return;

      let tempMessage = { key: "", type: "", values: {} };

      switch (view) {
        case "login":
          if (code === "loginSuccess") {
            // Update Redux user state and merge guest data
            dispatch(reduxLogin({ user: res.data.user, token: res.data.token }));
            mergeGuestCartWithUser(res.data.user.id);
            dispatch(mergeGuestReviews(res.data.user.id));

            setToastMessage(`${t("signIn.login.messages.welcomeBackUser", { username: res.data.user.username })}`);
            setTimeout(() => setToastMessage(""), 10000);

          } else if (code === "wrongCredentials") {
            tempMessage = { key: "signIn.login.messages.wrongCredentials", type: "error" };
            setValue("password", "");
            setFormMessage(tempMessage);
          }
          break;

        case "register":
          if (code === "registerSuccess") {
            tempMessage = { key: "signIn.register.messages.registerSuccess", type: "success" };
            setFormMessage(tempMessage);
          } else if (code === "emailExists") {
            tempMessage = { key: "signIn.register.messages.emailExists", type: "error" };
            setFormMessage(tempMessage);
          }
          break;

        case "reset":
          if (code === "resetSent") {
            tempMessage = { key: "signIn.reset.messages.resetSent", type: "success" };
            setFormMessage(tempMessage);
          } else if (code === "noAccount") {
            tempMessage = { key: "signIn.reset.messages.noAccount", type: "error" };
            setFormMessage(tempMessage);
          }
          break;
      }

      setLoading(false);

      // Redirect after successful login
      if (view === "login" && code === "loginSuccess") {
        setTimeout(() => {
          if (fromCart) navigate(`/${lang}/cart`);
          else navigate(`/${lang}/profile`);
        }, 1000);
      }

    } catch (err) {
      setFormMessage({ key: "signIn.loading", type: "error" });
      setLoading(false);
    }
  };

  // Switch between login, register, and reset views
  const changeView = (newView) => {
    setFormMessage({ key: "", type: "", values: {} });
    setView(newView);
    const path = newView === "reset" ? "reset-password" : newView;
    navigate(`/${lang}/${path}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    reset();
  };

  return (
    <div className="auth-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="auth-container">
        {/* Toast message for welcome */}
        {toastMessage && <div className="toast-message">{toastMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {view === "login" && (
            <>
              <label>{t("signIn.login.email")}</label>
              <input type="email" {...formRegister("email")} placeholder={t("signIn.login.email")} />
              {errors.email && <p className="auth-message error">{errors.email.message}</p>}

              <label>{t("signIn.login.password")}</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  {...formRegister("password")}
                  placeholder={t("signIn.login.password")}
                />
                <span className="toggle-eye" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="auth-message error">{errors.password.message}</p>}
            </>
          )}

          {view === "register" && (
            <>
              <label>{t("signIn.register.username")}</label>
              <input type="text" {...formRegister("username")} placeholder={t("signIn.register.username")} />
              {errors.username && <p className="auth-message error">{errors.username.message}</p>}

              <label>{t("signIn.register.email")}</label>
              <input type="email" {...formRegister("email")} placeholder={t("signIn.register.email")} />
              {errors.email && <p className="auth-message error">{errors.email.message}</p>}

              <label>{t("signIn.register.password")}</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  {...formRegister("password")}
                  placeholder={t("signIn.register.password")}
                />
                <span className="toggle-eye" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="auth-message error">{errors.password.message}</p>}

              <label>{t("signIn.register.confirmPassword")}</label>
              <input type="password" {...formRegister("confirmPassword")} placeholder={t("signIn.register.confirmPassword")} />
              {errors.confirmPassword && <p className="auth-message error">{errors.confirmPassword.message}</p>}
            </>
          )}

          {view === "reset" && (
            <>
              <label>{t("signIn.reset.yourEmail")}</label>
              <input type="email" {...formRegister("email")} placeholder={t("signIn.reset.email")} />
              {errors.email && <p className="auth-message error">{errors.email.message}</p>}
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? t("signIn.loading")
              : view === "login"
                ? t("signIn.login.loginBtn")
                : view === "register"
                  ? t("signIn.register.registerBtn")
                  : t("signIn.reset.resetBtn")}
          </button>

          {/* General form message */}
          {formMessage.key && (
            <div className={`form-message ${formMessage.type}`}>
              {t(formMessage.key, formMessage.values)}
            </div>
          )}
        </form>

        {/* Links to switch between views */}
        {view === "login" && (
          <>
            <p className="link-text single-link">
              <span className="reset-link" onClick={() => changeView("reset")}>{t("signIn.login.resetPassword")}</span>
            </p>
            <p className="link-text inline-link">
              <span>{t("signIn.login.noAccount")}</span>
              <span className="space"></span>
              <span className="toggle-link" onClick={() => changeView("register")}>{t("signIn.login.createAccount")}</span>
            </p>
          </>
        )}

        {view === "register" && (
          <p className="link-text single-link">
            <span className="toggle-link" onClick={() => changeView("login")}>{t("signIn.register.backToLogin")}</span>
          </p>
        )}

        {view === "reset" && (
          <p className="link-text single-link">
            <span className="toggle-link" onClick={() => changeView("login")}>{t("signIn.reset.backToLogin")}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;

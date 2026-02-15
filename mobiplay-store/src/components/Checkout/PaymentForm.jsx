// ==========================
// PaymentForm Component
// Handles checkout payment form with validation, theme support, RTL, and Redux cart integration
// Uses react-hook-form + yup for robust validation
// ==========================

import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";

import Button from '../Common/Button/Button';
import CustomSelect from '../Common/Select/CustomSelect';
import './PaymentForm.css';

// ==========================
// Payment Options
// List of available payment methods with keys for translation
// ==========================
const paymentOptions = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
];

function PaymentForm({ onPaymentSuccess }) {
  // ==========================
  // Contexts
  // Theme for UI styling
  // Language for RTL and localization
  // ==========================
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  // ==========================
  // Redux
  // Get cart items and calculate total price
  // ==========================
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  // ==========================
  // Local state
  // loading: disable buttons while processing
  // generalMessageKey: show general error messages
  // submitAttempted: track if user submitted the form to show validation errors
  // ==========================
  const [loading, setLoading] = useState(false);
  const [generalMessageKey, setGeneralMessageKey] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // ==========================
  // Validation schema
  // Dynamic yup schema with full validation rules for each field
  // Trims inputs, checks for double spaces, valid names, email format, address validity
  // ==========================
  const getSchema = useCallback(
    () =>
      yup.object().shape({
        name: yup
          .string()
          .transform((v) => (v ? v.trim() : ""))
          .required("contact.form.nameRequired")
          .test(
            "no-double-spaces",
            "contact.form.nameDoubleSpaces",
            (value) => !value || !/\s{2,}/.test(value)
          )
          .test("valid-fullname", "contact.form.nameInvalid", (value) => {
            if (!value) return false;
            const words = value.split(" ").filter(Boolean);
            return words.length >= 2 && words.length <= 4 &&
              words.every((word) => /^[\u0621-\u064A A-Za-z]{3,}$/.test(word));
          })
          .max(50, "contact.form.max50Chars"),

        email: yup
          .string()
          .transform((value) => (value ? value.trim() : ""))
          .required("checkout.emailRequired")
          .email("checkout.invalidEmail"),

        address: yup
          .string()
          .transform((value) => (value ? value.trim() : ""))
          .required("checkout.addressRequired")
          .min(10, "checkout.addressMin10")
          .max(200, "checkout.addressMax200")
          .matches(/^(?!.*\s{2,}).*$/, "checkout.addressDoubleSpaces")
          .test(
            "no-only-digits-or-symbols",
            "checkout.addressInvalid",
            (value) => {
              if (!value) return true;
              const onlyDigits = /^\d{10,}$/.test(value);
              const onlySymbols = /^[^\w\s]{10,}$/.test(value);
              return !onlyDigits && !onlySymbols;
            }
          ),

        paymentMethod: yup.mixed().nullable().required("checkout.paymentRequired"),
      }),
    []
  );

  // ==========================
  // react-hook-form initialization
  // Resolver integrates yup schema
  // Mode "onBlur" triggers validation on field blur
  // ==========================
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(getSchema()),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      paymentMethod: null,
    },
    mode: "onBlur",
  });

  // ==========================
  // Trigger validation on language change
  // Ensures error messages update for current language
  // ==========================
  useEffect(() => {
    trigger();
  }, [i18n.language, trigger]);

  // ==========================
  // Persist form fields in localStorage
  // Useful if user navigates away and comes back
  // ==========================
  const watchedFields = watch();
  useEffect(() => {
    localStorage.setItem("paymentForm", JSON.stringify(watchedFields));
  }, [watchedFields]);

  useEffect(() => {
    const savedForm = localStorage.getItem("paymentForm");
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      Object.keys(parsed).forEach((key) => setValue(key, parsed[key]));
    }
  }, [setValue]);

  // ==========================
  // Form submission handler
  // Simulates payment processing and triggers onPaymentSuccess callback
  // ==========================
  const onSubmit = (data) => {
    setGeneralMessageKey("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess(); // Payment succeeded
    }, 1000);
  };

  const handleFullSubmit = (e) => {
    setSubmitAttempted(true);
    handleSubmit(onSubmit, () => {
      setGeneralMessageKey("checkout.fillAllFields"); // show general error if validation fails
    })(e);
  };

  // ==========================
  // Helper to show field errors
  // Shows error if touched or form submitted
  // ==========================
  const showError = (fieldName) =>
    !!errors[fieldName] && (touchedFields[fieldName] || submitAttempted);

  return (
    <div
      className={`payment-form-wrapper ${theme} ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`payment-form-card theme-${theme}`}>
        <h4 className="payment-form-title">{t("checkout.paymentDetails")}</h4>

        <form onSubmit={handleFullSubmit} noValidate>
          {/* Full Name Field */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label required">
              {t("checkout.fullName")}
            </label>
            <input
              type="text"
              id="name"
              className={`form-control form-control-lg ${
                showError("name") ? "is-invalid" : ""
              }`}
              placeholder={t("checkout.fullNamePlaceholder")}
              {...register("name")}
            />
            {showError("name") && (
              <div className="field-message error">{t(errors.name.message)}</div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label required">
              {t("checkout.email")}
            </label>
            <input
              type="email"
              id="email"
              className={`form-control form-control-lg ${
                showError("email") ? "is-invalid" : ""
              }`}
              placeholder={t("checkout.emailPlaceholder")}
              {...register("email")}
            />
            {showError("email") && (
              <div className="field-message error">{t(errors.email.message)}</div>
            )}
          </div>

          {/* Address Field */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label required">
              {t("checkout.shippingAddress")}
            </label>
            <textarea
              id="address"
              rows="3"
              className={`form-control form-control-lg ${
                showError("address") ? "is-invalid" : ""
              }`}
              placeholder={t("checkout.addressPlaceholder")}
              {...register("address")}
            />
            {showError("address") && (
              <div className="field-message error">
                {t(errors.address.message)}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="form-label required">
              {t("checkout.paymentMethod")}
            </label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={paymentOptions.map((option) => ({
                    value: option.value,
                    label: t(`checkout.paymentOptions.${option.value}`),
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("checkout.selectPayment")}
                  selectKey={i18n.language}
                  isSearchable={false}
                />
              )}
            />
            {showError("paymentMethod") && (
              <div className="field-message error">
                {t(errors.paymentMethod.message)}
              </div>
            )}
          </div>

          {/* Payment & Back Buttons */}
          <div className="payment-buttons">
            <Button type="submit" variant="checkout" fullWidth disabled={loading}>
              {loading ? (
                t("checkout.processing")
              ) : (
                <>
                  <FaCheckCircle className="me-2" />
                  {t("checkout.confirmPayment")}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="back"
              fullWidth
              onClick={() => navigate(`/${language}/cart`)}
              disabled={loading}
            >
              ← {t("checkout.backToCart")}
            </Button>
          </div>

          {/* General form message */}
          {generalMessageKey && (
            <div className={`form-message error theme-${theme} show mt-3`}>
              {t(generalMessageKey)}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;
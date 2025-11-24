// src/components/Checkout/PaymentForm.jsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
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

const paymentOptions = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
];

function PaymentForm({ onPaymentSuccess }) {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  // ✅ جلب بيانات السلة من Redux بدل useCart()
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  const [loading, setLoading] = useState(false);
  const [generalMessageKey, setGeneralMessageKey] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
            if (words.length < 2 || words.length > 4) return false;
            return words.every((word) => /^[\u0621-\u064A A-Za-z]{3,}$/.test(word));
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

  useEffect(() => {
    trigger();
  }, [i18n.language, trigger]);

  // حفظ القيم محليًا
  const watchedFields = watch();
  useEffect(() => {
    localStorage.setItem("paymentForm", JSON.stringify(watchedFields));
  }, [watchedFields]);

  // استرجاع القيم
  useEffect(() => {
    const savedForm = localStorage.getItem("paymentForm");
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      Object.keys(parsed).forEach((key) => setValue(key, parsed[key]));
    }
  }, [setValue]);

  const onSubmit = (data) => {
    setGeneralMessageKey("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess(); // ✅ نجاح الدفع
    }, 1000);
  };

  const handleFullSubmit = (e) => {
    setSubmitAttempted(true);
    handleSubmit(onSubmit, () => {
      setGeneralMessageKey("checkout.fillAllFields");
    })(e);
  };

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
          {/* الاسم */}
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

          {/* البريد الإلكتروني */}
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

          {/* العنوان */}
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

          {/* طريقة الدفع */}
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

          {/* أزرار الدفع */}
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

import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import "./FormField.css";

export default function FormField({
  label,
  placeholder,
  register,
  name,
  error,
  successMessage,
  type = "text",
  required = false,
  rows = 1,
  value,
  onChange,
  onBlur,
  isRTL = false,
  touched = false,
}) {
  const { t } = useTranslation();
  const isTextarea = rows > 1;

  const [showSuccess, setShowSuccess] = useState(false);
  const showError = Boolean(error && touched);

  // Show success border/message for 4 seconds when input is valid and touched
  useEffect(() => {
    if (!showError && touched && value?.toString().trim() !== "") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowSuccess(false);
    }
  }, [value, touched, showError]);

  // Dynamically apply error/success styling
  const inputClass = `form-input ${showError ? "error-border" : ""} ${showSuccess ? "success-border" : ""}`;

  return (
    <div className={`form-field-wrapper ${isRTL ? "rtl" : "ltr"}`}>
      <label className={required ? "required" : ""}>{label}</label>

      <div className="field-wrapper">
        {type === "phone" ? (
          // Phone input field
          <PhoneInput
            country="sy"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            inputProps={{
              name,
              dir: isRTL ? "rtl" : "ltr",
              autoComplete: "off",
            }}
            placeholder={placeholder}
            containerClass="phone-container"
            inputClass={inputClass}
            buttonClass="flag-dropdown"
            specialLabel=""
          />
        ) : isTextarea ? (
          // Multi-line textarea
          <textarea
            {...register?.(name)}
            placeholder={placeholder}
            rows={rows}
            className={inputClass}
          />
        ) : (
          // Standard text input
          <input
            {...register?.(name)}
            type={type}
            placeholder={placeholder}
            className={inputClass}
          />
        )}

        <div className="field-message">
          {showError && <div className="error">{t(error.message)}</div>}
          {showSuccess && successMessage && <div className="success">{t(successMessage)}</div>}
        </div>
      </div>
    </div>
  );
}
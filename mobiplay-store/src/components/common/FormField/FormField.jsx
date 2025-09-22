import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
  isRTL = false,
  touched = false,
}) {
  const isTextarea = rows > 1;
  const showError = error && touched;
  const showSuccess = !error && touched && value?.trim() !== "";

  const inputClass = `form-input ${showError ? "error-border" : ""} ${showSuccess ? "success-border" : ""}`;

  return (
    <div className={`form-field-wrapper ${isRTL ? "rtl" : "ltr"}`}>
      <label className={required ? "required" : ""}>{label}</label>

      {type === "phone" ? (
        <PhoneInput
          country="sy"  // الدولة الافتراضية سورية
          value={value}
          onChange={onChange}
          inputProps={{ name, required, dir: isRTL ? "rtl" : "ltr" }}
          placeholder={placeholder}
          containerClass="phone-container"
          inputClass={inputClass}
          buttonClass="flag-dropdown"
          specialLabel=""
        />
      ) : isTextarea ? (
        <textarea
          {...register?.(name)}
          placeholder={placeholder}
          rows={rows}
          className={inputClass}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          {...register?.(name)}
          type={type}
          placeholder={placeholder}
          className={inputClass}
          value={value}
          onChange={onChange}
        />
      )}

      <div className="field-message">
        {showError && <div className="error">{error.message}</div>}
        {showSuccess && successMessage && <div className="success">{successMessage}</div>}
      </div>
    </div>
  );
}

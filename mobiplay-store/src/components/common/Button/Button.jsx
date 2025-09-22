import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../context/ThemeContext";
import "./Button.css";

function Button({
  children,
  onClick,
  to,
  type = "button",
  variant = "primary",  // افتراضي Primary
  fullWidth = false,
  unified = false,
  disabled = false,
  active = false,
  className = "",
  ...rest
}) {
  const { i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const lang = i18n.language;
  const isRTL = lang === "ar";

  // توليد الأصناف بشكل ديناميكي
  const classes = [
    "btn",
    variant && `btn-${variant}`,        // btn-primary, btn-add-cart, btn-back, btn-quantity ...
    active && "active",
    unified && variant === "checkout" && "unified",
    `theme-${theme}`,
    fullWidth && "full-width",          // التعديل هنا
    disabled && "disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = disabled ? undefined : onClick;

  // إذا كان الزر رابط
  if (to) {
    const localizedTo = to.startsWith(`/${lang}`)
      ? to
      : `/${lang}${to.startsWith("/") ? to : "/" + to}`;

    return (
      <Link
        to={disabled ? "#" : localizedTo}
        className={classes}
        onClick={handleClick}
        {...rest}
      >
        <span className={isRTL ? "rtl" : ""}>{children}</span>
      </Link>
    );
  }

  // زر عادي
  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      <span className={isRTL ? "rtl" : ""}>{children}</span>
    </button>
  );
}

export default Button;

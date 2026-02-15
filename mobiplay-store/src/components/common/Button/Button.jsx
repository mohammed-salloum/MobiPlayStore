import { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../context/ThemeContext";
import "./Button.css";

/* =========================
   Button Component
   - Unified button/link component
   - Supports theming, RTL, variants, and localization
   - Can render as <button> or <Link>
========================= */
function Button({
  children,
  onClick,
  to,
  type = "button",
  variant = "primary",  // Default variant
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

  /* =========================
     Dynamic class generation
     - Combines variant, theme, state, and layout classes
  ======================== */
  const classes = [
    "btn",
    variant && `btn-${variant}`,        // e.g. btn-primary, btn-add-cart, btn-back, btn-quantity
    active && "active",
    unified && variant === "checkout" && "unified",
    `theme-${theme}`,
    fullWidth && "full-width",
    disabled && "disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Prevent interaction when disabled
  const handleClick = disabled ? undefined : onClick;

  /* =========================
     Link Mode
     - Renders as react-router <Link>
     - Auto-prefixes current language
  ======================== */
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

  /* =========================
     Button Mode
     - Renders as native <button>
  ======================== */
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
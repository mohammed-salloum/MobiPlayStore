import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

// Component Button مرن يمكن أن يكون <button> أو <Link>
function Button({ children, onClick, to, variant, dark, fullWidth, unified }) {
  // إنشاء قائمة الكلاسات حسب الخصائص props
  const classes = [
    "btn", // الكلاس الأساسي لكل الأزرار
    variant === "browse" ? "btn-browse" : "",
    variant === "add-cart" ? "btn-add-cart" : "",
    variant === "remove-cart" ? "btn-remove-cart" : "",
    variant === "details" ? "btn-details" : "",
    variant === "back" ? "btn-back" : "",
    variant === "quantity" ? "btn-quantity" : "",
    variant === "submit" ? "btn-submit" : "",
    variant === "continue" ? "btn-continue" : "",
    variant === "cancel" ? "btn-cancel" : "",
    variant === "checkout" ? "btn-checkout" : "",
    variant === "clear-cart" ? "btn-clear-cart" : "",  
    unified && variant === "checkout" ? "unified" : "", // تخصيص للزر الموحد في checkout
    dark ? "dark" : "light",
    fullWidth ? "full-width" : "", // زر بعرض كامل
  ].filter(Boolean).join(" "); // إزالة القيم الفارغة وتجميع الكلاسات

  // إذا كان هناك prop "to"، يصبح الزر رابط <Link>
  if (to) {
    return (
      <Link to={to} className={classes}>
        <span>{children}</span>
      </Link>
    );
  }

  // وإلا يصبح زر HTML عادي <button>
  return (
    <button onClick={onClick} className={classes}>
      <span>{children}</span>
    </button>
  );
}

export default Button;

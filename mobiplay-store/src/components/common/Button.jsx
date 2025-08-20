// src/components/common/Button.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

function Button({ children, onClick, to, variant, dark, fullWidth, unified }) {
  const classes = [
    "btn",
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
    unified && variant === "checkout" ? "unified" : "",
    dark ? "dark" : "light",
    fullWidth ? "full-width" : "",
  ].filter(Boolean).join(" ");

  if (to) {
    return (
      <Link to={to} className={classes}>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      <span>{children}</span>
    </button>
  );
}

export default Button;

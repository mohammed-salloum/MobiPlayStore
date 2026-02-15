// src/components/Checkout/PaymentConfirmation.jsx

import { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../Common/Button/Button";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import "./PaymentConfirmation.css";

function PaymentConfirmation({ isRTL }) {
  // ===== Theme & i18n Context =====
  const { theme } = useContext(ThemeContext);  // Light / Dark theme
  const { t } = useTranslation();             // Translation hook

  // ===== Navigation & Redux =====
  const navigate = useNavigate();             // For redirecting user
  const dispatch = useDispatch();             // Redux dispatcher

  // ===== Scroll to top on mount =====
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ===== Finish / Redirect Handler =====
  const handleFinish = () => {
    dispatch(clearCart());                    // Clear Redux cart state
    localStorage.removeItem("paymentDone");  // Remove localStorage flag
    navigate("/", { replace: true });        // Redirect to homepage
  };

  return (
    <div
      className={`payment-confirmation-wrapper theme-${theme}`}
      dir={isRTL ? "rtl" : "ltr"}             // RTL/LTR layout support
    >
      <div className="payment-confirmation-card">
        {/* Success Icon */}
        <FaCheckCircle className="payment-confirmation-icon" />

        {/* Title */}
        <h4 className="payment-confirmation-title">
          {t("checkout.paymentSuccess")}
        </h4>

        {/* Confirmation message */}
        <p className="payment-confirmation-message">
          {t("checkout.confirmationMessage")}
        </p>

        {/* Finish Button */}
        <Button variant="checkout" fullWidth onClick={handleFinish}>
          {t("checkout.finish")}
        </Button>
      </div>
    </div>
  );
}

export default PaymentConfirmation;
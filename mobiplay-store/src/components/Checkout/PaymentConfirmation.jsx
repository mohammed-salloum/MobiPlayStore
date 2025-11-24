// src/components/Checkout/PaymentConfirmation.jsx
import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Button from "../Common/Button/Button";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import "./PaymentConfirmation.css";

function PaymentConfirmation({ isRTL }) {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFinish = () => {
    dispatch(clearCart()); // مسح السلة من Redux
    localStorage.removeItem("paymentDone"); // إزالة العلم من التخزين المحلي
    navigate("/", { replace: true }); // الرجوع للصفحة الرئيسية
  };

  return (
    <div
      className={`payment-confirmation-wrapper theme-${theme}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="payment-confirmation-card">
        <FaCheckCircle className="payment-confirmation-icon" />
        <h4 className="payment-confirmation-title">
          {t("checkout.paymentSuccess")}
        </h4>
        <p className="payment-confirmation-message">
          {t("checkout.confirmationMessage")}
        </p>

        <Button variant="checkout" fullWidth onClick={handleFinish}>
          {t("checkout.finish")}
        </Button>
      </div>
    </div>
  );
}

export default PaymentConfirmation;

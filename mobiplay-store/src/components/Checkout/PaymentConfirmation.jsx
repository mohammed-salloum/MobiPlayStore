// src/components/Checkout/PaymentConfirmation.jsx
import React, { useContext } from 'react';
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Button from '../common/Button/Button';

function PaymentConfirmation({ cartItems, total, onFinish, isRTL }) {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className={`payment-form-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h4 className="payment-form-title">{t("checkout.paymentSuccess")}</h4>
      <p>{t("checkout.confirmationMessage")}</p>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} x {item.quantity} - ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <p>
        <strong>{t("checkout.total")}: </strong>${total}
      </p>

      <Button variant="checkout" fullWidth onClick={onFinish}>
        {t("checkout.finish")}
      </Button>
    </div>
  );
}

export default PaymentConfirmation;

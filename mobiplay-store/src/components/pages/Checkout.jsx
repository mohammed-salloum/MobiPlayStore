import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from "../../context/ThemeContext";
import OrderSummary from "../Checkout/OrderSummary";
import PaymentForm from "../Checkout/PaymentForm";
import { useTranslation } from 'react-i18next';
import './Checkout.css'; // فقط تنسيق عام للصفحة

function Checkout() {
  const cartItems = useSelector(state => state.cart.items);
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    return () => {
      document.body.classList.remove('dark-mode');
      document.body.classList.remove('light-mode');
    };
  }, [darkMode]);

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <p className="empty-cart-message" dir={isRTL ? "rtl" : "ltr"}>
        {t("checkout.emptyMessage")}
      </p>
    );
  }

  return (
    <div
      className={`checkout-container ${darkMode ? "dark" : "light"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="checkout-title">{t("checkout.title")}</h2>
      <div className="checkout-content">
        <div className="order-summary-column">
          <OrderSummary cartItems={cartItems} getTotal={getTotal} />
        </div>
        <div className="payment-form-column">
          <PaymentForm getTotal={getTotal} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;

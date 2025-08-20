import React, { useContext } from 'react';
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import './OrderSummary.css';

function OrderSummary({ cartItems, getTotal }) {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className={`order-summary-card ${darkMode ? 'dark-mode' : 'light-mode'}`} dir={isRTL ? "rtl" : "ltr"}>
      <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>
      <ul className="order-items-list">
        {cartItems.map(item => (
          <li key={item.id} className="order-item">
            <div className="order-item-info">
              {item.img && (
                <img src={item.img} alt={item.name} className="order-item-img" />
              )}
              <div className="order-item-name-qty">
                <strong>{item.name}</strong> × {item.quantity}
              </div>
            </div>
            <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
        <li className="order-total">
          <span>{t("checkout.total")}</span>
          <span className="total-amount">${getTotal()}</span>
        </li>
      </ul>
    </div>
  );
}

export default OrderSummary;

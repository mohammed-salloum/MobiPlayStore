import React, { useContext } from 'react';
import { ThemeContext } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import './OrderSummary.css';

function OrderSummary() {
  const { theme } = useContext(ThemeContext);
  const { cartItems, totalPrice } = useCart();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={`order-summary-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>
        <p>{t("checkout.emptyCart") || "Your cart is empty."}</p>
      </div>
    );
  }

  return (
    <div className={`order-summary-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>
      <ul className="order-items-list">
        {cartItems.map(item => (
          <li key={item.id} className="order-item">
            <div className="order-item-info">
              {item.img && <img src={item.img} alt={item.name} className="order-item-img" />}
              <div className="order-item-name">
                <strong>{item.name}</strong>
              </div>
              <div className="order-item-qty-badge">× {item.quantity}</div>
            </div>
            <span className="order-item-price">
              ${((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
        <li className="order-total">
          <span>{t("checkout.total")}</span>
          <span className="total-amount">${totalPrice}</span>
        </li>
      </ul>
    </div>
  );
}

export default OrderSummary;

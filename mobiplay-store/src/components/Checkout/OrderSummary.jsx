// src/components/Checkout/OrderSummary.jsx
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { selectCartItems } from "../../redux/slices/cartSlice";
import "./OrderSummary.css";

function OrderSummary() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const cartItems = useSelector(selectCartItems);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={`order-summary-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>
      </div>
    );
  }

  return (
    <div className={`order-summary-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>

      {/* العناصر فقط قابلة للتمرير */}
      <ul className="order-items-list">
        {cartItems.map((item) => (
          <li key={item.id} className="order-item">
            <div className="order-item-info">
              {item.img && (
                <div className="order-item-img-container">
                  <img src={item.img} alt={item.name} className="order-item-img" />
                  <div className="order-item-qty-badge">× {item.quantity}</div>
                </div>
              )}
              <div className="order-item-name">
                <strong>{item.name}</strong>
              </div>
            </div>
            <span className="order-item-price">
              ${((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* الإجمالي ثابت أسفل البطاقة */}
      <div className="order-total">
        <span>{t("checkout.total")}</span>
        <span className="total-amount">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;

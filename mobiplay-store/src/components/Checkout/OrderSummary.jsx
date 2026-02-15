// =========================
// OrderSummary Component
// -------------------------
// Displays a summary of items in the cart during checkout.
// Shows item images, quantity, price, and total.
// Supports theme switching (light/dark) and RTL/LTR layouts.
// =========================

import { useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { selectCartItems } from "../../redux/slices/cartSlice";
import "./OrderSummary.css";

function OrderSummary() {
  const { theme } = useContext(ThemeContext); // Access current theme
  const { t, i18n } = useTranslation();       // Translation function
  const isRTL = i18n.language === "ar";       // Check if layout should be RTL

  const cartItems = useSelector(selectCartItems); // Get cart items from Redux

  // Calculate total price considering discounted prices
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  // =========================
  // Empty Cart Handling
  // -------------------------
  // Show only the title if cart is empty
  // =========================
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={`order-summary-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>
      </div>
    );
  }

  // =========================
  // Cart Items List
  // -------------------------
  // Scrollable section containing each item with:
  // - Image (optional)
  // - Quantity badge
  // - Product name
  // - Price per quantity
  // =========================
  return (
    <div className={`order-summary-card theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h4 className="order-summary-title">{t("checkout.orderSummary")}</h4>

      <ul className="order-items-list">
        {cartItems.map((item) => (
          <li key={item.id} className="order-item">
            <div className="order-item-info">
              {item.img && (
                <div className="order-item-img-container">
                  <img src={item.img} alt={item.name} className="order-item-img" />
                  {/* Quantity badge overlay on the image */}
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

      {/* =========================
          Order Total
          -------------------------
          Fixed summary of total price at the bottom
      ========================= */}
      <div className="order-total">
        <span>{t("checkout.total")}</span>
        <span className="total-amount">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import OrderSummary from "../../components/Checkout/OrderSummary";
import PaymentForm from "../../components/Checkout/PaymentForm";
import PaymentConfirmation from "../../components/Checkout/PaymentConfirmation";
import { useTranslation } from "react-i18next";
import "./Checkout.css";

function Checkout() {
  const { cartItems, totalPrice } = useCart();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={`checkout-container theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="checkout-title">{t("checkout.title")}</h2>
        <p className="empty-cart">{t("checkout.emptyCart") || "Your cart is empty."}</p>
      </div>
    );
  }

  return (
    <div className={`checkout-container theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="checkout-title">{t("checkout.title")}</h2>
      <div className="checkout-content">
        <div className="order-summary-column">
          <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
        </div>
        <div className="payment-form-column">
          {showConfirmation ? (
            <PaymentConfirmation
              cartItems={cartItems}
              total={totalPrice}
              onFinish={() => setShowConfirmation(false)}
              isRTL={isRTL}
            />
          ) : (
            <PaymentForm
              total={totalPrice}
              onPaymentSuccess={() => setShowConfirmation(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;

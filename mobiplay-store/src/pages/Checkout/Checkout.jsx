// src/pages/Checkout/Checkout.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice"; // استدعاء من Redux Slice
import OrderSummary from "../../components/Checkout/OrderSummary";
import PaymentForm from "../../components/Checkout/PaymentForm";
import PaymentConfirmation from "../../components/Checkout/PaymentConfirmation";
import { useTranslation } from "react-i18next";
import "./Checkout.css";

function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items); // من Redux
  const totalPrice = useSelector((state) => state.cart.totalPrice); // من Redux
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [showConfirmation, setShowConfirmation] = useState(false);

  // تحميل حالة الدفع من localStorage عند تهيئة الصفحة
  useEffect(() => {
    const paymentDone = localStorage.getItem("paymentDone");
    if (paymentDone === "true") {
      setShowConfirmation(true);
    }
  }, []);

  // عند نجاح الدفع
  const handlePaymentSuccess = () => {
    localStorage.setItem("paymentDone", "true");
    setShowConfirmation(true);
  };

  // عند الضغط على "إنهاء"
  const handleFinish = () => {
    dispatch(clearCart()); // مسح السلة من Redux
    localStorage.removeItem("paymentDone");
  };

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
        {showConfirmation ? (
          <div className="payment-form-column">
            <PaymentConfirmation
              cartItems={cartItems}
              total={totalPrice}
              isRTL={isRTL}
              onFinish={handleFinish}
            />
          </div>
        ) : (
          <>
            <div className="payment-form-column">
              <PaymentForm total={totalPrice} onPaymentSuccess={handlePaymentSuccess} />
            </div>
            <div className="order-summary-column">
              <OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;

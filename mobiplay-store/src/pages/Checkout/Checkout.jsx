// src/pages/Checkout/Checkout.jsx
// ----------------------------------------------------
// Checkout Page
// - Handles the checkout flow (payment → confirmation)
// - Integrates Redux cart state, theming, and i18n
// ----------------------------------------------------

import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice"; // Redux action to clear cart state
import OrderSummary from "../../components/Checkout/OrderSummary";
import PaymentForm from "../../components/Checkout/PaymentForm";
import PaymentConfirmation from "../../components/Checkout/PaymentConfirmation";
import { useTranslation } from "react-i18next";
import "./Checkout.css";

function Checkout() {
  /* =========================
     Redux & Context Hooks
  ========================= */

  const dispatch = useDispatch();

  // Retrieve cart data from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  // Theme context (light / dark)
  const { theme } = useContext(ThemeContext);

  // i18n translation and direction handling
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  /* =========================
     Local Component State
  ========================= */

  // Controls whether the payment confirmation screen is shown
  const [showConfirmation, setShowConfirmation] = useState(false);

  /* =========================
     Effects
  ========================= */

  // Restore payment state from localStorage on initial load
  // This ensures the confirmation screen persists after page refresh
  useEffect(() => {
    const paymentDone = localStorage.getItem("paymentDone");
    if (paymentDone === "true") {
      setShowConfirmation(true);
    }
  }, []);

  /* =========================
     Handlers
  ========================= */

  // Called when payment is successfully completed
  const handlePaymentSuccess = () => {
    localStorage.setItem("paymentDone", "true"); // Persist payment status
    setShowConfirmation(true); // Switch to confirmation view
  };

  // Called when user finishes checkout (confirmation screen)
  const handleFinish = () => {
    dispatch(clearCart()); // Clear cart from Redux store
    localStorage.removeItem("paymentDone"); // Reset persisted payment state
  };

  /* =========================
     Empty Cart State
  ========================= */

  // If cart is empty, show a simple message instead of checkout flow
  if (!cartItems || cartItems.length === 0) {
    return (
      <div
        className={`checkout-container theme-${theme}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h2 className="checkout-title">{t("checkout.title")}</h2>
        <p className="empty-cart">
          {t("checkout.emptyCart") || "Your cart is empty."}
        </p>
      </div>
    );
  }

  /* =========================
     Main Render
  ========================= */

  return (
    <div
      className={`checkout-container theme-${theme}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Page Title */}
      <h2 className="checkout-title">{t("checkout.title")}</h2>

      <div className="checkout-content">
        {showConfirmation ? (
          // =========================
          // Payment Confirmation View
          // =========================
          <div className="payment-form-column">
            <PaymentConfirmation
              cartItems={cartItems}
              total={totalPrice}
              isRTL={isRTL}
              onFinish={handleFinish}
            />
          </div>
        ) : (
          // =========================
          // Payment Form + Order Summary
          // =========================
          <>
            {/* Payment Form Column */}
            <div className="payment-form-column">
              <PaymentForm
                total={totalPrice}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>

            {/* Order Summary Column */}
            <div className="order-summary-column">
              <OrderSummary
                cartItems={cartItems}
                totalPrice={totalPrice}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Checkout;

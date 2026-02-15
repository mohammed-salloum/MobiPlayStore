// src/components/Cart/CartSummary.jsx

import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { clearCart, selectCartItems } from "../../redux/slices/cartSlice";
import Button from "../Common/Button/Button";
import "./CartSummary.css";

function CartSummary() {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext); // Get current theme (light/dark)
  const { t, i18n } = useTranslation();      // i18n for translations
  const isRTL = i18n.language === "ar";       // RTL layout support for Arabic

  // Get all items in the cart from Redux
  const items = useSelector(selectCartItems);

  // Calculate total price (uses discountedPrice if available)
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity,
    0
  );

  // Handler to clear the cart completely
  const handleClearCart = () => {
    dispatch(clearCart());
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top after clearing
  };

  return (
    <div className={`cart-summary theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* =========================
          Total Price Section
      ========================== */}
      <div className="cart-total">
        <span>{t("cart.total")}:</span>
        <span className="cart-price">${totalPrice.toFixed(2)}</span>
      </div>

      {/* =========================
          Action Buttons
          -------------------------
          - Proceed to Checkout
          - Clear Cart
          - Continue Shopping
      ========================== */}
      <div className="cart-buttons">
        {/* Checkout button navigates to checkout page */}
        <Button
          variant="checkout"
          theme={theme}
          fullWidth
          to={`/${i18n.language}/checkout`}
        >
          {t("cart.proceedToCheckout")}
        </Button>

        {/* Clear cart button triggers Redux action */}
        <Button
          variant="clear-cart"
          theme={theme}
          fullWidth
          onClick={handleClearCart}
        >
          {t("cart.clearCart")}
        </Button>

        {/* Continue shopping navigates back to products page */}
        <Button
          variant="continue"
          theme={theme}
          fullWidth
          to={`/${i18n.language}/products`}
        >
          ← {t("cart.continueShopping")}
        </Button>
      </div>
    </div>
  );
}

export default CartSummary;
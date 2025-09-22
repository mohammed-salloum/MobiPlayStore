// src/components/Cart/CartSummary.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button/Button";
import "./CartSummary.css";

function CartSummary() {
  const { clearCart, totalPrice } = useCart();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className={`cart-summary theme-${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="cart-total">
        <span>{t("cart.total")}:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <div className="cart-buttons">
        <Button variant="checkout" theme={theme} to="/checkout">
          {t("cart.proceedToCheckout")}
        </Button>

        <Button variant="clear-cart" theme={theme} onClick={clearCart}>
          {t("cart.clearCart")}
        </Button>

        <Button variant="continue" theme={theme} to="/products">
          ← {t("cart.continueShopping")}
        </Button>
      </div>
    </div>
  );
}

export default CartSummary;

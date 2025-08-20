import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Button from "../common/Button"; 
import "./CartSummary.css";

function CartSummary({ total }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className={`cart-summary ${darkMode ? "dark" : "light"}`} dir={isRTL ? "rtl" : "ltr"}>
      <li className={`cart-total ${darkMode ? "dark" : "light"}`}>
        <span>{t("cart.total")}:</span>
        <span>${total}</span>
      </li>
      <Button variant="checkout" dark={darkMode} onClick={() => navigate("/checkout")}>
          {t("cart.proceedToCheckout")}
      </Button>

      <Button variant="clear-cart" dark={darkMode} onClick={() => dispatch(clearCart())}>
          {t("cart.clearCart")}
      </Button>

      <Button variant="continue" dark={darkMode} onClick={() => navigate("/products")}>
          ← {t("cart.continueShopping")}
      </Button>
            </div>
  );
}

export default CartSummary;

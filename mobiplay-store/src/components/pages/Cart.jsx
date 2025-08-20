import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import CartItem from "../Cart/CartItem";
import CartSummary from "../Cart/CartSummary";
import Button from "../common/Button"; 
import "./Cart.css";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const getTotal = () =>
    cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div
        className={`cart-empty ${darkMode ? "dark" : "light"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <FaShoppingCart className="empty-icon" />
        <h4>{t("cart.emptyMessage")}</h4>
        <Button
        onClick={() => navigate("/products")}
        variant="continue"
        dark={darkMode}
      >
        ← {t("cart.continueShopping")}
      </Button>
      
      </div>
    );
  }

  return (
    <div
      className={`cart-container ${darkMode ? "dark" : "light"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="cart-title">
        <FaShoppingCart /> {t("cart.title")}
      </h2>

      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
        <CartSummary total={getTotal()} />
      </ul>
    </div>
  );
}

export default Cart;

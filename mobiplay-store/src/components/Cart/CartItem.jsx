// src/components/Cart/CartItem.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button/Button";
import "./CartItem.css";

function CartItem({ item }) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <li className="cart-item" data-theme={theme} dir={isRTL ? "rtl" : "ltr"}>
      {/* اسم اللعبة */}
      <div className="cart-item-name">{item.name}</div>

      {/* أزرار الكمية */}
      <div className="quantity-wrapper">
        <Button variant="quantity" theme={theme} onClick={() => decreaseQuantity(item.id)}>
          -
        </Button>
        <div className="quantity-display">{item.quantity}</div>
        <Button variant="quantity" theme={theme} onClick={() => increaseQuantity(item.id)}>
          +
        </Button>
      </div>

      {/* السعر وزر الإلغاء */}
      <div className="cart-item-actions">
        <span className="cart-item-price">
          ${((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)}
        </span>
        <Button variant="cancel" theme={theme} onClick={() => removeFromCart(item.id)}>
          {t("cart.cancel")}
        </Button>
      </div>
    </li>
  );
}

export default CartItem;

// src/components/Cart/CartItem.jsx
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { removeFromCart, setQuantityExact } from "../../redux/slices/cartSlice";
import Button from "../Common/Button/Button";
import "./CartItem.css";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const handleIncrease = () => {
    dispatch(setQuantityExact({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(setQuantityExact({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const itemPrice = (item.discountedPrice ?? item.price) * item.quantity;

  return (
    <li className="cart-item" data-theme={theme} dir={isRTL ? "rtl" : "ltr"}>
      {/* اسم اللعبة */}
      <div className="cart-item-name">{item.name}</div>

      {/* أزرار الكمية */}
      <div className="quantity-wrapper">
        <Button variant="quantity" theme={theme} onClick={handleDecrease}>
          -
        </Button>
        <div className="quantity-display">{item.quantity}</div>
        <Button variant="quantity" theme={theme} onClick={handleIncrease}>
          +
        </Button>
      </div>

      {/* السعر */}
      <div className="cart-item-price">${itemPrice.toFixed(2)}</div>

      {/* زر الإلغاء */}
      <div className="cart-item-cancel">
        <Button
          className="cancel"
          variant="cancel"
          theme={theme}
          onClick={handleRemove}
        >
          {t("cart.cancel")}
        </Button>
      </div>
    </li>
  );
}

export default CartItem;

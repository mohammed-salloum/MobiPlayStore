import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../../store/cartSlice";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Button from "../common/Button";
import './CartItem.css';


function CartItem({ item }) {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <li className={`cart-item ${darkMode ? "dark" : "light"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="cart-item-details">
        <strong>{item.name}</strong> × {item.quantity}
        <div className="quantity-controls">
            <Button
                variant="quantity"
                dark={darkMode}
                onClick={() => dispatch(decreaseQuantity(item.id))}
              >
                -
             </Button>
              <Button
                variant="quantity"
                dark={darkMode}
                onClick={() => dispatch(increaseQuantity(item.id))}
              >
                +
              </Button>
        </div>
      </div>
      <div className="cart-item-actions">
        <span>${(item.price * item.quantity).toFixed(2)}</span>
         <Button
            variant="cancel"
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            {t("cart.cancel")}
        </Button>
      </div>
    </li>
  );
}

export default CartItem;

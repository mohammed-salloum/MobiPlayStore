// src/components/Cart/CartItem.jsx
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { removeFromCart, setQuantityExact } from "../../redux/slices/cartSlice";
import Button from "../Common/Button/Button";
import "./CartItem.css";

/**
 * CartItem Component
 * ------------------
 * Displays a single product/item in the shopping cart.
 * Includes quantity controls, price calculation, and remove button.
 *
 * Props:
 *  - item: object containing { id, name, price, discountedPrice, quantity, ... }
 */
function CartItem({ item }) {
  const dispatch = useDispatch();

  // ThemeContext allows dynamic theming (dark/light)
  const { theme } = useContext(ThemeContext);

  // i18n for translation
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // adjust layout for RTL languages

  /**
   * Increase the quantity of this item by 1
   */
  const handleIncrease = () => {
    dispatch(setQuantityExact({ id: item.id, quantity: item.quantity + 1 }));
  };

  /**
   * Decrease the quantity of this item by 1 (minimum 1)
   */
  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(setQuantityExact({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  /**
   * Remove this item entirely from the cart
   */
  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  /**
   * Calculate total price for this cart item
   * If a discounted price exists, use it; otherwise use original price
   */
  const itemPrice = (item.discountedPrice ?? item.price) * item.quantity;

  return (
    <li className="cart-item" data-theme={theme} dir={isRTL ? "rtl" : "ltr"}>
      {/* -------------------------
          Product Name
      -------------------------- */}
      <div className="cart-item-name">{item.name}</div>

      {/* -------------------------
          Quantity Controls
          - Decrease button
          - Quantity display
          - Increase button
      -------------------------- */}
      <div className="quantity-wrapper">
        <Button variant="quantity" theme={theme} onClick={handleDecrease}>
          -
        </Button>
        <div className="quantity-display">{item.quantity}</div>
        <Button variant="quantity" theme={theme} onClick={handleIncrease}>
          +
        </Button>
      </div>

      {/* -------------------------
          Price Display
          Shows total price for the quantity
      -------------------------- */}
      <div className="cart-item-price">${itemPrice.toFixed(2)}</div>

      {/* -------------------------
          Remove Button
          - Uses translation key "cart.cancel"
          - Styled according to theme
      -------------------------- */}
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
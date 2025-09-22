// CartIcon.jsx
import React, { useMemo, useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import "./CartIcon.css";

const CartIcon = ({ collapseNavbar, size = "small", wrapper = "li" }) => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { cartItems } = useCart();

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (totalQuantity === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [totalQuantity]);

  // تعيين حجم الأيقونة
  const sizeClass = `cart-icon-${size}`;

  const WrapperTag = wrapper;

  return (
    <WrapperTag className="cart-wrapper">
      <NavLink
        to={`/${language}/cart`}
        className={`cart-link theme-${theme} ${bump ? "bump" : ""}`}
        title={`لديك ${totalQuantity} عنصر${totalQuantity > 1 ? "ات" : ""}`}
        onClick={collapseNavbar}
      >
        <div className={`cart-icon-wrapper ${sizeClass}`}>
          <AiOutlineShoppingCart className="cart-icon" />
          {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
        </div>
      </NavLink>
    </WrapperTag>
  );
};

export default CartIcon;

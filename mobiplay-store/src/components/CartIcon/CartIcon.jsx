// src/components/CartIcon/CartIcon.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../redux/slices/userSlice";
import { selectCartItems } from "../../redux/slices/cartSlice";
import LoginRequiredModal from "../Common/LoginRequiredModal/LoginRequiredModal";
import "./CartIcon.css";

const CartIcon = ({ collapseNavbar, size = "small", wrapper = "li", showBadge = true }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const [bump, setBump] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (totalQuantity === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [totalQuantity]);

  const sizeClass = `cart-icon-${size}`;
  const WrapperTag = wrapper;
  const cartTitle =
    totalQuantity === 0
      ? t("cart.emptyMessage")
      : t("cart.itemsCount", { count: totalQuantity });

  const handleClick = (e) => {
    e.preventDefault();
    collapseNavbar?.();

    if (!user) {
      setShowModal(true);
      return;
    }

    navigate(`/${user?.language || "en"}/cart`);
  };

  const handleConfirmLogin = () => {
    setShowModal(false);
    navigate(`/${user?.language || "en"}/login`, {
      state: { fromCart: true },
    });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <WrapperTag className="cart-wrapper">
        <button
          className={`cart-link ${bump ? "bump" : ""}`}
          title={cartTitle}
          onClick={handleClick}
        >
          <div className={`cart-icon-wrapper ${sizeClass}`}>
            <AiOutlineShoppingCart className="cart-icon" />
            {showBadge && totalQuantity > 0 && (
              <span className="cart-badge">{totalQuantity}</span>
            )}
          </div>
        </button>
      </WrapperTag>

      <LoginRequiredModal
        show={showModal}
        onConfirm={handleConfirmLogin}
        onCancel={handleCancel}
      />
    </>
  );
};

export default CartIcon;

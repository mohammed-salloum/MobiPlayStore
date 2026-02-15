// =========================
// 🛒 Cart Icon Component
// -------------------------
// - Displays a shopping cart icon in the navbar
// - Shows a badge with total items in the cart
// - Bumps on quantity change
// - Handles user login requirement before navigating to cart
// - Supports flexible wrapper tag and sizes
// =========================

import { useMemo, useState, useEffect } from "react";
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

  // Redux state selectors
  const user = useSelector(selectUser);          // Current logged-in user
  const cartItems = useSelector(selectCartItems);// Items in cart

  // Calculate total quantity of items in cart (memoized for performance)
  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Local state for animation and login modal
  const [bump, setBump] = useState(false);       // Trigger bump animation on change
  const [showModal, setShowModal] = useState(false); // Show login-required modal

  // Trigger "bump" animation whenever cart quantity changes
  useEffect(() => {
    if (totalQuantity === 0) return; // Do not animate if cart is empty
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300); // Remove bump after 300ms
    return () => clearTimeout(timer);
  }, [totalQuantity]);

  // Determine CSS classes based on props
  const sizeClass = `cart-icon-${size}`; // e.g., small, medium, large
  const WrapperTag = wrapper;            // e.g., li, div, span

  // Cart title for tooltip / accessibility
  const cartTitle =
    totalQuantity === 0
      ? t("cart.emptyMessage")           // e.g., "Cart is empty"
      : t("cart.itemsCount", { count: totalQuantity }); // e.g., "3 items"

  // Click handler
  const handleClick = (e) => {
    e.preventDefault();
    collapseNavbar?.(); // Collapse navbar on mobile if passed

    if (!user) {
      setShowModal(true); // Show login modal if user is not logged in
      return;
    }

    navigate(`/${user?.language || "en"}/cart`); // Navigate to cart page
  };

  // Modal confirm (redirect to login)
  const handleConfirmLogin = () => {
    setShowModal(false);
    navigate(`/${user?.language || "en"}/login`, {
      state: { fromCart: true }, // Keep track of redirect from cart
    });
  };

  // Modal cancel handler
  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Wrapper tag allows flexible usage in navbars */}
      <WrapperTag className="cart-wrapper">
        <button
          className={`cart-link ${bump ? "bump" : ""}`} // Add bump animation class
          title={cartTitle}                             // Tooltip for accessibility
          onClick={handleClick}                         // Handle click
        >
          <div className={`cart-icon-wrapper ${sizeClass}`}>
            <AiOutlineShoppingCart className="cart-icon" />
            
            {/* Badge showing total quantity if > 0 */}
            {showBadge && totalQuantity > 0 && (
              <span className="cart-badge">{totalQuantity}</span>
            )}
          </div>
        </button>
      </WrapperTag>

      {/* Login Required Modal */}
      <LoginRequiredModal
        show={showModal}
        onConfirm={handleConfirmLogin}
        onCancel={handleCancel}
      />
    </>
  );
};

export default CartIcon;
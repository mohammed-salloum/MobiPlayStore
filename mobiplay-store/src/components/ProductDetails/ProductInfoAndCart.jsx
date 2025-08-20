// src/components/ProductInfoAndCart/ProductInfoAndCart.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RatingStars from "../common/RatingStars";
import Button from "../common/Button";
import "./ProductInfoAndCart.css";

function ProductInfoAndCart({
  product,
  quantity,
  setQuantity,
  totalPrice,
  darkMode,
  cartItem,
  onAddToCart,
  onRemoveFromCart
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [userRating, setUserRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
  };

  return (
    <div className={`product-info-cart-wrapper ${darkMode ? "dark" : "light"} ${isRTL ? "rtl" : "ltr"}`}>

      <h2 className={`product-name ${darkMode ? "text-light" : "text-dark"}`}>
        {product.name}
      </h2>

      <p>
        <strong>{t("productDetails.game")}:</strong> {product.game || product.name}
      </p>

      <p>
        <strong>{t("productDetails.price")}:</strong> ${product.price.toFixed(2)}
      </p>

      <p className={`product-description ${darkMode ? "text-light" : "text-dark"}`}>
        <strong>{t("productDetails.description")}:</strong> {t(product.descriptionKey)}
      </p>

      <div className={`quantity-wrapper ${isRTL ? "rtl" : ""}`}>
        <label className={darkMode ? "text-light" : ""}>
          <strong>{t("productDetails.quantity")}:</strong>
        </label>
        <div className="quantity-controls">
          <Button
            variant="quantity"
            dark={darkMode}
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            -
          </Button>
          <input
            type="number"
            className={`qty-input ${darkMode ? "dark" : "light"}`}
            value={quantity}
            min="1"
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          />
          <Button
            variant="quantity"
            dark={darkMode}
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <p className={darkMode ? "text-light" : ""}>
        <strong>{t("productDetails.totalPrice")}:</strong> ${totalPrice}
      </p>

      <div className={`rate-product-row ${darkMode ? "text-light" : "text-dark"}`}>
        <span>{t("productDetails.rateThis")}</span>
        <RatingStars
          userRating={userRating}
          onRate={handleRate}
          allowRate={true}
          darkMode={darkMode}
          isRTL={isRTL}
        />
      </div>

      {showThankYou && (
        <div className={`thank-you-alert ${darkMode ? "text-light" : "text-dark"}`}>
          ✅ {t("productDetails.thankYou")}
        </div>
      )}

      {/* Cart Buttons Vertical */}
      <div className={`cart-buttons ${isRTL ? "rtl" : ""}`}>
        <Button
          variant="add-cart"
          dark={darkMode}
          onClick={onAddToCart}
          fullWidth
        >
          {cartItem ? t("productDetails.updateCart") : t("productDetails.addToCart")}
        </Button>

        {cartItem && (
          <Button
            variant="remove-cart"
            dark={darkMode}
            onClick={onRemoveFromCart}
            fullWidth
          >
            {t("productDetails.remove")}
          </Button>
        )}
      </div>

    </div>
  );
}

export default ProductInfoAndCart;

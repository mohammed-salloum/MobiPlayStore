import React, { useState, useEffect } from "react";
import Button from "../common/Button/Button";
import { useTranslation } from "react-i18next";
import { formatUSD } from "../../services/api";
import "./ProductInfoSection.css";

function ProductInfoSection({
  product,
  quantity,
  setQuantity,
  cartItem,
  onAddToCart,
  onRemoveFromCart,
  onBack,
  theme,
  isRTL,
}) {
  const { t } = useTranslation();
  const [description, setDescription] = useState(product.description || "");

  useEffect(() => {
    setDescription(product.description || "");
  }, [product.description]);

  const displayPrice = Number(product.discountedPrice ?? product.price);
  const formattedDisplayPrice = formatUSD(displayPrice);
  const formattedTotalPrice = formatUSD(displayPrice * quantity);

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  return (
    <div className={`product-info-cart theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
      {/* وصف المنتج */}
      <div className="product-description">
        <strong>{t("productDetails.description")}:</strong>
        {description?.trim() ? (
          <div
            className="product-description-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <span>{t("productDetails.noDescription")}</span>
        )}
      </div>

      {/* السعر */}
      <p>
        <strong>{t("productDetails.price")}:</strong> {formattedDisplayPrice}
      </p>

      {/* اختيار الكمية */}
      <div className={`quantity-wrapper ${isRTL ? "rtl" : "ltr"}`}>
        <span className="quantity-label">{t("productDetails.quantity")}:</span>
        <div className="quantity-controls">
          <Button variant="quantity" onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
          <input
            type="number"
            className="qty-input"
            value={quantity}
            min="1"
            onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
          />
          <Button variant="quantity" onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
        </div>
      </div>

      {/* السعر الإجمالي */}
      <p>
        <strong>{t("productDetails.totalPrice")}:</strong> {formattedTotalPrice}
      </p>

      {/* أزرار السلة + زر العودة */}
      <div className={`cart-buttons ${cartItem ? "has-cart" : ""}`}>
        <Button
          variant="add-cart"
          onClick={onAddToCart}
          fullWidth
          disabled={quantity < 1}
        >
          {cartItem ? t("productDetails.updateCart") : t("productDetails.addToCart")}
        </Button>
        <Button variant="remove-cart" onClick={onRemoveFromCart}>
          {t("productDetails.remove")}
        </Button>
        <Button variant="back" onClick={onBack}>
          {isRTL ? "← " : "→ "} {t("productDetails.back")}
        </Button>
      </div>
    </div>
  );
}

export default ProductInfoSection;

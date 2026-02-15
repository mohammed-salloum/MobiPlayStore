import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../Common/Button/Button";
import { useTranslation } from "react-i18next";
import { formatUSD } from "../../services/api";
import { addToCart, setQuantityExact, removeFromCart } from "../../redux/slices/cartSlice";
import "./ProductInfoSection.css";

function ProductInfoSection({
  product,
  quantity,
  setQuantity,
  cartItem,
  onBack,
  theme,
  isRTL,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [description, setDescription] = useState(product.description || "");

  // Update description if product changes
  useEffect(() => {
    setDescription(product.description || "");
  }, [product.description]);

  // Determine display price and total price
  const displayPrice = Number(product.discountedPrice ?? product.price);
  const formattedDisplayPrice = formatUSD(displayPrice);
  const formattedTotalPrice = formatUSD(displayPrice * quantity);

  // Handle quantity change, minimum 1
  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    setQuantity(newQty);
  };

  // Add to cart or update quantity if already in cart
  const handleAddOrUpdate = () => {
    if (cartItem) {
      dispatch(setQuantityExact({ id: product.id, quantity }));
    } else {
      dispatch(addToCart({ product, quantity }));
    }
  };

  // Remove item from cart
  const handleRemove = () => {
    if (cartItem) dispatch(removeFromCart(product.id));
  };

  return (
    <div className={`product-info-cart theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
      {/* Product description */}
      <div className="product-description">
        <strong>{t("productDetails.description")}:</strong>
        {description?.trim() ? (
          <div
            className="product-description-content"
            dangerouslySetInnerHTML={{ __html: description }} // Render HTML description
          />
        ) : (
          <span>{t("productDetails.noDescription")}</span>
        )}
      </div>

      {/* Single item price */}
      <p>
        <strong>{t("productDetails.price")}:</strong> {formattedDisplayPrice}
      </p>

      {/* Quantity selector */}
      <div className={`quantity-wrapper ${isRTL ? "rtl" : "ltr"}`}>
        <strong className="quantity-label">{t("productDetails.quantity")}:</strong>
        <div className={`quantity-controls ${isRTL ? "rtl" : "ltr"}`}>
          <Button
            variant="quantity"
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            -
          </Button>
          <input
            type="number"
            className="qty-input"
            value={quantity}
            min="1"
            onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
          />
          <Button
            variant="quantity"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>

      {/* Total price for selected quantity */}
      <p>
        <strong>{t("productDetails.totalPrice")}:</strong> {formattedTotalPrice}
      </p>

      {/* Cart action buttons */}
      <div className="cart-buttons">
        <Button
          variant="primary"
          onClick={handleAddOrUpdate}
          fullWidth
          disabled={quantity < 1} // Disable if quantity is invalid
        >
          {cartItem ? t("productDetails.updateCart") : t("productDetails.addToCart")}
        </Button>

        {/* Remove from cart button only if item exists */}
        {cartItem && (
          <Button variant="remove-cart" onClick={handleRemove}>
            {t("productDetails.remove")}
          </Button>
        )}

        {/* Back navigation button */}
        <Button variant="back" onClick={onBack}>
          {isRTL ? "← " : "→ "} {t("productDetails.back")}
        </Button>
      </div>
    </div>
  );
}

export default ProductInfoSection;

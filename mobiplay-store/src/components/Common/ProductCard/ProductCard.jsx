import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "../Button/Button";
import RatingReadOnly from "../Rating/RatingReadOnly";
import { formatUSD } from "../../../services/api";
import { selectReviews } from "../../../redux/slices/reviewsSlice";
import "./ProductCard.css";

/**
 * ProductCard Component
 * Displays individual product details including image, price, rating, and cart actions.
 *
 * Props:
 * - product: product object containing id, name, img, price, discountedPrice, discount, rating, ratingCount
 * - isRTL: boolean to enable right-to-left layout
 * - inCart: boolean indicating if the product is already in the cart
 * - onToggleCart: function to add/remove product from cart
 */
function ProductCard({ product, isRTL = false, inCart = false, onToggleCart }) {
  const { t } = useTranslation(); // Translation hook
  const reviews = useSelector(selectReviews); // Get reviews from Redux store

  // Handle pricing calculations
  const price = Number(product.price) || 0;
  const discountedPrice = Number(product.discountedPrice ?? price);
  const discount = Number(product.discount ?? 0);

  // Get review data: fallback to product rating if no Redux review exists
  const reviewData = reviews[product.id] || {
    userRating: 0,
    avgRating: Number(product.rating ?? 0),
    ratingCount: Number(product.ratingCount ?? 0),
  };

  const ratingValue = Number(reviewData.avgRating) || 0;
  const reviewCount = Number(reviewData.ratingCount) || 0;

  return (
    <div className={`product-card ${isRTL ? "rtl" : "ltr"}`}>
      
      {/* Product Image Section */}
      <div className="image-wrapper">
        <img
          src={product.img}
          alt={`${product.name} cover`}
          className="product-image"
          loading="lazy" /* Lazy load for performance */
        />
        {discount > 0 && (
          <span className={`discount-badge ${isRTL ? "ar" : "en"}`}>
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Details Section */}
      <div className="content-wrapper">
        {/* Product Name */}
        <p className="product-name">{product.name}</p>

        {/* Price and Rating */}
        <div className="info-section">
          <div className={`price-wrapper ${isRTL ? "ar" : "en"}`}>
            {discount > 0 && <span className="old-price">{formatUSD(price)}</span>}
            <span className="new-price">{formatUSD(discountedPrice)}</span>
          </div>

          <div className="rating-wrapper">
            <RatingReadOnly rating={ratingValue} reviewCount={reviewCount} theme="light" />
          </div>
        </div>

        {/* Cart Action Buttons */}
        <div className={`cart-buttons ${isRTL ? "rtl" : "ltr"}`}>
          <Button
            onClick={onToggleCart}
            variant={inCart ? "remove-cart" : "add-cart"}
          >
            {inCart ? t("products.removeFromCart") : t("products.addToCart")}
          </Button>

          {/* Link to Product Details Page */}
          <Button as={Link} to={`/product/${product.id}`} variant="details">
            {t("products.details")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
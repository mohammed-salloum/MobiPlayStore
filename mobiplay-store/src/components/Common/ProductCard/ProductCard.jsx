import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "../Button/Button";
import RatingReadOnly from "../Rating/RatingReadOnly";
import { formatUSD } from "../../../services/api";
import { selectReviews } from "../../../redux/slices/reviewsSlice";
import "./ProductCard.css";

function ProductCard({ product, isRTL = false, inCart = false, onToggleCart }) {
  const { t } = useTranslation();
  const reviews = useSelector(selectReviews);

  const price = Number(product.price) || 0;
  const discountedPrice = Number(product.discountedPrice ?? price);
  const discount = Number(product.discount ?? 0);

  const reviewData = reviews[product.id] || {
    userRating: 0,
    avgRating: Number(product.rating ?? 0),
    ratingCount: Number(product.ratingCount ?? 0),
  };

  const ratingValue = Number(reviewData.avgRating) || 0;
  const reviewCount = Number(reviewData.ratingCount) || 0;

  return (
    <div className={`product-card ${isRTL ? "rtl" : "ltr"}`}>
      {/* صورة المنتج */}
      <div className="image-wrapper">
        <img
          src={product.img}
          alt={`${product.name} cover`}
          className="product-image"
          loading="lazy"
        />
        {discount > 0 && (
          <span className={`discount-badge ${isRTL ? "ar" : "en"}`}>
            -{discount}%
          </span>
        )}
      </div>

      {/* المحتوى */}
      <div className="content-wrapper">
        {/* اسم المنتج */}
        <p className="product-name">{product.name}</p>

        {/* السعر + التقييم (وسط البطاقة) */}
        <div className="info-section">
          <div className={`price-wrapper ${isRTL ? "ar" : "en"}`}>
            {discount > 0 && <span className="old-price">{formatUSD(price)}</span>}
            <span className="new-price">{formatUSD(discountedPrice)}</span>
          </div>

          <div className="rating-wrapper">
            <RatingReadOnly rating={ratingValue} reviewCount={reviewCount} theme="light" />
       
          </div>
        </div>

        {/* أزرار السلة */}
        <div className={`cart-buttons ${isRTL ? "rtl" : "ltr"}`}>
          <Button
            onClick={onToggleCart}
            variant={inCart ? "remove-cart" : "add-cart"}
          >
            {inCart ? t("products.removeFromCart") : t("products.addToCart")}
          </Button>

          <Button as={Link} to={`/product/${product.id}`} variant="details">
            {t("products.details")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

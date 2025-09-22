import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import RatingReadOnly from "../Rating/RatingReadOnly";
import { formatUSD } from "../../../services/api";
import { calculateLocalRating } from "../../../services/calculateLocalRating";
import "./ProductCard.css";

function ProductCard({ product, isRTL = false, inCart = false, onToggleCart }) {
  const { t } = useTranslation();

  const price = Number(product.price) || 0;
  const discountedPrice = Number(product.discountedPrice ?? price);
  const discount = Number(product.discount ?? 0);

  // ✅ القيم المبدئية من البيانات الأساسية
  const { ratingValue: initialValue, reviewCount: initialCount } =
    calculateLocalRating(
      product.rating ?? 0,
      product.ratingCount ?? 0,
      product.id
    );

  // ✅ التحقق من وجود قيم مخزنة بالـ localStorage
  const storedRating = Number(localStorage.getItem(`rating_${product.id}`));
  const storedCount = Number(localStorage.getItem(`ratingCount_${product.id}`));
  const storedAvg = Number(localStorage.getItem(`avgRating_${product.id}`));

  // ✅ اختيار القيم النهائية
  const ratingValue = storedAvg || initialValue;
  const reviewCount = storedCount || initialCount;

  return (
    <div className={`product-card ${isRTL ? "rtl" : "ltr"}`}>
      {/* الصورة والبادج */}
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
        <h5 className="product-name">{product.name}</h5>

        <div className="price-rating-wrapper">
          <div className={`price-wrapper ${isRTL ? "ar" : "en"}`}>
            {discount > 0 && (
              <span className="old-price">{formatUSD(price)}</span>
            )}
            <span className="new-price">{formatUSD(discountedPrice)}</span>
          </div>

          <RatingReadOnly rating={ratingValue} reviewCount={reviewCount} />
        </div>

        <div className={`cart-buttons ${isRTL ? "rtl" : "ltr"}`}>
          <Button
            onClick={onToggleCart}
            variant={inCart ? "remove-cart" : "add-cart"}
          >
            {inCart
              ? t("products.removeFromCart")
              : t("products.addToCart")}
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

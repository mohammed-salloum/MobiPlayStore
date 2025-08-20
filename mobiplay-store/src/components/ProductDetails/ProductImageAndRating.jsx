import { useTranslation } from "react-i18next";
import RatingReadOnly from "../common/RatingReadOnly";
import "./ProductImageAndRating.css";

function ProductImageAndRating({
  product,
  avgRating = 4.3,
  ratingCount = 0,
  darkMode = false,
  isRTL = false
}) {
  const { t } = useTranslation();

  return (
    <div className={`product-image-rating-wrapper ${isRTL ? "rtl" : "ltr"}`}>
      <div className="product-image-container">
        {/* صورة المنتج */}
        <img src={product.img} alt={product.name} className="product-image" />

        {/* التقييم الافتراضي فقط */}
        <div className="product-rating-section mt-2">
          <RatingReadOnly
            rating={avgRating}
            reviewCount={ratingCount}
            darkMode={darkMode}
            isRTL={isRTL}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductImageAndRating;

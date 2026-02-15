import { useState } from "react";
import RatingReadOnly from "../Common/Rating/RatingReadOnly";
import RatingInteractive from "../Common/Rating/RatingInteractive";
import { useDispatch, useSelector } from "react-redux";
import { setRating, selectReviews } from "../../redux/slices/reviewsSlice";
import { useTranslation } from "react-i18next";
import "./ProductImageSection.css";

function ProductImageSection({ product, theme, isRTL }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);

  // Get review data from Redux store for this product
  const reviewData = reviews[product.id];
  const userRating = reviewData?.userRating ?? 0; // Current user's rating
  const avgRating = reviewData?.avgRating ?? Number(product.rating ?? 0); // Average rating
  const ratingCount = reviewData?.ratingCount ?? Number(product.ratingCount ?? 0); // Total ratings

  const [showThankYou, setShowThankYou] = useState(false); // Show temporary thank you alert

  // Handle user rating submission
  const handleRate = (rating) => {
    if (userRating > 0) return; // Prevent multiple ratings
    dispatch(
      setRating({
        productId: product.id,
        rating,
        productRating: Number(product.rating ?? 0),
        productRatingCount: Number(product.ratingCount ?? 0),
      })
    );
    setShowThankYou(true); // Show alert
    setTimeout(() => setShowThankYou(false), 5000); // Hide after 5s
  };

  return (
    <div className={`product-details-horizontal ${isRTL ? "rtl" : "ltr"}`}>
      {/* Product image side */}
      <div className="product-image-side">
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>

      {/* Product info side */}
      <div className="product-info-side">
        <h1 className="product-name-detail">{product.name}</h1>

        {/* Read-only average rating */}
        <RatingReadOnly
          rating={Number(avgRating)}
          reviewCount={Number(ratingCount)}
          theme={theme}
          isRTL={isRTL}
        />

        {/* Interactive rating for user */}
        <div className="rate-product-row">
          <RatingInteractive
            userRating={Number(userRating)}
            onRate={handleRate}
            allowRate={userRating === 0} // Disable hover if already rated
            theme={theme}
            isRTL={isRTL}
          />

          {/* Thank you message after rating */}
          <div className={`thank-you-alert ${showThankYou ? "show" : ""}`}>
            ✅ {t("productDetails.thankYou")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductImageSection;
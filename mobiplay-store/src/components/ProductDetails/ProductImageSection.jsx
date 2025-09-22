import React, { useState, useEffect } from "react";
import RatingReadOnly from "../common/Rating/RatingReadOnly";
import RatingInteractive from "../common/Rating/RatingInteractive";
import { useTranslation } from "react-i18next";
import "./ProductImageSection.css";

function ProductImageSection({
  product,
  avgRating = 0,
  ratingCount = 0,
  onRate,
  theme,
  isRTL,
}) {
  const { t } = useTranslation();

  const [userRating, setUserRating] = useState(avgRating);
  const [localRatingCount, setLocalRatingCount] = useState(ratingCount);
  const [localAvgRating, setLocalAvgRating] = useState(avgRating);
  const [showThankYou, setShowThankYou] = useState(false);

  // تحميل التقييم من localStorage عند التهيئة
  useEffect(() => {
    const storedRating = Number(localStorage.getItem(`rating_${product.id}`));
    const storedCount = Number(localStorage.getItem(`ratingCount_${product.id}`));
    const storedAvg = Number(localStorage.getItem(`avgRating_${product.id}`));

    if (storedRating && storedCount && storedAvg) {
      setUserRating(storedRating);
      setLocalRatingCount(storedCount);
      setLocalAvgRating(storedAvg);
    }
  }, [product.id]);

  const handleRate = (rating) => {
    if (rating < 0 || rating > 5) return;

    const prevRating = Number(localStorage.getItem(`rating_${product.id}`)) || 0;
    const prevCount = Number(localStorage.getItem(`ratingCount_${product.id}`)) || ratingCount;
    const prevAvg = Number(localStorage.getItem(`avgRating_${product.id}`)) || avgRating;

    localStorage.setItem(`rating_${product.id}`, rating);

    const hasRatedBefore = prevRating > 0;
    const newCount = hasRatedBefore ? prevCount : prevCount + 1;
    localStorage.setItem(`ratingCount_${product.id}`, newCount);

    const newAvg = hasRatedBefore
      ? (prevAvg * prevCount - prevRating + rating) / newCount
      : (prevAvg * prevCount + rating) / newCount;
    localStorage.setItem(`avgRating_${product.id}`, newAvg);

    setUserRating(rating);
    setLocalRatingCount(newCount);
    setLocalAvgRating(newAvg);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);

    if (onRate) onRate(rating);
  };

  return (
    <div className={`product-details-horizontal ${isRTL ? "rtl" : "ltr"}`}>
      {/* صورة المنتج */}
      <div className="product-image-side">
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>

      {/* تفاصيل التقييم والنصوص */}
      <div className="product-info-side">
        <h2 className="product-name">{product.name}</h2>

        <RatingReadOnly
          rating={parseFloat(localAvgRating.toFixed(1))}
          reviewCount={localRatingCount}
          theme={theme}
          isRTL={isRTL}
        />

        <div className="rate-product-row">
          <RatingInteractive
            userRating={userRating}
            onRate={handleRate}
            allowRate={true}
            theme={theme}
            isRTL={isRTL}
          />

          <div className={`thank-you-alert ${showThankYou ? "show" : ""}`}>
            ✅ {t("productDetails.thankYou")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductImageSection;

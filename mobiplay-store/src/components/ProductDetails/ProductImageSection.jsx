import React, { useState } from "react";
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

  // ✅ استخدم Redux مباشرة وليس نسخة ثابتة
  const reviewData = reviews[product.id];
  const userRating = reviewData?.userRating ?? 0;
  const avgRating = reviewData?.avgRating ?? Number(product.rating ?? 0);
  const ratingCount = reviewData?.ratingCount ?? Number(product.ratingCount ?? 0);

  const [showThankYou, setShowThankYou] = useState(false);

  const handleRate = (rating) => {
    if (userRating > 0) return; // المستخدم قيم من قبل
    dispatch(
      setRating({
        productId: product.id,
        rating,
        productRating: Number(product.rating ?? 0),
        productRatingCount: Number(product.ratingCount ?? 0),
      })
    );
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  };

  return (
    <div className={`product-details-horizontal ${isRTL ? "rtl" : "ltr"}`}>
      <div className="product-image-side">
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>

      <div className="product-info-side">
        <h1 className="product-name-detail">{product.name}</h1>

        <RatingReadOnly
          rating={Number(avgRating)}
          reviewCount={Number(ratingCount)}
          theme={theme}
          isRTL={isRTL}
        />

        <div className="rate-product-row">
          <RatingInteractive
            userRating={Number(userRating)}
            onRate={handleRate}
            allowRate={userRating === 0} // لن يسمح بالهوفر بعد التقييم
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

// RatingReadOnly.jsx
import React from "react";
import Stars from "./Stars";
import { useTranslation } from "react-i18next";

function RatingReadOnly({
  rating = 0,
  reviewCount = 0,
  theme = "light",
  totalStars = 5,
  size = 22
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Stars
      rating={rating}
      reviewCount={reviewCount}
      totalStars={totalStars}
      isRTL={isRTL}
      theme={theme}
      interactive={false} // قراءة فقط
      size={size}
    />
  );
}

export default RatingReadOnly;

// RatingInteractive.jsx
import React from "react";
import Stars from "./Stars";
import { useTranslation } from "react-i18next";

function RatingInteractive({ 
  userRating = 0,
  onRate,
  allowRate = true,
  theme = "light",
  isRTL = false,
  totalStars = 5,
  size = 28 // حجم النجوم
}) {
  const { t } = useTranslation();

  return (
    <div className={`rating-interactive-wrapper ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="rate-text">
        {t("productDetails.rateThis")}
      </div>

      <Stars
        interactive={allowRate}
        userRating={userRating}
        onRate={onRate}
        theme={theme}
        isRTL={isRTL}
        totalStars={totalStars}
        size={size}
      />
    </div>
  );
}

export default RatingInteractive;

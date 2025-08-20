import React from "react";
import RatingStars from "./RatingStars";
import { useTranslation } from "react-i18next";

function RatingInteractive({ userRating = 0, onRate, allowRate = true, darkMode = false, isRTL = false }) {
  const { t } = useTranslation();

  return (
    <div className={`rating-interactive-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* النص يظهر مرة واحدة هنا */}
      <div className={`rate-text ${darkMode ? "dark" : "light"}`}>
        {t("productDetails.rateThis")}
      </div>

      <RatingStars
        userRating={userRating}
        onRate={onRate}
        allowRate={allowRate}
        darkMode={darkMode}
        isRTL={isRTL}
      />
    </div>
  );
}

export default RatingInteractive;

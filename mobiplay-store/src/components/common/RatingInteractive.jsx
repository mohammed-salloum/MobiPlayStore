import React from "react";
import RatingStars from "./RatingStars"; // كومبوننت النجوم التفاعلية
import { useTranslation } from "react-i18next"; // hook للترجمة

// 🔹 كومبوننت يسمح للمستخدم بتقييم المنتج (تفاعلي)
function RatingInteractive({ 
  userRating = 0,      // التقييم الحالي للمستخدم (افتراضي 0)
  onRate,              // دالة callback تُستدعى عند تقييم المستخدم
  allowRate = true,    // هل يسمح للمستخدم بالتصويت؟
  darkMode = false,    // الوضع الداكن أو الفاتح
  isRTL = false        // اتجاه النصوص (Right-To-Left / Left-To-Right)
}) {
  const { t } = useTranslation(); // للحصول على دالة الترجمة

  return (
    <div className={`rating-interactive-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* 🔹 نص "قيم هذا المنتج" */}
      <div className={`rate-text ${darkMode ? "dark" : "light"}`}>
        {t("productDetails.rateThis")} {/* الترجمة حسب اللغة الحالية */}
      </div>

      {/* 🔹 عرض النجوم التفاعلية */}
      <RatingStars
        userRating={userRating}  // تمرير التقييم الحالي
        onRate={onRate}          // تمرير دالة callback لتخزين التقييم
        allowRate={allowRate}    // السماح بالتصويت
        darkMode={darkMode}      // الوضع الداكن/الفاتح
        isRTL={isRTL}            // اتجاه النصوص
      />
    </div>
  );
}

export default RatingInteractive;

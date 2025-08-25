import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // أيقونات النجوم: كاملة، نصف، فارغة
import { useTranslation } from 'react-i18next'; // hook للترجمة
import "./RatingReadOnly.css"; // CSS لتنسيق النجوم والنص

// 🔹 كومبوننت لعرض تقييم النجوم بشكل **قراءة فقط** (غير قابل للتغيير)
function RatingReadOnly({ rating = 0, reviewCount = 0, darkMode = false, totalStars = 5 }) {
  const { t, i18n } = useTranslation(); // الحصول على الترجمة واللغة الحالية
  const isRTL = i18n.language === "ar"; // التحقق إذا كانت اللغة عربية (يمين-إلى-يسار)

  const stars = []; // مصفوفة لتخزين أيقونات النجوم
  for (let i = 1; i <= totalStars; i++) {
    if (i <= Math.floor(rating))
      stars.push(<FaStar key={i} className="star-readonly filled" />); // نجمة كاملة
    else if (i === Math.ceil(rating) && rating % 1 !== 0)
      stars.push(<FaStarHalfAlt key={i} className="star-readonly filled half" />); // نصف نجمة
    else
      stars.push(<FaRegStar key={i} className="star-readonly" />); // نجمة فارغة
  }

  if (isRTL) stars.reverse(); // إذا كانت اللغة عربية، نقلب ترتيب النجوم لتصبح من اليمين لليسار

  return (
    <div
      className={`rating-readonly-wrapper ${darkMode ? "dark-mode" : "light-mode"}`} // الوضع الداكن أو الفاتح
      dir={isRTL ? 'rtl' : 'ltr'} // ضبط اتجاه النصوص حسب اللغة
    >
      {/* 🔹 عرض النجوم */}
      <div className="stars-readonly">{stars}</div>

      {/* 🔹 عرض التقييم العددي وعدد المراجعات مع الترجمة */}
      <div className="rating-text">
        {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? t('products.review') : t('products.reviews')})
      </div>
    </div>
  );
}

export default RatingReadOnly;

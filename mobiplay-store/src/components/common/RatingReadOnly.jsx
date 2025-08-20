import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import "./RatingReadOnly.css";

function RatingReadOnly({ rating = 0, reviewCount = 0, darkMode = false, totalStars = 5 }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    if (i <= Math.floor(rating))
      stars.push(<FaStar key={i} className="star-readonly filled" />);
    else if (i === Math.ceil(rating) && rating % 1 !== 0)
      stars.push(<FaStarHalfAlt key={i} className="star-readonly filled half" />);
    else
      stars.push(<FaRegStar key={i} className="star-readonly" />);
  }

  if (isRTL) stars.reverse();

  return (
    <div className={`rating-readonly-wrapper ${darkMode ? "dark-mode" : "light-mode"}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="stars-readonly">{stars}</div>
      <div className="rating-text">
        {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? t('products.review') : t('products.reviews')})
      </div>
    </div>
  );
}

export default RatingReadOnly;

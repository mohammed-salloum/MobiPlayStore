import React, { useEffect, useContext } from 'react';
import ReviewCard from '../../components/Reviews/ReviewCard';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Reviews.css';

function Reviews() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // تطبيق الثيم
    document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr'); // تطبيق اتجاه النص
  }, [theme, isRTL]);

  const testimonials = t('reviews.items', { returnObjects: true });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<span key={i} className="star filled">★</span>);
      else if (rating >= i - 0.5) stars.push(<span key={i} className="star half">☆</span>);
      else stars.push(<span key={i} className="star empty">☆</span>);
    }
    return stars;
  };

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">{t('reviews.title')}</h2>
      <div className="reviews-grid">
        {testimonials.map((review, idx) => (
          <ReviewCard
            key={idx}
            {...review}
            renderStars={renderStars}
          />
        ))}
      </div>
    </div>
  );
}

export default Reviews;

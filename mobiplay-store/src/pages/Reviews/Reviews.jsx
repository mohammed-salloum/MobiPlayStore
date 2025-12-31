import { useEffect, useContext } from 'react';
import ReviewCard from '../../components/Reviews/ReviewCard';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Reviews.css';

function Reviews() {
  const { theme } = useContext(ThemeContext); // Get current theme (light/dark)
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar'; // Check if Arabic (RTL)

  // Apply theme and text direction to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [theme, isRTL]);

  // Fetch reviews from i18n translations
  const testimonials = t('reviews.items', { returnObjects: true });

  // Render stars for rating
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
            renderStars={renderStars} // Pass star renderer to ReviewCard
          />
        ))}
      </div>
    </div>
  );
}

export default Reviews;

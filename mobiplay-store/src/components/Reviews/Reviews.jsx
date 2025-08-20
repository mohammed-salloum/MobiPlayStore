import React, { useContext } from 'react';
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import './Reviews.css';

function Reviews() {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  const testimonials = [
    { id: 1, name: t('reviews.items.0.name'), feedback: t('reviews.items.0.feedback'), rating: 5 },
    { id: 2, name: t('reviews.items.1.name'), feedback: t('reviews.items.1.feedback'), rating: 4 },
    { id: 3, name: t('reviews.items.2.name'), feedback: t('reviews.items.2.feedback'), rating: 4.5 },
    { id: 4, name: t('reviews.items.3.name'), feedback: t('reviews.items.3.feedback'), rating: 5 },
  ];

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
    <div className="reviews-container container mt-5 mb-5 px-3">
      <h2 className="reviews-title text-center fw-bold">{t('reviews.title')}</h2>

      <div className="reviews-grid">
        {testimonials.map(({ id, name, feedback, rating }) => (
          <div
            key={id}
            className={`review-card ${darkMode ? 'dark' : 'light'}`}
          >
            <h5 className="review-name">{name}</h5>
            <div className="review-stars">{renderStars(rating)}</div>
            <p className="review-feedback">"{feedback}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;

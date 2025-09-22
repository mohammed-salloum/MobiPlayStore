// src/components/Reviews/ReviewCard.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ReviewCard.css';

function ReviewCard({ name, feedback, rating, renderStars }) {
  const { theme } = useContext(ThemeContext); // light, dark, blue, green, ...

  return (
    <div className={`review-card theme-${theme}`}>
      <h5 className="review-name">{name}</h5>
      <div className="review-stars">{renderStars(rating)}</div>
      <p className="review-feedback">{feedback}</p>
    </div>
  );
}

export default ReviewCard;

import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./RatingStars.css";

function RatingStars({ userRating = 0, onRate, allowRate = true, darkMode = false }) {
  const [hovered, setHovered] = useState(0);
  const [currentRating, setCurrentRating] = useState(userRating);

  useEffect(() => {
    setCurrentRating(userRating);
  }, [userRating]);

  const stars = [1, 2, 3, 4, 5];
  const ratingToShow = hovered || currentRating;

  const handleClick = (star) => {
    if (!allowRate || currentRating !== 0) return; // يسمح بالضغط مرة واحدة فقط
    setCurrentRating(star);
    if (onRate) onRate(star);
  };

  return (
    <div className={`stars-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
      {stars.map((star) => {
        let fill = "empty";
        if (ratingToShow >= star) fill = "full";
        else if (ratingToShow >= star - 0.5) fill = "half";

        return (
          <span
            key={star}
            className="star-wrapper"
            onMouseEnter={() => allowRate && currentRating === 0 && setHovered(star)}
            onMouseLeave={() => allowRate && setHovered(0)}
            onClick={() => handleClick(star)}
            style={{ cursor: allowRate && currentRating === 0 ? "pointer" : "default" }}
          >
            {fill === "full" && <FaStar className="rating-star filled" />}
            {fill === "half" && <FaStarHalfAlt className="rating-star filled" />}
            {fill === "empty" && <FaRegStar className="rating-star" />}
          </span>
        );
      })}
    </div>
  );
}

export default RatingStars;

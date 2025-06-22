import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

function RatingStars({ currentRating, onRate, disabled = false, size = 24 }) {
  const [hovered, setHovered] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      {stars.map((star) => {
        const isActive = hovered ? star <= hovered : star <= currentRating;
        const color = isActive ? "#ffc107" : "#e4e5e9";

        return (
          <FaStar
            key={star}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            onClick={() => !disabled && onRate(star)}
            style={{
              cursor: disabled ? "default" : "pointer",
              color,
              fontSize: size,
              transition: "color 0.2s",
              marginRight: 5,
            }}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            role={disabled ? "img" : "button"}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (!disabled && (e.key === "Enter" || e.key === " ")) {
                onRate(star);
              }
            }}
          />
        );
      })}
    </div>
  );
}

export default RatingStars;

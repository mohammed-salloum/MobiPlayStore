import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./Stars.css";

function Stars({
  rating = 0,
  reviewCount = 0,
  totalStars = 5,
  isRTL = false,
  theme = "light",
  interactive = false,
  userRating = 0,
  onRate,
  allowRate = true, // ✅ جديد
  size = 22
}) {
  const { t, i18n } = useTranslation();
  const [hovered, setHovered] = useState(0);
  const isArabic = i18n.language === "ar";

  const mapStarForRTL = (star) => (isRTL ? totalStars + 1 - star : star);

  const handleMouseEnter = (star) => interactive && allowRate && setHovered(mapStarForRTL(star));
  const handleMouseLeave = () => interactive && allowRate && setHovered(0);
  const handleClick = (star) => interactive && allowRate && onRate && onRate(mapStarForRTL(star));

  const starsArr = [];
  for (let i = 1; i <= totalStars; i++) {
    const displayStar = mapStarForRTL(i);
    let fill = "empty";

    // استخدام hover إذا موجود، وإلا userRating، وإلا rating
    const effectiveRating = hovered > 0 ? hovered : userRating || rating;

    if (effectiveRating >= displayStar) fill = "full";
    else if (effectiveRating >= displayStar - 0.5) fill = "half";

    starsArr.push(
      <span
        key={i}
        className={`star-wrapper ${interactive ? "interactive" : ""}`}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(i)}
        style={{ fontSize: `${size}px`, cursor: interactive && allowRate ? "pointer" : "default" }}
        role={interactive ? "button" : "img"}
        tabIndex={interactive ? 0 : -1}
        aria-label={`${i} ${t("products.stars")}`}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && interactive && allowRate) handleClick(i);
        }}
      >
        {fill === "full" && <FaStar className="star filled" />}
        {fill === "half" && (
          <span className={isRTL ? "rtl-half" : ""}>
            <FaStarHalfAlt className="star half" />
          </span>
        )}
        {fill === "empty" && <FaRegStar className="star" />}
      </span>
    );
  }

  if (isRTL) starsArr.reverse();

  return (
    <div
      className={`stars-wrapper ${theme} ${interactive ? "interactive" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="stars-and-number">
        <div className="stars">{starsArr}</div>
        {!interactive && <span className="rating-number">{Number(rating).toFixed(1)}</span>}
      </div>

      {!interactive && reviewCount > 0 && (
        <div className="review-count" aria-hidden="true">
          {isArabic
            ? `(${t("products.reviews")} ${reviewCount})`
            : `(${t("products.reviews")} ${reviewCount})`}
        </div>
      )}
    </div>
  );
}

export default Stars;

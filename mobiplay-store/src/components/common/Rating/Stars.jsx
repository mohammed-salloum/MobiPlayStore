import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./Stars.css";

function Stars({
  rating = 0,           // Average rating (readonly)
  reviewCount = 0,      // Number of reviews
  totalStars = 5,       // Total stars to display
  isRTL = false,        // Right-to-left layout
  theme = "light",      // Theme: light or dark
  interactive = false,  // Is the component clickable
  userRating = 0,       // User-selected rating (interactive)
  onRate,               // Callback when user rates
  allowRate = true,     // Can user rate (used with interactive)
  size = 22             // Star icon size
}) {
  const { t, i18n } = useTranslation();
  const [hovered, setHovered] = useState(0); // Track hover for preview
  const isArabic = i18n.language === "ar";

  // Adjust star mapping for RTL (so first star appears on right)
  const mapStarForRTL = (star) => (isRTL ? totalStars + 1 - star : star);

  // Hover handlers (only if interactive and allowed)
  const handleMouseEnter = (star) => interactive && allowRate && setHovered(mapStarForRTL(star));
  const handleMouseLeave = () => interactive && allowRate && setHovered(0);

  // Click handler for rating selection
  const handleClick = (star) => interactive && allowRate && onRate && onRate(mapStarForRTL(star));

  // Build stars array
  const starsArr = [];
  for (let i = 1; i <= totalStars; i++) {
    const displayStar = mapStarForRTL(i);
    let fill = "empty";

    // Determine which rating to use: hover > userRating > readonly rating
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
        role={interactive ? "button" : "img"}   // Accessibility
        tabIndex={interactive ? 0 : -1}
        aria-label={`${i} ${t("products.stars")}`}
        onKeyDown={(e) => {
          // Allow keyboard rating via Enter/Space
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

  // Optional reversal for RTL layout
  if (isRTL) starsArr.reverse();

  return (
    <div
      className={`stars-wrapper ${theme} ${interactive ? "interactive" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="stars-and-number">
        {/* Stars display */}
        <div className="stars">{starsArr}</div>
        {/* Read-only rating number */}
        {!interactive && <span className="rating-number">{Number(rating).toFixed(1)}</span>}
      </div>

      {/* Optional review count for read-only mode */}
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
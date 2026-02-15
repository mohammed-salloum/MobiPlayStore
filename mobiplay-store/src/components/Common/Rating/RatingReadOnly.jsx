import Stars from "./Stars";
import { useTranslation } from "react-i18next";

function RatingReadOnly({
  rating = 0,           // Current average rating to display
  reviewCount = 0,      // Number of reviews for display
  theme = "light",      // Theme: light or dark
  totalStars = 5,       // Total number of stars to display
  size = 22             // Size of the star icons in pixels
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // RTL layout if Arabic

  return (
    <Stars
      rating={rating}          // Value to fill stars
      reviewCount={reviewCount} // Optional display of review count
      totalStars={totalStars}   // Max number of stars
      isRTL={isRTL}             // Layout direction
      theme={theme}             // Theme for stars
      interactive={false}       // Read-only mode
      size={size}               // Icon size
    />
  );
}

export default RatingReadOnly;
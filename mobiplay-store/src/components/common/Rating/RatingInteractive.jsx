import Stars from "./Stars";
import { useTranslation } from "react-i18next";

function RatingInteractive({ 
  userRating = 0,           // Current rating by the user
  onRate,                   // Callback when user changes rating
  allowRate = true,         // Allow user to rate or make it read-only
  theme = "light",          // Theme: light or dark
  isRTL = false,            // Right-to-left layout
  totalStars = 5,           // Total number of stars
  size = 28                 // Star icon size in pixels
}) {
  const { t } = useTranslation();

  return (
    <div 
      className={`rating-interactive-wrapper ${theme}`} 
      dir={isRTL ? "rtl" : "ltr"}  // Support RTL layout
    >
      {/* Label text prompting user to rate */}
      <div className="rate-text">{t("productDetails.rateThis")}</div>

      {/* Star rating component */}
      <Stars
        interactive={true}       // Always interactive inside this wrapper
        allowRate={allowRate}    // Enable/disable rating based on prop
        userRating={userRating}  // Current rating value
        onRate={onRate}          // Callback when rating changes
        theme={theme}            // Theme for stars
        isRTL={isRTL}            // Layout direction
        totalStars={totalStars}  // Maximum stars
        size={size}              // Icon size
      />
    </div>
  );
}

export default RatingInteractive;

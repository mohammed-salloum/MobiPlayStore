import { useContext, useState, useEffect } from "react"; // React hooks
import { ThemeContext } from "../../context/ThemeContext"; // Theme context for dark/light mode
import { useTranslation } from "react-i18next"; // i18n hook for translations
import { FaRocket, FaLock, FaGamepad, FaHeadset } from "react-icons/fa"; // Feature icons
import FeatureCard from "../../components/Common/FeatureCard/FeatureCard"; // Individual feature card component
import Carousel from "../../components/Common/Carousel/Carousel"; // Carousel wrapper for horizontal scrolling
import "./FeaturesSection.css"; // Component-specific styles

/**
 * FeaturesSection Component
 * -------------------------
 * Displays a section highlighting key platform features.
 * Supports:
 *   - Theming (light/dark mode via ThemeContext)
 *   - Language direction (LTR/RTL via i18n)
 *   - Dynamic feature content with icons, titles, and descriptions
 *   - Carousel layout for horizontal scrolling
 */
const FeaturesSection = () => {
  // Get current theme (light/dark) from ThemeContext
  const { theme } = useContext(ThemeContext);

  // Translation hook
  const { t, i18n } = useTranslation();

  // Local state to hold feature cards
  const [features, setFeatures] = useState([]);

  // Populate feature cards whenever language changes
  useEffect(() => {
    setFeatures([
      {
        icon: <FaRocket size={40} />, // Icon for fast delivery
        title: t("features.fastDelivery.title"), // Translated title
        desc: t("features.fastDelivery.text"),   // Translated description
      },
      {
        icon: <FaLock size={40} />,   // Icon for secure payment
        title: t("features.securePayment.title"),
        desc: t("features.securePayment.text"),
      },
      {
        icon: <FaGamepad size={40} />, // Icon for wide selection
        title: t("features.wideSelection.title"),
        desc: t("features.wideSelection.text"),
      },
      {
        icon: <FaHeadset size={40} />, // Icon for support
        title: t("features.support.title") || "24/7 Support", // Fallback in case translation is missing
        desc: t("features.support.text") || "Our support team is always available.",
      },
    ]);
  }, [i18n.language, t]); // Re-run effect whenever language changes

  return (
    /* Section Wrapper
       - Applies current theme class
       - Sets text direction based on language (RTL for Arabic) */
    <section
      className={`features-section ${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Section Title */}
      <h2 className="features-title">{t("features.sectionTitle")}</h2>

      {/* Carousel Component
          - Passes RTL prop for proper scroll direction
          - Maps over features array to render FeatureCard components */}
      <Carousel rtl={i18n.language === "ar"}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}            // Unique key for list rendering
            icon={feature.icon}    // Icon component
            title={feature.title}  // Feature title
            desc={feature.desc}    // Feature description
          />
        ))}
      </Carousel>
    </section>
  );
};

export default FeaturesSection;
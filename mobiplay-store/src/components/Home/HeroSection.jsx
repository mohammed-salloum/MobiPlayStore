import { useContext, useEffect, useRef } from "react";               // React hooks
import { ThemeContext } from "../../context/ThemeContext";           // Theme context (light/dark)
import { LanguageContext } from "../../context/LanguageContext";     // Language context for RTL/LTR
import { useTranslation } from "react-i18next";                      // Translation hook
import Button from "../common/Button/Button";                        // Reusable button component
import AnimatedBackground from "../Common/AnimatedBackground/AnimatedBackground"; // Animated background layer
import "./HeroSection.css";                                          // Component-specific styles

/**
 * HeroSection Component
 * ---------------------
 * Top landing section with:
 *   - Animated background
 *   - Welcome message and site name
 *   - Tagline
 *   - Call-to-action button
 *   - IntersectionObserver-based animations for elements entering the viewport
 *   - Theme support (light/dark) and language-based routing
 */
const HeroSection = () => {
  // Theme context: light/dark mode
  const { theme } = useContext(ThemeContext);

  // Language context: used for constructing routes
  const { language } = useContext(LanguageContext);

  // Translation hook
  const { t } = useTranslation();

  // Ref to the hero section for IntersectionObserver
  const heroRef = useRef(null);

  /**
   * Intersection Observer for scroll-based animations
   * -----------------------------------------------
   * - Animates elements with the "animate" class when they enter the viewport
   * - Adds "in-view" class when at least 20% of the element is visible
   * - Cleans up observer on unmount
   */
  useEffect(() => {
    if (!heroRef.current) return; // Ensure element exists

    // Select all elements inside hero that should animate
    const elements = heroRef.current.querySelectorAll(".animate");

    // Create IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view"); // Trigger animation
          } else {
            entry.target.classList.remove("in-view"); // Reset animation
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of element is visible
    );

    // Observe all animated elements
    elements.forEach((el) => observer.observe(el));

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    /* Hero Section Wrapper
       - Theme-aware styling
       - Reference for animations */
    <header ref={heroRef} className={`hero-section ${theme}`}>
      
      {/* Animated Background Layer */}
      <AnimatedBackground theme={theme} />

      {/* Hero Content */}
      <div className="hero-content">

        {/* Main Title */}
        <h1 className="hero-title animate">
          {t("hero.welcome")} <span>{t("hero.siteName")}</span>
        </h1>

        {/* Tagline / Subheading */}
        <p className="hero-tagline animate">{t("hero.tagline")}</p>

        {/* Call-to-Action Button */}
        <div className="hero-button animate">
          <Button to={`/${language}/products`} variant="browse">
            {t("hero.exploreButton")}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
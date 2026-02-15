import { useState, useEffect, useRef, useMemo, useContext } from "react"; // React hooks
import { ThemeContext } from "../../context/ThemeContext";               // Theme context (light/dark mode)
import { useTranslation } from "react-i18next";                          // Translation hook
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";          // Carousel arrows
import "./HappyClientsSection.css";                                      // Component-specific styles
import AnimatedBackground from "../Common/AnimatedBackground/AnimatedBackground"; // Background animation

/**
 * HappyClientsSection Component
 * -----------------------------
 * Displays a carousel of client testimonials with:
 *   - Automatic sliding every 5 seconds
 *   - Manual navigation via arrows and dots
 *   - RTL/LTR support based on current language
 *   - Animated background
 *   - Theme support (light/dark)
 */
const HappyClientsSection = () => {
  // Get current theme (light/dark)
  const { theme } = useContext(ThemeContext);

  // Translation hook for text content and RTL detection
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Determine text direction

  // Fetch testimonials from translations
  const testimonialsRaw = t("happyClients.testimonials", { returnObjects: true });
  const testimonials = Array.isArray(testimonialsRaw) ? testimonialsRaw : [];

  // ===== Carousel Logic =====
  // Extend testimonials for seamless infinite looping
  const extendedTestimonials = useMemo(() => {
    if (!testimonials.length) return [];
    return [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]];
  }, [testimonials]);

  const [currentIndex, setCurrentIndex] = useState(1);          // Current slide index in extended array
  const [transitionEnabled, setTransitionEnabled] = useState(true); // Enable/disable CSS transition
  const intervalRef = useRef(null);                             // Reference for auto-slide interval

  // Auto-slide effect: advances carousel every 5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [currentIndex]);

  // Move to next slide
  const nextSlide = () => {
    setTransitionEnabled(true);
    setCurrentIndex(prev => prev + 1);
  };

  // Move to previous slide
  const prevSlide = () => {
    setTransitionEnabled(true);
    setCurrentIndex(prev => prev - 1);
  };

  // Handle seamless loop: jump without animation at cloned slides
  const handleTransitionEnd = () => {
    if (currentIndex >= extendedTestimonials.length - 1) {
      setTransitionEnabled(false);
      setCurrentIndex(1); // Reset to first real slide
    } else if (currentIndex <= 0) {
      setTransitionEnabled(false);
      setCurrentIndex(extendedTestimonials.length - 2); // Reset to last real slide
    }
  };

  // Calculate translateX for carousel movement
  const getTranslateX = () => (isRTL ? 1 : -1) * currentIndex * 100;

  // Go to a specific slide when dot clicked
  const goToSlide = index => {
    setTransitionEnabled(true);
    setCurrentIndex(index + 1); // +1 due to cloned first slide
  };

  // Get currently active dot index
  const getActiveDotIndex = () => {
    const idx = currentIndex - 1;
    if (idx < 0) return testimonials.length - 1;
    if (idx >= testimonials.length) return 0;
    return idx;
  };

  return (
    /* Section Wrapper
       - Applies theme class
       - Sets text direction based on current language */
    <section className={`happy-clients-section ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Animated Background */}
      <AnimatedBackground theme={theme} />

      {/* Overlay for visual effect */}
      <div className="overlay"></div>

      <div className="clients-content">
        {/* Section Title */}
        <h2 className="clients-title">{t("happyClients.title")}</h2>

        {/* Carousel Container */}
        <div className="clients-carousel-wrapper">
          
          {/* Left arrow (reversed for RTL) */}
          <button className="arrow left" onClick={isRTL ? nextSlide : prevSlide}>
            <FaChevronLeft />
          </button>

          {/* Carousel track */}
          <div
            className={`client-card ${transitionEnabled ? "transition-enabled" : "transition-disabled"}`}
            style={{
              transform: `translateX(${getTranslateX()}%)`,                     // Slide movement
              transition: transitionEnabled ? "transform 0.35s ease-out" : "none", // Disable transition when looping
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Individual testimonial slides */}
            {extendedTestimonials.map((client, i) => (
              <div key={i} className="client-slide">
                <p className="client-text">“{client.text}”</p>
                <h5 className="client-name">{client.name}</h5>
                <span className="client-role">{client.role}</span>
              </div>
            ))}
          </div>

          {/* Right arrow (reversed for RTL) */}
          <button className="arrow right" onClick={isRTL ? prevSlide : nextSlide}>
            <FaChevronRight />
          </button>
        </div>

        {/* Carousel dots for navigation */}
        <div className="carousel-dots">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === getActiveDotIndex() ? "active" : ""}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HappyClientsSection;
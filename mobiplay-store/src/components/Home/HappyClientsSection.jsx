import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./HappyClientsSection.css";
import AnimatedBackground from "../Common/AnimatedBackground/AnimatedBackground"; // ✅ استيراد الخلفية المتحركة

const HappyClientsSection = () => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const testimonialsRaw = t("happyClients.testimonials", { returnObjects: true });
  const testimonials = Array.isArray(testimonialsRaw) ? testimonialsRaw : [];

  // ===== Carousel Logic =====
  const extendedTestimonials = useMemo(() => {
    if (!testimonials.length) return [];
    return [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]];
  }, [testimonials]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const nextSlide = () => {
    setTransitionEnabled(true);
    setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    setTransitionEnabled(true);
    setCurrentIndex(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= extendedTestimonials.length - 1) {
      setTransitionEnabled(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setTransitionEnabled(false);
      setCurrentIndex(extendedTestimonials.length - 2);
    }
  };

  const getTranslateX = () => (isRTL ? 1 : -1) * currentIndex * 100;

  const goToSlide = index => {
    setTransitionEnabled(true);
    setCurrentIndex(index + 1);
  };

  const getActiveDotIndex = () => {
    const idx = currentIndex - 1;
    if (idx < 0) return testimonials.length - 1;
    if (idx >= testimonials.length) return 0;
    return idx;
  };

  return (
    <section className={`happy-clients-section ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* ✅ الخلفية المتحركة */}
      <AnimatedBackground theme={theme} />

      <div className="overlay"></div>

      <div className="clients-content">
        <h2 className="clients-title">{t("happyClients.title")}</h2>

        <div className="clients-carousel-wrapper">
          <button className="arrow left" onClick={isRTL ? nextSlide : prevSlide}>
            <FaChevronLeft />
          </button>

          <div
            className={`client-card ${transitionEnabled ? "transition-enabled" : "transition-disabled"}`}
            style={{
              transform: `translateX(${getTranslateX()}%)`,
              transition: transitionEnabled ? "transform 0.35s ease-out" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedTestimonials.map((client, i) => (
              <div key={i} className="client-slide">
                <p className="client-text">“{client.text}”</p>
                <h5 className="client-name">{client.name}</h5>
                <span className="client-role">{client.role}</span>
              </div>
            ))}
          </div>

          <button className="arrow right" onClick={isRTL ? prevSlide : nextSlide}>
            <FaChevronRight />
          </button>
        </div>

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

import React, { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import Button from "../common/Button/Button";
import AnimatedBackground from "../Common/AnimatedBackground/AnimatedBackground";
import "./HeroSection.css";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return; // ✅ تأكد من وجود العنصر

    const elements = heroRef.current.querySelectorAll(".animate"); // جميع العناصر القابلة للحركة

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          } else {
            entry.target.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.2 } // يبدأ التفعيل عندما يظهر 20% من العنصر
    );

    elements.forEach((el) => observer.observe(el)); // راقب كل عنصر

    return () => observer.disconnect(); // تنظيف عند الإزالة
  }, []);

  return (
    <header ref={heroRef} className={`hero-section ${theme}`}>
      <AnimatedBackground theme={theme} />
      <div className="hero-content">
        <h1 className="hero-title animate">
          {t("hero.welcome")} <span>{t("hero.siteName")}</span>
        </h1>

        <p className="hero-tagline animate">{t("hero.tagline")}</p>

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

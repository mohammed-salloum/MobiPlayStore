import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "../common/Button/Button";
import AnimatedBackground from "../common/AnimatedBackground/AnimatedBackground";
import "./HeroSection.css";

const HeroSection = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <header className={`hero-section`} dir={isRTL ? "rtl" : "ltr"}>
      {/* الخلفية المتحركة */}
      <AnimatedBackground theme={theme} />

      <div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.6 }}
        >
          {t("hero.welcome")} <span>{t("hero.siteName")}</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: false, amount: 0.6 }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          className="hero-button"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: false, amount: 0.6 }}
        >
          <Button to={`/${language}/products`} variant="browse">
            {t("hero.exploreButton")}
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;

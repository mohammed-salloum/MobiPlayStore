import React, { useContext, useRef, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import "./HeroSection.css";
import Button from "../common/Button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const headerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`hero-section ${darkMode ? "dark" : "light"}`}
      dir={isRTL ? "rtl" : "ltr"}
      ref={headerRef}
    >
      <div className="overlay" />

      <div className="content">
        <h1 className="title d-flex justify-content-center align-items-center gap-3">
          {/* Welcome */}
          {isMobile ? (
            <>
              <span style={{ display: "block", opacity: 1 }}>{t("hero.welcome")}</span>
              <span style={{ display: "block", opacity: 1 }}>{t("hero.siteName")}</span>
            </>
          ) : (
            <>
              <motion.span
                initial={{ x: isRTL ? 200 : -200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                animate={{ y: [0, -3, 0, 3, 0] }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  default: { duration: 1.2, delay: 0 },
                }}
              >
                {t("hero.welcome")}
              </motion.span>

              <motion.span
                initial={{ x: isRTL ? -200 : 200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                animate={{ y: [0, -3, 0, 3, 0] }}
                transition={{
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  default: { duration: 1.2, delay: 0.2 },
                }}
              >
                {t("hero.siteName")}
              </motion.span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        {isMobile ? (
          <p className="subtitle" style={{ opacity: 1 }}>
            {t("hero.subtitle")}
          </p>
        ) : (
          <motion.p
            initial={{ x: isRTL ? 200 : -200, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            animate={{ y: [0, -3, 0, 3, 0] }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              default: { duration: 1.2, delay: 0.3 },
            }}
            className="subtitle"
          >
            {t("hero.subtitle")}
          </motion.p>
        )}

        {/* Button */}
        <motion.div
          className="button-float"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
        >
          <Button to="/products" variant="browse" dark={darkMode}>
            {t("hero.exploreButton")}
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;

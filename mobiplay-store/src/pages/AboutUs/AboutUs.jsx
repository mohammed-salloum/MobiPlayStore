import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FaBolt, FaGamepad, FaShieldAlt } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import FeatureCard from "../../components/AboutUs/FeatureCard";
import "./AboutUs.css";

function AboutUs() {
  const { theme } = useContext(ThemeContext); 
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const features = [
    { icon: FaGamepad, title: t("about.features.selection.title"), text: t("about.features.selection.text") },
    { icon: FaShieldAlt, title: t("about.features.security.title"), text: t("about.features.security.text") },
    { icon: FaBolt, title: t("about.features.delivery.title"), text: t("about.features.delivery.text") }
  ];

  return (
    <div className="container mt-5">
      <div className={`about-container ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="about-title">{t("about.title")}</h2>
        <p className="lead-text">{t("about.description")}</p>

        <div className="row-features">
          {features.map((feat, idx) => (
            <FeatureCard
              key={idx}
              icon={feat.icon}
              title={feat.title}
              text={feat.text}
              theme={theme}     // تمرير الثيم للمكون
              isRTL={isRTL}
              iconSize={48}
            />
          ))}
        </div>

        <div className="footer-text">
          <p>{t("about.footerText")}</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

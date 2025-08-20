import React, { useContext } from "react";
import { FaGamepad, FaShieldAlt, FaBolt } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import "./AboutUs.css";

function About() {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation(); // إضافة i18n

  const isRTL = i18n.language === "ar"; // تحقق إذا العربية

  return (
    <div className="container mt-5">
      <div className={`about-container ${darkMode ? "dark" : "light"}`} dir={isRTL ? "rtl" : "ltr"}>
        {/* عنوان الصفحة */}
        <h2 className="about-title">{t("about.title")}</h2>

        {/* وصف الصفحة */}
        <p className="lead-text">{t("about.description")}</p>

        {/* المميزات */}
        <div className={`row mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="col-md-4 text-center mb-3">
            <FaGamepad size={40} className="icon gamepad-icon" />
            <h5 className="feature-title">{t("about.features.selection.title")}</h5>
            <p className="feature-text">{t("about.features.selection.text")}</p>
          </div>

          <div className="col-md-4 text-center mb-3">
            <FaShieldAlt size={40} className="icon shield-icon" />
            <h5 className="feature-title">{t("about.features.security.title")}</h5>
            <p className="feature-text">{t("about.features.security.text")}</p>
          </div>

          <div className="col-md-4 text-center mb-3">
            <FaBolt size={40} className="icon bolt-icon" />
            <h5 className="feature-title">{t("about.features.delivery.title")}</h5>
            <p className="feature-text">{t("about.features.delivery.text")}</p>
          </div>
        </div>

        {/* نص ختامي */}
        <div className="footer-text">
          <p>{t("about.footerText")}</p>
        </div>
      </div>
    </div>
  );
}

export default About;

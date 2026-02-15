// src/components/ContactUs/ContactInfo.jsx
import { useContext } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import './ContactInfo.css';

/* =========================
   ContactInfo Component
   - Displays company contact details: address, email, phone
   - Supports theme switching and RTL/LTR layout
========================= */
function ContactInfo() {
  const { theme } = useContext(ThemeContext); // current theme (light/dark)
  const { t, i18n } = useTranslation();       // translation hook
  const isRTL = i18n.language === "ar";       // check for Arabic RTL

  return (
    <div className={`contact-info ${theme} ${isRTL ? "rtl" : "ltr"}`}>
      
      {/* Company Name */}
      <h3 className="contact-subtitle">{t("contact.info.companyName")}</h3>

      {/* Address */}
      <div className="info-item">
        <div className="icon-box map">
          <FaMapMarkerAlt size={16} />
        </div>
        <span className="info-text map-text">{t("contact.info.address")}</span>
      </div>

      {/* Email */}
      <div className="info-item">
        <div className="icon-box envelope">
          <FaEnvelope size={16} />
        </div>
        <a href={`mailto:${t("contact.info.email")}`} className="info-link">
          {t("contact.info.email")}
        </a>
      </div>

      {/* Phone */}
      <div className="info-item">
        <div className="icon-box phone">
          <FaPhone size={16} />
        </div>
        <a href={`tel:${t("contact.info.phone")}`} className="info-link phone">
          {t("contact.info.phone")}
        </a>
      </div>
    </div>
  );
}

export default ContactInfo;

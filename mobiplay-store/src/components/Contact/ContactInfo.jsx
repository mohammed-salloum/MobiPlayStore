import React from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import './ContactInfo.css';

function ContactInfo() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // يتحقق إذا اللغة عربية

  return (
    <div className={`contact-info ${isRTL ? "rtl" : "ltr"}`}>
      {/* اسم الشركة */}
      <h3 className="contact-subtitle">{t("contact.info.companyName")}</h3>

      {/* العنوان */}
      <div className="info-item">
        <div className="icon-box map">
          <FaMapMarkerAlt size={16} />
        </div>
        <span className="info-text map-text">{t("contact.info.address")}</span>
      </div>

      {/* البريد الإلكتروني */}
      <div className="info-item">
        <div className="icon-box envelope">
          <FaEnvelope size={16} />
        </div>
        <a href={`mailto:${t("contact.info.email")}`} className="info-link">
          {t("contact.info.email")}
        </a>
      </div>

      {/* رقم الهاتف */}
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

import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import ContactInfo from "../../components/ContactUs/ContactInfo";
import ContactForm from "../../components/ContactUs/ContactForm";
import ContactMap from "../../components/ContactUs/ContactMap";
import "./ContactUs.css";

function ContactUs() {
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const isRTL = i18n.language === "ar";

  return (
    <div className={`container mt-5 ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="contact-title">{t("contact.title")}</h2>

      <div className="contact-wrapper">
        {/* القسم الأيسر: نموذج التواصل */}
        <div className="contact-form-side">
          <ContactForm t={t} />
        </div>

        {/* القسم الأيمن: معلومات التواصل + الخريطة */}
        <div className="contact-info-side">
          <ContactInfo t={t} />
          <ContactMap small />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

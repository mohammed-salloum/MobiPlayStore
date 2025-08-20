import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import ContactInfo from "../Contact/ContactInfo";
import ContactForm from "../Contact/ContactForm";
import "./ContactUs.css";

function Contact() {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  // صنف للغة العربية
  const langClass = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div className={`container mt-5 ${darkMode ? "dark" : "light"} ${langClass}`}>
      {/* عنوان الصفحة */}
      <h2 className="contact-title">{t("contact.title")}</h2>

      {/* الحاوية الرئيسية */}
      <div className="row shadow rounded p-4 contact-wrapper">
        <ContactForm t={t} />
        <ContactInfo t={t} />

      </div>
    </div>
  );
}

export default Contact;

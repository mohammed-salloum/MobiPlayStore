// ----------------------------------------------------
// ContactUs Page
// - Displays contact form, contact information, and map
// - Supports theming (light/dark) and RTL/LTR layouts
// - Uses i18n for multilingual support
// ----------------------------------------------------

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import ContactInfo from "../../components/ContactUs/ContactInfo";
import ContactForm from "../../components/ContactUs/ContactForm";
import ContactMap from "../../components/ContactUs/ContactMap";
import "./ContactUs.css";

function ContactUs() {
  /* =========================
     i18n & Theme Context
  ========================= */

  // Translation function and language info
  const { t, i18n } = useTranslation();

  // Current theme (e.g. light / dark)
  const { theme } = useContext(ThemeContext);

  // Detect RTL layout for Arabic language
  const isRTL = i18n.language === "ar";

  /* =========================
     Render
  ========================= */

  return (
    <div
      className={`container mt-5 ${theme}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Page Title */}
      <h2 className="contact-title">{t("contact.title")}</h2>

      {/* Main Contact Layout */}
      <div className="contact-wrapper">
        {/* Left Section: Contact Form */}
        <div className="contact-form-side">
          <ContactForm t={t} />
        </div>

        {/* Right Section: Contact Information & Map */}
        <div className="contact-info-side">
          <ContactInfo t={t} />
          <ContactMap small />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

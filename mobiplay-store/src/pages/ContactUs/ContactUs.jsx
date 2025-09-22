import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import ContactInfo from "../../components/ContactUs/ContactInfo";
import ContactForm from "../../components/ContactUs/ContactForm";
import "./ContactUs.css";

function ContactUs() {
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext); // استخدام الثيم العام

  // تحديد إذا كانت الصفحة RTL أو LTR
  const isRTL = i18n.language === "ar";

  return (
    <div className={`container mt-5 ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* عنوان الصفحة */}
      <h2 className="contact-title">{t("contact.title")}</h2>

      {/* الحاوية الرئيسية */}
      <div className="row contact-wrapper">
        <ContactForm t={t} />
        <ContactInfo t={t} />
      </div>
    </div>
  );
}

export default ContactUs;

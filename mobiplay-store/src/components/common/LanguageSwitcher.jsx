import React from "react";
import { useTranslation } from "react-i18next";
import "../layout/Navbar.css";
import 'flag-icons/css/flag-icons.min.css'; // استيراد مكتبة الأعلام

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="btn-toggle-language"
      aria-label="Toggle language"
    >
      {/* نعرض العلم حسب اللغة */}
      {i18n.language === "en" ? (
        <span className="fi fi-sa"></span>   // علم السعودية
      ) : (
        <span className="fi fi-gb"></span>   // علم بريطانيا
      )}
    </button>
  );
}

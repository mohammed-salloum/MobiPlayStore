// context/LanguageContext.js
// This context manages the application's language (i18n) and text direction (LTR/RTL).

import { createContext, useState, useEffect } from "react";
import i18n from "../i18n/i18n";

// Create LanguageContext to share language settings globally
export const LanguageContext = createContext();

/**
 * Utility function to detect the language based on the domain.
 * Returns 'ar' for Arabic domains, 'en' for English, or defaults to 'en'.
 */
function detectLanguageFromDomain() {
  try {
    const hostname = window.location.hostname.toLowerCase();
    const domainLangMap = {
      "syr.web.app": "ar",
      "us.web.app": "en",
    };

    for (const key in domainLangMap) {
      if (hostname.includes(key)) return domainLangMap[key];
    }

    return "en"; // Default language
  } catch (err) {
    console.error("Error detecting language from domain:", err);
    return "en";
  }
}

/**
 * LanguageProvider component wraps the application and provides:
 * - Current language
 * - Function to change language
 * - Automatic update of text direction (dir attribute)
 */
export function LanguageProvider({ children }) {
  // Initialize language from localStorage or detect from domain
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || detectLanguageFromDomain();
  });

  /**
   * Change the application language
   * @param {string} lang - 'en' or 'ar'
   */
  const changeLanguage = (lang) => {
    if (lang !== "ar" && lang !== "en") return;

    setLanguage(lang); // Update state
    localStorage.setItem("app-language", lang); // Persist in localStorage
    i18n.changeLanguage(lang); // Update i18next
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr"); // Update text direction
  };

  // On mount and language changes, ensure i18n and dir attribute are synced
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

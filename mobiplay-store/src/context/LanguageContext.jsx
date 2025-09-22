import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n/i18n";

export const LanguageContext = createContext();

// دالة كشف اللغة من الدومين
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

    return "en";
  } catch (err) {
    console.error("Error detecting language from domain:", err);
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || detectLanguageFromDomain();
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

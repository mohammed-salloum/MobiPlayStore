import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n/i18n";

// Create a Context for language management
export const LanguageContext = createContext();

// Utility function to detect language based on the domain
function detectLanguageFromDomain() {
  try {
    const hostname = window.location.hostname.toLowerCase(); // Get current hostname
    const domainLangMap = {
      "syr.web.app": "ar", // Arabic for Syrian subdomain
      "us.web.app": "en",  // English for US subdomain
    };

    // Iterate through domainLangMap to find a match
    for (const key in domainLangMap) {
      if (hostname.includes(key)) return domainLangMap[key];
    }

    // Default language if no match is found
    return "en";
  } catch (err) {
    // Log any errors and fallback to English
    console.error("Error detecting language from domain:", err);
    return "en";
  }
}

// LanguageProvider component to wrap the app and provide language state
export function LanguageProvider({ children }) {
  // Initialize language state from localStorage or detect from domain
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || detectLanguageFromDomain();
  });

  // Function to change language
  const changeLanguage = (lang) => {
    setLanguage(lang); // Update state
    localStorage.setItem("app-language", lang); // Persist language in localStorage
    i18n.changeLanguage(lang); // Update i18next language
    // Update text direction based on language (RTL for Arabic, LTR otherwise)
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  };

  // Apply language and direction on initial load
  useEffect(() => {
    i18n.changeLanguage(language); // Set i18next language
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr"); // Set text direction
  }, []);

  // Provide language state and changeLanguage function to all child components
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

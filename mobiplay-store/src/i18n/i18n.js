// i18n.js
// This file is responsible for configuring and initializing i18next
// for internationalization (i18n) support in the React application.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files for supported languages
import translationEN from './en/translation.json';
import translationAR from './ar/translation.json';

// Utility function to detect language based on the domain
import { detectLanguageFromDomain } from '../utils/language';

// Initialize i18next and connect it with React
i18n
  .use(initReactI18next)
  .init({
    // Define translation resources for each supported language
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
    },

    // Fallback language used when the detected or selected language
    // does not have the required translation keys
    fallbackLng: 'en',

    // Set the initial language dynamically based on the domain
    lng: detectLanguageFromDomain(),

    interpolation: {
      // Disable escaping since React already handles XSS protection
      escapeValue: false,
    },

    // Configuration for pluralization and nested translation keys
    pluralSeparator: '_', // Used for plural forms (e.g., item_one, item_many)
    keySeparator: '.',    // Enables nested keys like "cart.itemsCount"

    react: {
      // Enable React Suspense to handle async loading of translations
      useSuspense: true,
    },
  });

// Export the configured i18n instance
export default i18n;

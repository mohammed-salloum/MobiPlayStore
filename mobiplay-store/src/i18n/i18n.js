// Import the i18next library for internationalization
import i18n from 'i18next';

// Import the React integration for i18next
import { initReactI18next } from 'react-i18next';

// Import translation JSON files for English and Arabic
import translationEN from './en/translation.json';
import translationAR from './ar/translation.json';

// Import a utility function to detect language based on the domain
import { detectLanguageFromDomain } from '../utils/language'; // <-- Correct path

// Initialize i18next with React integration
i18n
  .use(initReactI18next) // Pass the i18n instance to React
  .init({
    // Define translation resources for different languages
    resources: {
      en: { translation: translationEN }, // English translations
      ar: { translation: translationAR }, // Arabic translations
    },

    // Fallback language if the detected or requested language is not available
    fallbackLng: 'en',

    // Set the initial language based on the current domain
    lng: detectLanguageFromDomain(),

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values, so no need for additional escaping
    },
  });

// Export the configured i18n instance to use throughout the app
export default i18n;

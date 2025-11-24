// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './en/translation.json';
import translationAR from './ar/translation.json';
import { detectLanguageFromDomain } from '../utils/language';

// Initialize i18next with React integration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
    },

    fallbackLng: 'en', // اللغة الافتراضية إذا لم تتوفر الترجمة المطلوبة
    lng: detectLanguageFromDomain(), // تعيين اللغة بناءً على الدومين

    interpolation: {
      escapeValue: false, // React يعتني بالـ escaping
    },

    // إضافة دعم الجمع والمفرد
    pluralSeparator: '_',
    keySeparator: '.', // لاستخدام المفاتيح المتداخلة مثل cart.itemsCount
    react: {
      useSuspense: true, // لتجنب الأخطاء أثناء تحميل الترجمات
    },
  });

export default i18n;

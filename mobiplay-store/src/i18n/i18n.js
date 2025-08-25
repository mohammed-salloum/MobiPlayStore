// 🔹 استيراد i18next وهو مكتبة لإدارة الترجمة
import i18n from 'i18next';

// React يسمح بدمج i18next مع 
import { initReactI18next } from 'react-i18next';

// 🔹 استيراد ملفات الترجمة لكل لغة
import translationEN from '../locales/en/translation.json';
import translationAR from '../locales/ar/translation.json';

i18n
  .use(initReactI18next) // 🔹 ربط i18next مع React
  .init({
    resources: {        // 🔹 تعريف ملفات الموارد لكل لغة
      en: { translation: translationEN }, // الإنجليزية
      ar: { translation: translationAR }  // العربية
    },
    lng: 'en',           // 🔹 اللغة الافتراضية عند تحميل التطبيق
    fallbackLng: 'en',   // 🔹 اللغة الاحتياطية إذا كانت الكلمة غير موجودة في اللغة المختارة
    interpolation: { 
      escapeValue: false // 🔹 عدم هروب القيم (React يتعامل مع XSS تلقائيًا)
    }
  });

export default i18n;

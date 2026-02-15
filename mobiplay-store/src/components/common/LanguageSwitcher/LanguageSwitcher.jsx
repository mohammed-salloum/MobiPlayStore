import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import './LanguageSwitcher.css';

// Supported languages with flags
const languages = [
  { code: "en", flag: "gb" },
  { code: "ar", flag: "ae" },
];

export default function LanguageSwitcher() {
  const { language } = useContext(LanguageContext); // Current language
  const { t } = useTranslation();                   // Translation function
  const navigate = useNavigate();                  // Router navigation
  const location = useLocation();                  // Current URL path

  const handleChange = (code) => {
    // Update the URL path for the selected language
    const parts = location.pathname.split("/").filter(Boolean);
    
    if (languages.some(l => l.code === parts[0])) {
      // Replace existing language code in path
      parts[0] = code;
    } else {
      // Prepend language code if missing
      parts.unshift(code);
    }

    navigate("/" + parts.join("/"), { replace: true });
  };

  // RTL layout if current language is Arabic
  const containerClass = `languages-inline ${language === 'ar' ? 'rtl' : ''}`;

  return (
    <div className={containerClass}>
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`language-btn ${language === lang.code ? 'active' : ''}`}
          onClick={() => handleChange(lang.code)}
          title={t(`languages.${lang.code}`)}  // Tooltip with language name
        >
          <span className={`fi fi-${lang.flag}`}></span>  {/* Flag icon */}
          <span className="language-name">{t(`languages.${lang.code}`)}</span>
        </button>
      ))}
    </div>
  );
}
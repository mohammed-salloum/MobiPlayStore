import { useContext } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import './LanguageSwitcher.css';

const languages = [
  { code: "en", flag: "gb" },
  { code: "ar", flag: "ae" },
];

export default function LanguageSwitcher() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (code) => {
    // تحديث مسار الصفحة فقط
    const parts = location.pathname.split("/").filter(Boolean);
    if (languages.some(l => l.code === parts[0])) {
      parts[0] = code;
    } else {
      parts.unshift(code);
    }

    navigate("/" + parts.join("/"), { replace: true });
  };

  const containerClass = `languages-inline ${language === 'ar' ? 'rtl' : ''}`;

  return (
    <div className={containerClass}>
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`language-btn ${language === lang.code ? 'active' : ''}`}
          onClick={() => handleChange(lang.code)}
          title={t(`languages.${lang.code}`)}
        >
          <span className={`fi fi-${lang.flag}`}></span>
          <span className="language-name">{t(`languages.${lang.code}`)}</span>
        </button>
      ))}
    </div>
  );
}

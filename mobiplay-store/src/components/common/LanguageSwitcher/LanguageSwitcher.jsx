import { FaCaretDown } from 'react-icons/fa';
import { useState, useRef, useContext, useEffect } from "react";
import { LanguageContext } from "../../../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import 'flag-icons/css/flag-icons.min.css';
import './LanguageSwitcher.css';

const languages = [
  { code: "en", flag: "fi-gb" },
  { code: "ar", flag: "fi-sa" },
];

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleChange = (code) => {
    changeLanguage(code);

    const parts = location.pathname.split("/").filter(Boolean);
    if (languages.some(l => l.code === parts[0])) {
      parts[0] = code;
    } else {
      parts.unshift(code);
    }

    navigate("/" + parts.join("/"), { replace: true });
    setOpen(false);
  };

  return (
    <div className="language-switcher" ref={ref}>
      <button className="btn-toggle-language" onClick={() => setOpen(!open)}>
        <span className={`fi ${currentLang.flag}`}></span>
        <FaCaretDown className={`caret-icon ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="language-menu grid-menu">
          {languages.map(lang => (
            <button
              key={lang.code}
              className="language-btn"
              onClick={() => handleChange(lang.code)}
            >
              <span className={`fi ${lang.flag}`}></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ThemeSwitcher.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaSun, FaMoon, FaEye,FaBook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./ThemeSwitcher.css";

function ThemeSwitcher({ onlyLight = false, onlyDark = false, displayInline = false }) {
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const { t, i18n } = useTranslation(); // hook لجلب الترجمة
  const isRTL = i18n.language === "ar";

  const themeMap = {
    light: FaSun,
    dark: FaMoon,
    colorblind: FaEye,
    reading: FaBook,
  };

  let displayedThemes = themes;
  if (onlyLight) displayedThemes = themes.filter(t => t !== "dark");
  if (onlyDark) displayedThemes = themes.filter(t => t === "dark");

  // إضافة كلاس rtl حسب اللغة
  const containerClass = `theme-container inline ${isRTL ? "rtl" : ""}`;

  return (
    <div className={containerClass}>
      {displayedThemes.map((th) => (
        <button
          key={th}
          className={`theme-btn theme-${th} ${theme === th ? "active" : ""}`}
          onClick={() => setTheme(th)}
        >
          {React.createElement(themeMap[th], { className: "theme-icon" })}
          <span className="theme-name">{t(`themes.${th}`)}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;

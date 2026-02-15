// ThemeSwitcher.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaSun, FaMoon, FaEye, FaBook } from "react-icons/fa"; // Icons for different themes
import { useTranslation } from "react-i18next"; // Hook for translations
import "./ThemeSwitcher.css";

/**
 * ThemeSwitcher component allows the user to switch between available themes.
 * Supports light, dark, colorblind, and reading modes.
 * Can optionally show only light or only dark themes and display inline.
 *
 * @param {boolean} onlyLight - If true, only shows themes other than dark
 * @param {boolean} onlyDark - If true, only shows the dark theme
 * @param {boolean} displayInline - Controls if container displays inline
 */
function ThemeSwitcher({ onlyLight = false, onlyDark = false, displayInline = false }) {
  // Access theme state and available themes from context
  const { theme, setTheme, themes } = useContext(ThemeContext);

  // i18n hook for translations
  const { t, i18n } = useTranslation(); 
  const isRTL = i18n.language === "ar"; // Check if current language is right-to-left

  // Map theme keys to corresponding icons
  const themeMap = {
    light: FaSun,
    dark: FaMoon,
    colorblind: FaEye,
    reading: FaBook,
  };

  // Determine which themes to display based on props
  let displayedThemes = themes;
  if (onlyLight) displayedThemes = themes.filter(t => t !== "dark"); // Exclude dark theme
  if (onlyDark) displayedThemes = themes.filter(t => t === "dark"); // Only dark theme

  // Add RTL class if the language is right-to-left
  const containerClass = `theme-container inline ${isRTL ? "rtl" : ""}`;

  return (
    <div className={containerClass}>
      {displayedThemes.map((th) => (
        <button
          key={th}
          className={`theme-btn theme-${th} ${theme === th ? "active" : ""}`} // Add "active" class to current theme
          onClick={() => setTheme(th)} // Switch theme on click
        >
          {/* Render the icon corresponding to the theme */}
          {React.createElement(themeMap[th], { className: "theme-icon" })}
          {/* Display the translated theme name */}
          <span className="theme-name">{t(`themes.${th}`)}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
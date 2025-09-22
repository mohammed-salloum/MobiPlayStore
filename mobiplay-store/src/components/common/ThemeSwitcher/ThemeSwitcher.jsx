import React, { useState, useContext, useRef, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaSun, FaMoon, FaEye, FaBookOpen, FaCaretDown } from "react-icons/fa";
import "./ThemeSwitcher.css";

function ThemeSwitcher() {
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeMap = {
    light: FaSun,
    dark: FaMoon,
    colorblind: FaEye,
    sepia: FaBookOpen,
  };

  return (
    <div className="theme-switcher" ref={ref}>
      <button className="theme-switcher-btn" onClick={() => setOpen(!open)}>
        {React.createElement(themeMap[theme], { className: "theme-icon" })}
        <FaCaretDown className={`caret-icon ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="theme-menu">
          {themes.map((t) => (
            <button
              key={t}
              className={`theme-btn theme-${t} ${theme === t ? "active" : ""}`}
              onClick={() => { setTheme(t); setOpen(false); }}
            >
              {React.createElement(themeMap[t], { className: "theme-icon" })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;

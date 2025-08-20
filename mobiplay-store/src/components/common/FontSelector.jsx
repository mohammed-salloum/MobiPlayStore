import React, { useState, useEffect } from "react";
import { FaFont, FaPenFancy, FaCode } from 'react-icons/fa';
import "./FontSelector.css";

// استخدم Component وليس عنصر JSX مباشرة
const fonts = [
  { family: "'Inter', 'Cairo', sans-serif", icon: FaFont },
  { family: "'Roboto', 'Tajawal', sans-serif", icon: FaPenFancy },
  { family: "'Lato', 'El Messiri', sans-serif", icon: FaCode },
];

const FontSelector = ({ darkMode }) => {
  const storedFont = localStorage.getItem("selectedFont") || "Arial, sans-serif";
  const initialIndex = fonts.findIndex(f => f.family === storedFont);
  const [current, setCurrent] = useState(initialIndex >= 0 ? initialIndex : 0);

  useEffect(() => {
    document.body.style.fontFamily = fonts[current].family;
    localStorage.setItem("selectedFont", fonts[current].family);
  }, [current]);

  const handleSwitch = () => {
    const next = (current + 1) % fonts.length;
    setCurrent(next);

    const btn = document.getElementById("fontBtn");
    if (btn) {
      btn.classList.add("rotate");
      setTimeout(() => btn.classList.remove("rotate"), 500);
    }
  };

  const Icon = fonts[current].icon;

  return (
    <button
      id="fontBtn"
      className={`btn-font ${darkMode ? 'dark' : 'light'}`}
      onClick={handleSwitch}
      title="تبديل الخط"
    >
      {Icon && <Icon />}
    </button>
  );
};

export default FontSelector;

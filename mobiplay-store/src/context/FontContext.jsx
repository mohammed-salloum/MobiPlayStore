// context/FontContext.js
// This context provides global font settings (size and family) across the application.
// It persists user preferences in localStorage and applies them to the document root.

import { createContext, useState, useEffect } from "react";

// Create the FontContext to share font settings globally
export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  // Initialize font size from localStorage or default to 15px
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize"), 10) || 15;
  });

  // Initialize font family from localStorage or default to 'Inter'
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("fontFamily") || "'Inter'";
  });

  // Apply font size and family to the document root whenever they change
  useEffect(() => {
    // Set CSS custom properties for global usage
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--main-font", fontFamily);

    // Persist user preferences in localStorage
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontSize, fontFamily]);

  // Provide the font settings and setters to the rest of the application
  return (
    <FontContext.Provider value={{ fontSize, setFontSize, fontFamily, setFontFamily }}>
      {children}
    </FontContext.Provider>
  );
};

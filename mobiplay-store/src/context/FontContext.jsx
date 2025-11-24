import React, { createContext, useState, useEffect } from "react";

export const FontContext = createContext();

export const FontProvider = ({ children }) => {
  // الخط يبدأ من localStorage أو 16px
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize"), 10) || 15;
  });

  // الخط الأساسي
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("fontFamily") || "'Inter'";
  });

  // تطبيق القيم على الموقع
  useEffect(() => {
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--main-font", fontFamily);

    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontSize, fontFamily]);

  return (
    <FontContext.Provider value={{ fontSize, setFontSize, fontFamily, setFontFamily }}>
      {children}
    </FontContext.Provider>
  );
};

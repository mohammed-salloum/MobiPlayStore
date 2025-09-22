import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themes = ["light", "dark", "colorblind", "sepia"];
  const [theme, setTheme] = useState(() => {
    // نقرأ الثيم من localStorage عند أول تحميل
    const saved = localStorage.getItem("theme");
    return saved && themes.includes(saved) ? saved : "light";
  });

  // تطبيق الثيم على body وحفظه في localStorage عند تغييره
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

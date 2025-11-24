import React, { createContext, useState, useEffect } from "react";

// Create a Context for theme management
export const ThemeContext = createContext();

// ThemeProvider component to wrap the app and provide theme state
export const ThemeProvider = ({ children }) => {
  // Available theme options
  const themes = ["light","reading","dark","colorblind"];

  // State to store current theme
  // Initialize from localStorage if available, otherwise default to "light"
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme"); // Read saved theme from localStorage
    return saved && themes.includes(saved) ? saved : "light"; // Validate saved theme
  });

  // Apply the theme to the <body> element and save it to localStorage
  // Runs whenever `theme` changes
  useEffect(() => {
    document.body.setAttribute("data-theme", theme); // Set the data-theme attribute
    localStorage.setItem("theme", theme); // Persist theme in localStorage
  }, [theme]);

  // Provide the theme state, setter, and available themes to all child components
  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

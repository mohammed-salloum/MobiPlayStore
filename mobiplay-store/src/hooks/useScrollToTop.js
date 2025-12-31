// hooks/useScrollToTop.js
// Custom hook to automatically scroll the page to the top when the route or language changes.
// Also handles setting the text direction (LTR/RTL) based on the current language.

import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

export default function useScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const { language } = useContext(LanguageContext);

  // Prevent automatic scroll restoration when navigating using browser history
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top smoothly whenever the pathname, search query, hash, or language changes
  useEffect(() => {
    const isRTL = language === "ar";

    // Set the HTML document direction dynamically based on current language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // Scroll to top (or to the far right for RTL languages)
    window.scrollTo({
      top: 0,
      left: isRTL ? document.documentElement.scrollWidth : 0,
      behavior: "smooth",
    });
  }, [pathname, search, hash, language]);
}

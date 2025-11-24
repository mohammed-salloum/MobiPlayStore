// hooks/useScrollToTop.js
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";

export default function useScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const { language } = useContext(LanguageContext);

  // منع إعادة التمرير التلقائي عند تحديث الصفحة
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // تمرير لأعلى عند تغيير المسار أو اللغة
  useEffect(() => {
    const isRTL = language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    window.scrollTo({
      top: 0,
      left: isRTL ? document.documentElement.scrollWidth : 0,
      behavior: "smooth",
    });
  }, [pathname, search, hash, language]);
}

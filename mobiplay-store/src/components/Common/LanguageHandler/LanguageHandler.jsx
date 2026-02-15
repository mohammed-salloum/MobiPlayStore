import { useEffect, useContext } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { LanguageContext } from "../../../context/LanguageContext";
import { FontContext } from "../../../context/FontContext";

export default function LanguageHandler() {
  const { lang } = useParams(); // Get language from route params
  const { language, changeLanguage } = useContext(LanguageContext); // Language state & updater
  const { setFontFamily } = useContext(FontContext); // Font updater

  useEffect(() => {
    if (["en", "ar"].includes(lang)) {
      // Update application language
      changeLanguage(lang);

      // Update font based on selected language
      if (lang === "ar") setFontFamily("'Cairo', sans-serif");
      else setFontFamily("'Inter', sans-serif");
    }
  }, [lang, changeLanguage, setFontFamily]);

  // Redirect to English if unsupported language in URL
  if (!["en", "ar"].includes(lang)) return <Navigate to="/en/" replace />;

  // Render nested routes
  return <Outlet />;
}
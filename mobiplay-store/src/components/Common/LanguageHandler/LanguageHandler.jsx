import React, { useEffect, useContext } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { LanguageContext } from "../../../context/LanguageContext";
import { FontContext } from "../../../context/FontContext";

export default function LanguageHandler() {
  const { lang } = useParams();
  const { language, changeLanguage } = useContext(LanguageContext);
  const { setFontFamily } = useContext(FontContext);

  useEffect(() => {
    if (["en", "ar"].includes(lang)) {
      // تغيير اللغة
      changeLanguage(lang);

      // تغيير الخط حسب اللغة
      if (lang === "ar") setFontFamily("'Cairo', sans-serif");
      else setFontFamily("'Inter', sans-serif");
    }
  }, [lang, changeLanguage, setFontFamily]);

  // إعادة التوجيه للغة الإنجليزية إذا المسار غير مدعوم
  if (!["en", "ar"].includes(lang)) return <Navigate to="/en/" replace />;

  return <Outlet />;
}

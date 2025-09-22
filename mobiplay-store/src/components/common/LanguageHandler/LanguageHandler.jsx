import React, { useContext, useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { LanguageContext } from '../../../context/LanguageContext';

export default function LanguageHandler() {
  const { lang } = useParams();
  const { changeLanguage } = useContext(LanguageContext);

  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'ar')) {
      changeLanguage(lang);
    }
  }, [lang, changeLanguage]);

  return <Outlet />;
}

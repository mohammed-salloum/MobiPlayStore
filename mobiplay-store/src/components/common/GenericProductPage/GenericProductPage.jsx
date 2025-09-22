import React, { Suspense, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Spinner from "../Spinner/Spinner";
import "./GenericProductPage.css";

const ProductList = React.lazy(() => import("../ProductList/ProductList"));

const GenericProductPage = ({ useDataHook, titleKey, emptyKey, fetchErrorKey }) => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data, isLoading, error } = useDataHook();
  const items = data || [];

  // حالة التحميل
  if (isLoading) {
    return (
      <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <Spinner fullScreen />
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="generic-message error">
          {t(fetchErrorKey)}
          <button onClick={() => window.location.reload()}>{t("common.retry")}</button>
        </div>
      </div>
    );
  }

  // حالة عدم وجود عناصر
  if (items.length === 0) {
    return (
      <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="generic-message">{t(emptyKey)}</div>
      </div>
    );
  }

  // الحالة العادية
  return (
    <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
      <Suspense fallback={<Spinner fullScreen />}>
        <ProductList items={items} title={t(titleKey)} isRTL={isRTL} />
      </Suspense>
    </div>
  );
};

export default GenericProductPage;

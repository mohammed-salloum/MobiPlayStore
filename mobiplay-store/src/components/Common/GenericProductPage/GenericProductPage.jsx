import { Suspense, useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Spinner from "../Spinner/Spinner";
import ProductList from "../ProductList/ProductList";
import "./GenericProductPage.css";

const GenericProductPage = ({ useDataHook, titleKey, emptyKey, fetchErrorKey }) => {
  const { theme } = useContext(ThemeContext); // Current theme (light/dark)
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Determine RTL layout

  // Initialize current page from URL query or default to 1
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const saved = parseInt(params.get("page"), 10);
    return saved && saved > 0 ? saved : 1;
  });

  // Fetch paginated data using the provided hook
  const { data, isLoading, error } = useDataHook(currentPage);
  const items = data?.games || [];
  const totalPages = data?.totalPages || 1;

  // ===== Loading state =====
  if (isLoading) {
    return (
      <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="generic-message-wrapper">
          <div className="generic-message loading">
            <Spinner fullScreen />
          </div>
        </div>
      </div>
    );
  }

  // ===== Error state =====
  if (error) {
    return (
      <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="generic-message-wrapper">
          <div className="generic-message error">
            <div className="message-content">
              <p>{t(fetchErrorKey)}</p>
              <button onClick={() => window.location.reload()}>
                {t("common.retry")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Empty state =====
  if (!items.length) {
    return (
      <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
        <div className="generic-message-wrapper">
          <div className="generic-message empty">
            <div className="message-content">
              <p>{t(emptyKey)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Normal content =====
  return (
    <div className={`generic-container theme-${theme} ${isRTL ? "rtl" : "ltr"}`}>
      <Suspense fallback={<Spinner fullScreen />}>
        <ProductList
          items={items}
          title={t(titleKey)}
          totalPages={totalPages}
          serverPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isRTL={isRTL}
        />
      </Suspense>
    </div>
  );
};

export default GenericProductPage;
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, lang }) => {
  const { t } = useTranslation();
  const isRTL = lang === "ar";
  const [isMobile, setIsMobile] = useState(false);

  // اكتشاف حجم الشاشة
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تحديث رابط URL للصفحة الحالية
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    currentPage > 1 ? params.set("page", currentPage) : params.delete("page");
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [currentPage]);

  const handlePrev = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNext = () => onPageChange(Math.min(currentPage + 1, totalPages));

  // أرقام الصفحات
  const renderPages = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <Button
        key={page}
        onClick={() => onPageChange(page)}
        variant="pagination"
        active={page === currentPage}
        disabled={page === currentPage}
      >
        {page}
      </Button>
    ));

  // أزرار السابق / التالي
  const renderNavButton = (type) => {
    const isNext = type === "next";
    const disabled = isNext ? currentPage === totalPages : currentPage === 1;
    const label = isNext ? t("pagination.next") : t("pagination.prev");

    return (
      <Button
        onClick={isNext ? handleNext : handlePrev}
        disabled={disabled}
        variant="nav-btn"
      >
        <span className={`nav-content ${isRTL ? "rtl" : ""}`}>
          {isRTL ? (
            isNext ? (
              <>
                <span className="label">{label}</span>
                <span className="arrow">←</span>
              </>
            ) : (
              <>
                <span className="arrow">→</span>
                <span className="label">{label}</span>
              </>
            )
          ) : isNext ? (
            <>
              <span className="label">{label}</span>
              <span className="arrow">→</span>
            </>
          ) : (
            <>
              <span className="arrow">←</span>
              <span className="label">{label}</span>
            </>
          )}
        </span>
      </Button>
    );
  };

  return (
    <div className={`pagination-container ${isRTL ? "rtl" : "ltr"}`}>
      {renderNavButton("prev")}
      {!isMobile && <div className="pages-wrapper">{renderPages()}</div>}
      {isMobile && (
        <span className="current-page-mobile">
          {currentPage} / {totalPages}
        </span>
      )}
      {renderNavButton("next")}
    </div>
  );
};

export default Pagination;
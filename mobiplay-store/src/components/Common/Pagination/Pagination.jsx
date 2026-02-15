import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange, lang }) => {
  const { t } = useTranslation();       // Translation function
  const isRTL = lang === "ar";          // Determine RTL layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576); // Track mobile viewport

  // Track window resize to update mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
  };

  // Navigate prev / next page
  const handlePrev = () => handlePageChange(Math.max(currentPage - 1, 1));
  const handleNext = () => handlePageChange(Math.min(currentPage + 1, totalPages));

  // Generate page numbers with ellipsis for large pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(currentPage - 1, 2);
      const right = Math.min(currentPage + 1, totalPages - 1);
      pages.push(1);
      if (left > 2) pages.push("...");           // Left ellipsis
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("..."); // Right ellipsis
      pages.push(totalPages);
    }
    return pages;
  };

  // Render numeric page buttons
  const renderPages = () =>
    getPageNumbers().map((page, idx) =>
      page === "..." ? (
        <span key={`ellipsis-${idx}`} className="ellipsis">...</span>
      ) : (
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          variant="pagination"
          active={page === currentPage}
          disabled={page === currentPage}
        >
          {page}
        </Button>
      )
    );

  // Render prev / next navigation buttons
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
          {isNext ? (
            <>
              <span className="label">{label}</span>
              <span className="arrow-pagination">→</span>
            </>
          ) : (
            <>
              <span className="arrow-pagination">←</span>
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

      {/* On mobile: show only current / total pages */}
      {isMobile ? (
        <span className="current-page-mobile">
          {currentPage} / {totalPages}
        </span>
      ) : (
        <div className="pages-wrapper">{renderPages()}</div>
      )}

      {renderNavButton("next")}
    </div>
  );
};

export default Pagination;
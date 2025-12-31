// src/pages/FAQ/FAQ.jsx
// ----------------------------------------------------
// FAQ Page
// - Displays a list of frequently asked questions
// - Supports theming (light/dark) and RTL/LTR layouts
// - Uses i18n for dynamic, translatable FAQ content
// ----------------------------------------------------

import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import FAQItem from "../../components/FAQ/FAQItem";
import "./FAQ.css";

function FAQ() {
  /* =========================
     Context & i18n
  ========================= */

  // Current theme from global context
  const { theme } = useContext(ThemeContext);

  // Translation utilities and language detection
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  /* =========================
     FAQ Data
  ========================= */

  // Retrieve FAQ items from translation files
  // `returnObjects: true` allows structured data (arrays/objects)
  const faqData = t("faq.items", { returnObjects: true });

  /* =========================
     Local State
  ========================= */

  // Tracks which FAQ items are currently expanded
  const [activeIndexes, setActiveIndexes] = useState([]);

  /* =========================
     Handlers
  ========================= */

  // Toggles expand/collapse state for a specific FAQ item
  const toggleFAQ = (index) => {
    setActiveIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // Collapse if already active
        : [...prev, index]               // Expand if inactive
    );
  };

  /* =========================
     Render
  ========================= */

  return (
    <div
      className={`faq-container ${theme} ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Page Title */}
      <h2 className="faq-title">{t("faq.title")}</h2>

      {/* FAQ Items List */}
      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          item={item}
          isActive={activeIndexes.includes(index)}
          onToggle={() => toggleFAQ(index)}
          theme={theme}   // Pass theme instead of boolean flags
          isRTL={isRTL}   // Pass text direction to child component
        />
      ))}
    </div>
  );
}

export default FAQ;

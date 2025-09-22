// src/pages/FAQ/FAQ.jsx
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import FAQItem from "../../components/FAQ/FAQItem";
import "./FAQ.css";

function FAQ() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // نجيب البيانات من ملفات الترجمة
  const faqData = t("faq.items", { returnObjects: true });

  const [activeIndexes, setActiveIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setActiveIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div
      className={`faq-container ${theme} ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="faq-title">{t("faq.title")}</h2>

      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          item={item}
          isActive={activeIndexes.includes(index)}
          onToggle={() => toggleFAQ(index)}
          theme={theme}   // نمرر الثيم للـ Item بدل darkMode/bool
          isRTL={isRTL}   // نمرر اتجاه اللغة للـ Item
        />
      ))}
    </div>
  );
}

export default FAQ;

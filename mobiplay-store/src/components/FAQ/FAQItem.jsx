import { FaChevronDown } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import "./FAQItem.css";

function FAQItem({ item, isActive, onToggle }) {
  const { theme } = useContext(ThemeContext);   
  const { language } = useContext(LanguageContext);      // اللغة الحالية
  const isRTL = language === "ar";                       // تحديد الاتجاه

  return (
    <div className={`faq-item ${isActive ? "active" : ""} ${theme} ${isRTL ? "rtl" : "ltr"}`}>
      <button className="faq-question" onClick={onToggle}>
        {item.question}
        <FaChevronDown className={`faq-icon ${isActive ? "rotate" : ""}`} />
      </button>
      <div className={`faq-answer ${isActive ? "open" : ""}`}>
        {item.answer}
      </div>
    </div>
  );
}

export default FAQItem;

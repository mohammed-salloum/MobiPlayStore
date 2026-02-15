import { FaChevronDown } from "react-icons/fa"; // Import Chevron icon for toggle arrow
import { useContext } from "react";            // Import React hook for context usage
import { ThemeContext } from "../../context/ThemeContext"; // Theme context for dark/light mode
import { LanguageContext } from "../../context/LanguageContext"; // Language context for RTL/LTR
import "./FAQItem.css"; // Component-specific styles

/**
 * FAQItem Component
 * -----------------
 * Represents a single FAQ entry with toggleable answer visibility.
 * Supports theming (light/dark) and language direction (LTR/RTL).
 * 
 * Props:
 * - item: { question: string, answer: string } — FAQ data
 * - isActive: boolean — Determines if this FAQ is currently expanded
 * - onToggle: function — Callback to toggle the active state
 */
function FAQItem({ item, isActive, onToggle }) {
  // Get current theme (e.g., 'light' or 'dark') from ThemeContext
  const { theme } = useContext(ThemeContext);

  // Get current language from LanguageContext (e.g., 'en' or 'ar')
  const { language } = useContext(LanguageContext);
  
  // Determine if the layout should be RTL based on language
  const isRTL = language === "ar";
  
  return (
    /* FAQ Item Wrapper
       - Adds 'active' class if expanded
       - Adds current theme class for styling
       - Applies RTL/LTR direction */
    <div className={`faq-item ${isActive ? "active" : ""} ${theme} ${isRTL ? "rtl" : "ltr"}`}>
      
      {/* Question Button
          - Clicking toggles the answer
          - Contains the question text and toggle icon */}
      <button className="faq-question" onClick={onToggle}>
        <span>{item.question}</span>
        <FaChevronDown className={`faq-icon ${isActive ? "rotate" : ""}`} /> {/* Rotates arrow when active */}
      </button>
      
      {/* Answer Container
          - Visible only if active
          - Supports CSS transition for smooth open/close */}
      <div className={`faq-answer ${isActive ? "open" : ""}`}>
        {item.answer}
      </div>
    </div>
  );
}

export default FAQItem;
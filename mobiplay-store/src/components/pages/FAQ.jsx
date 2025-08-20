import React, { useContext, useState } from 'react';
import { ThemeContext } from "../../context/ThemeContext";
import { FaChevronDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './FAQ.css';

function FAQ() {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // جلب البيانات من ملفات الترجمة
  const faqData = t('faq.items', { returnObjects: true });

  const [activeIndexes, setActiveIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setActiveIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className={`faq-container ${darkMode ? 'dark' : 'light'} ${isRTL ? 'rtl' : 'ltr'}`}>
      <h2 className="faq-title">{t('faq.title')}</h2>

      {faqData.map((item, index) => {
        const isActive = activeIndexes.includes(index);
        return (
          <div key={index} className={`faq-item ${isActive ? 'active' : ''} ${darkMode ? 'dark' : 'light'}`}>
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              {item.question}
              <FaChevronDown className={`faq-icon ${isActive ? 'rotate' : ''}`} />
            </button>
            <div className={`faq-answer ${isActive ? 'open' : ''}`}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FAQ;

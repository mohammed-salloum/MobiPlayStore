import React, { useContext, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { FaChevronDown } from 'react-icons/fa';

function FAQ() {
  const { darkMode } = useContext(ThemeContext); // جلب حالة الوضع الداكن من السياق

  // بيانات الأسئلة والأجوبة
  const faqData = [
    {
      question: "How can I purchase a game top-up card?",
      answer: "Browse our products, select the card you want, choose quantity, and proceed to checkout.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, and other popular payment gateways.",
    },
    {
      question: "How long does it take to receive my code?",
      answer: "You will receive your code instantly after payment confirmation.",
    },
    {
      question: "Can I return or exchange a top-up card?",
      answer: "No returns or exchanges for digital products. Please check before purchasing.",
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes. We use industry-standard encryption and security practices to protect your data.",
    },
  ];

  const [activeIndexes, setActiveIndexes] = useState([]); // إدارة الحالة المفتوحة للأسئلة

  // تفعيل أو إلغاء تفعيل العنصر المفتوح
  const toggleFAQ = (index) => {
    setActiveIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div
      className={`container mt-5 mb-5 ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}
      style={{
        maxWidth: '800px',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: darkMode
          ? '0 4px 15px rgba(255,255,255,0.05)'
          : '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <h2 className="mb-5 text-center fw-bold" style={{ letterSpacing: '1px' }}>
        Frequently Asked Questions
      </h2>

      {/* تكرار الأسئلة وعرضها كعناصر قابلة للفتح والإغلاق */}
      <div>
        {faqData.map((item, index) => {
          const isActive = activeIndexes.includes(index);
          return (
            <div
              key={index}
              style={{
                backgroundColor: darkMode ? '#2b2b2b' : '#f8f9fa',
                border: darkMode ? '1px solid #bb86fc' : '1px solid #dee2e6',
                borderRadius: '12px',
                marginBottom: '1rem',
                boxShadow: darkMode
                  ? '0 0 10px rgba(187,134,252,0.3)'
                  : '0 0 10px rgba(13,110,253,0.2)',
                transition: 'background-color 0.3s ease',
                overflow: 'hidden',
              }}
            >
              {/* عنوان السؤال مع زر التبديل */}
              <button
                onClick={() => toggleFAQ(index)}
                aria-expanded={isActive}
                aria-controls={`faq-content-${index}`}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  color: darkMode ? '#f1f1f1' : '#212529',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '12px',
                  userSelect: 'none',
                }}
              >
                {item.question}
                <FaChevronDown
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: darkMode ? '#bb86fc' : '#0d6efd',
                    fontSize: '1.2rem',
                  }}
                />
              </button>

              {/* عرض الجواب عند الفتح */}
              <div
                id={`faq-content-${index}`}
                role="region"
                aria-labelledby={`faq-header-${index}`}
                style={{
                  maxHeight: isActive ? '1000px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                  padding: isActive ? '1rem 1.5rem' : '0 1.5rem',
                  color: darkMode ? '#dcdcdc' : '#495057',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  userSelect: 'text',
                }}
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;

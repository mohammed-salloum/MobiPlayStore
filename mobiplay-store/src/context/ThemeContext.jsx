import React, { createContext, useState, useEffect } from 'react';

// 🔹 إنشاء ThemeContext مع قيم افتراضية
export const ThemeContext = createContext({
  darkMode: false,        // الوضع الداكن افتراضيًا false
  toggleDarkMode: () => {}, // دالة افتراضية لتبديل الوضع
});

// 🔹 ThemeProvider هو Component يغلف التطبيق ويوفر ThemeContext لكل المكونات
export const ThemeProvider = ({ children }) => {
  // 🔹 حالة الوضع الداكن/الفاتح
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 قراءة الوضع المحفوظ في localStorage عند تحميل التطبيق لأول مرة
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) setDarkMode(saved === 'true'); // تحويل القيمة من string إلى boolean
  }, []); // [] يعني تنفذ مرة واحدة فقط عند mount

  // 🔹 تحديث localStorage وتطبيق الكلاسات على body عند تغير darkMode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode); // حفظ الاختيار
    if (darkMode) {
      document.body.classList.add('dark-body');   // إضافة كلاس الوضع الداكن
      document.body.classList.remove('light-body'); // إزالة كلاس الوضع الفاتح
    } else {
      document.body.classList.add('light-body');
      document.body.classList.remove('dark-body');
    }
  }, [darkMode]); // يُنفذ كل مرة يتغير فيها darkMode

  // 🔹 دالة لتبديل الوضع الداكن/الفاتح
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 🔹 تمرير القيم والدوال لكل الكومبوننتات التي تستخدم ThemeContext
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children} {/* كل مكونات التطبيق تكون هنا */}
    </ThemeContext.Provider>
  );
};

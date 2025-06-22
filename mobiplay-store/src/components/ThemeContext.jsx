// ThemeContext.jsx - إدارة الوضع الداكن باستخدام Context API

import React, { createContext, useState, useEffect } from 'react';

// إنشاء السياق مع القيم الافتراضية
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// موفر السياق ThemeProvider يقوم بتغليف التطبيق وتمرير الحالة للأطفال
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false); // الحالة الرئيسية للوضع الداكن

  // عند التحميل، يتم جلب القيمة المحفوظة من localStorage (إن وُجدت)
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) setDarkMode(saved === 'true');
  }, []);

  // تحديث localStorage وتعديل كلاس body كلما تغيّرت الحالة
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);

    // ✨ إضافة أو إزالة كلاس بحسب الوضع الحالي لتنسيق body عبر CSS
    document.body.classList.toggle('dark-body', darkMode);
    document.body.classList.toggle('light-body', !darkMode);
  }, [darkMode]);

  // دالة لتبديل الوضع عند الضغط على زر أو أي تفاعل
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    // توفير القيمة لكافة مكونات التطبيق
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

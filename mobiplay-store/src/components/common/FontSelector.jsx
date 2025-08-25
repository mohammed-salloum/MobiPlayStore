import React, { useState, useEffect } from "react";
import { FaFont, FaPenFancy, FaCode } from 'react-icons/fa'; // أيقونات للزر
import "./FontSelector.css"; // CSS الخاص بالزر

// 🔹 تعريف الخطوط المتاحة مع أيقوناتها وكلاسات CSS قصيرة
const fonts = [
  { className: 'inter', icon: FaFont },
  { className: 'roboto', icon: FaPenFancy },
  { className: 'lato', icon: FaCode },
];

const FontSelector = ({ darkMode }) => {
  // 🔹 قراءة الخط المحفوظ مسبقًا من localStorage أو تعيين الخط الافتراضي
  const storedFont = localStorage.getItem("selectedFont") || "inter";
  const initialIndex = fonts.findIndex(f => f.className === storedFont);
  const [current, setCurrent] = useState(initialIndex >= 0 ? initialIndex : 0);

  // 🔹 تحديث الخط على الـ body وحفظه عند تغيير current
  useEffect(() => {
    // إزالة جميع كلاسات الخطوط القديمة
    fonts.forEach(f => document.body.classList.remove(f.className));

    // إضافة كلاس الخط الحالي
    document.body.classList.add(fonts[current].className);

    // حفظ اختيار المستخدم في localStorage
    localStorage.setItem("selectedFont", fonts[current].className);
  }, [current]);

  // 🔹 دالة تبديل الخط عند الضغط على الزر
  const handleSwitch = () => {
    const next = (current + 1) % fonts.length; // الانتقال للخط التالي
    setCurrent(next);

    // إضافة تأثير دوران للزر عند التبديل
    const btn = document.getElementById("fontBtn");
    if (btn) {
      btn.classList.add("rotate"); // إضافة الكلاس
      setTimeout(() => btn.classList.remove("rotate"), 500); // إزالة بعد نصف ثانية
    }
  };

  const Icon = fonts[current].icon; // اختيار الأيقونة الحالية

  // 🔹 زر FontSelector
  return (
    <button
      id="fontBtn"
      className={`btn-font ${darkMode ? 'dark' : 'light'}`} // الوضع الداكن أو الفاتح
      onClick={handleSwitch}
      title="تبديل الخط"
    >
      {Icon && <Icon />} {/* عرض الأيقونة إذا موجودة */}
    </button>
  );
};

export default FontSelector; // تصدير الكومبوننت لاستخدامه في Navbar أو أي مكان آخر

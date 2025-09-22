import React, { useState, useEffect, useRef } from 'react';
import { FaFont, FaPenFancy, FaCode, FaRegKeyboard, FaCaretDown } from 'react-icons/fa';
import './FontSwitcher.css';

const fonts = [
  { className: 'inter', fontFamily: "'Inter', sans-serif", icon: FaFont },          // عصري ونظيف للنصوص العادية
  { className: 'playfair', fontFamily: "'Playfair Display', serif", icon: FaPenFancy }, // كلاسيكي وأنيق للعناوين
  { className: 'poppins', fontFamily: "'Poppins', sans-serif", icon: FaCode },     // مستدير وواضح، يعطي إحساس عصري
  { className: 'tajawal', fontFamily: "'Tajawal', sans-serif", icon: FaRegKeyboard },  // ممتاز للنصوص العربية الحديثة
];

const FontSwitcher = () => {
  const storedFont = localStorage.getItem("selectedFont") || "inter";
  const initialIndex = fonts.findIndex(f => f.className === storedFont);
  const [current, setCurrent] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    // إزالة أي خطوط سابقة وإضافة الخط الحالي عن طريق متغير CSS
    document.body.style.setProperty('--main-font', fonts[current].fontFamily);
    localStorage.setItem("selectedFont", fonts[current].className);
  }, [current]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="font-switcher" ref={ref}>
      <button
        className="font-switcher-btn"
        onClick={() => setOpen(!open)}
      >
        {React.createElement(fonts[current].icon, { className: "font-icon" })}
        <FaCaretDown className={`caret-icon ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="font-menu">
          {fonts.map((f, idx) => (
            <button
              key={f.className}
              className={`font-btn ${idx === current ? 'active' : ''}`}
              onClick={() => { setCurrent(idx); setOpen(false); }}
            >
              {React.createElement(f.icon, { className: "font-icon" })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FontSwitcher;

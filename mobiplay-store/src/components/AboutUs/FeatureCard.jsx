// src/components/AboutUs/FeatureCard.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function FeatureCard({ icon: Icon, iconSize, title, text, isRTL }) {
  const { theme } = useContext(ThemeContext); // أخذ الثيم من Context

  return (
    <div className={`feature-card ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* الأيقونة ترث لون الثيم تلقائياً */}
      <Icon className="icon-wrapper" size={iconSize} />
      <h5 className="feature-title">{title}</h5>
      <p className="feature-text">{text}</p>
    </div>
  );
}

export default FeatureCard;

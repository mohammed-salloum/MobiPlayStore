// src/components/AboutUs/FeatureCard.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

// FeatureCard component represents a single feature with an icon, title, and description
// Props:
// - icon: a React component for the feature icon
// - iconSize: size of the icon
// - title: feature title text
// - text: feature description text
// - isRTL: boolean to set text direction (Right-to-Left if true)
function FeatureCard({ icon: Icon, iconSize, title, text, isRTL }) {
  // Access the current theme from ThemeContext
  const { theme } = useContext(ThemeContext);

  return (
    // Apply theme class and set text direction based on isRTL prop
    <div className={`feature-card ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Render the icon with dynamic size; icon inherits color from the theme */}
      <Icon className="icon-wrapper" size={iconSize} />
      
      {/* Feature title */}
      <h5 className="feature-title">{title}</h5>
      
      {/* Feature description text */}
      <p className="feature-text">{text}</p>
    </div>
  );
}

export default FeatureCard;

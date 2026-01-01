import React from "react";
import "./FeatureCard.css";

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="feature-card">
      <div className="icon-wrapper">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
};

export default FeatureCard;

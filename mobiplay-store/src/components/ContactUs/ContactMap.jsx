import React from "react";
import { useTranslation } from "react-i18next";
import "./ContactMap.css";

function ContactMap({ small, zoom = 14 }) {
  const { t } = useTranslation();

  // الموقع بالإنجليزي
  const locationQuery = "MobiPlayStore, Tartus, Syria";

  const buildMapURL = () => {
    const base = "https://maps.google.com/maps";
    return `${base}?q=${encodeURIComponent(locationQuery)}&z=${zoom}&output=embed`;
  };

  const src = buildMapURL();

  return (
    <div className={`contact-map-wrapper ${small ? "small" : ""}`}>
      <iframe
        title="MobiPlayStore"
        src={src}
        loading="lazy"
        style={{
          width: "100%",
          height: small ? "220px" : "400px",
          border: 0,
          pointerEvents: "auto", // تفاعل ممكن على كل الشاشات
        }}
      ></iframe>
    </div>
  );
}

export default ContactMap;

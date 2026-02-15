import { useTranslation } from "react-i18next";
import "./ContactMap.css";

/* =========================
   ContactMap Component
   - Displays Google Maps iframe for store location
   - Supports optional small view and zoom level
========================= */
function ContactMap({ small, zoom = 14 }) {
  const { t } = useTranslation();

  // Store location query in English for Google Maps
  const locationQuery = "MobiPlayStore, Tartus, Syria";

  /* =========================
     Build Google Maps embed URL
     - Encodes location query and zoom
     - Returns iframe-friendly URL
  ======================== */
  const buildMapURL = () => {
    const base = "https://maps.google.com/maps";
    return `${base}?q=${encodeURIComponent(locationQuery)}&z=${zoom}&output=embed`;
  };

  const src = buildMapURL(); // iframe src

  return (
    /* Wrapper adjusts size if 'small' prop is true */
    <div className={`contact-map-wrapper ${small ? "small" : ""}`}>
      <iframe
        title="MobiPlayStore"
        src={src}
        loading="lazy" // improves performance on page load
      ></iframe>
    </div>
  );
}

export default ContactMap;

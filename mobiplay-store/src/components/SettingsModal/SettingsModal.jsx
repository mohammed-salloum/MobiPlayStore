import { useContext, useEffect } from "react";
import ThemeSwitcher from "../Common/ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../Common/LanguageSwitcher/LanguageSwitcher";
import FontSwitcher from "../Common/FontSwitcher/FontSwitcher";
import { useTranslation } from "react-i18next";
import { FontContext } from "../../context/FontContext";
import { FiSettings } from "react-icons/fi"; 
import { IoClose } from "react-icons/io5";
import "./SettingsModal.css";

function SettingsModal({ onClose }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Detect RTL languages
  const { fontSize } = useContext(FontContext); // Get current font size from context

  const stopPropagation = (e) => e.stopPropagation(); // Prevent modal click from closing overlay

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevTitle = document.title;

    // Lock scroll when modal is open
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // Update document title based on current language
    const updateTitle = () => {
      document.title = t("titles.settings");
    };
    updateTitle();

    i18n.on("languageChanged", updateTitle); // Update title dynamically on language change

    return () => {
      // Restore scroll and previous title when modal closes
      html.style.overflow = "";
      body.style.overflow = "";
      i18n.off("languageChanged", updateTitle);
      document.title = prevTitle;
    };
  }, [i18n, t]);

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div
        className={`settings-modal ${isRTL ? "rtl" : "ltr"}`} // Apply RTL or LTR layout
        style={{ fontSize: `${fontSize}px` }} // Apply font size from context
        onClick={stopPropagation}
      >
        <div className="settings-header">
          <h3 className="settings-title">
            <FiSettings className="settings-icon" /> {t("settings.title")}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <IoClose className="close-icon" />
          </button>
        </div>

        <div className="settings-content">
          {/* Font size adjustment section */}
          <div className="settings-section">
            <h4>{t("settings.fontSize")}</h4>
            <FontSwitcher defaultSize={18} />
          </div>

          <hr />

          {/* Theme selection section */}
          <div className="settings-section">
            <h4>{t("settings.themes")}</h4>
            <ThemeSwitcher displayInline={true} showNames={true} />
          </div>

          <hr />

          {/* Language selection section */}
          <div className="settings-section">
            <h4>{t("settings.languages")}</h4>
            <LanguageSwitcher showIcons={true} showNames={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
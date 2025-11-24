import React, { useContext, useEffect } from "react";
import ThemeSwitcher from "../Common/ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../Common/LanguageSwitcher/LanguageSwitcher";
import FontSwitcher from "../Common/FontSwitcher/FontSwitcher";
import { useTranslation } from "react-i18next";
import { FontContext } from "../../context/FontContext";
import { FiSettings } from "react-icons/fi"; // أيقونة إعدادات
import { IoClose } from "react-icons/io5";   // أيقونة إغلاق
import "./SettingsModal.css";

function SettingsModal({ onClose }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { fontSize } = useContext(FontContext);

  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevTitle = document.title;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const updateTitle = () => {
      document.title = t("titles.settings");
    };
    updateTitle();

    i18n.on("languageChanged", updateTitle);

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      i18n.off("languageChanged", updateTitle);
      document.title = prevTitle;
    };
  }, [i18n, t]);

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div
        className={`settings-modal ${isRTL ? "rtl" : "ltr"}`}
        style={{ fontSize: `${fontSize}px` }}
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
          <div className="settings-section">
            <h4>{t("settings.fontSize")}</h4>
            <FontSwitcher defaultSize={18} />
          </div>

          <hr />

          <div className="settings-section">
            <h4>{t("settings.themes")}</h4>
            <ThemeSwitcher displayInline={true} showNames={true} />
          </div>

          <hr />

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

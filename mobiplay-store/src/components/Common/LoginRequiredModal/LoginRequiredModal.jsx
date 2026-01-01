import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../context/ThemeContext";
import Button from "../../Common/Button/Button";
import Spinner from "../../Common/Spinner/Spinner";
import "./LoginRequiredModal.css";

const LoginRequiredModal = ({ show, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  // منع تمرير الصفحة عند فتح المودال
  useEffect(() => {
    if (show) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY;
    } else {
      const scrollY = document.body.dataset.scrollY ? parseInt(document.body.dataset.scrollY) : 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  }, [show]);

  // غلق عند الضغط خارج المودال أو Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleCancel();
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCancel();
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [show]);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1000);
  };

  const handleCancel = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onCancel();
    }, 300);
  };

  if (!show) return null;

  return (
    <>
      {/* Overlay المودال */}
      <div className={`login-modal-overlay theme-${theme} ${closing ? "fade-out" : "fade-in"}`}>
        <div className="login-modal" ref={modalRef}>
          <h3 className="login-modal-message">{t("loginRequired.message")}</h3>
          <div className="login-modal-buttons">
            <Button variant="primary" theme={theme} onClick={handleConfirm}>
              {t("loginRequired.confirm")}
            </Button>
            <Button variant="secondary" theme={theme} onClick={handleCancel}>
              {t("loginRequired.cancel")}
            </Button>
          </div>
        </div>
      </div>

      {/* Spinner overlay كامل الشاشة عبر Portal */}
      {loading &&
        createPortal(
          <div className="global-spinner-overlay">
            <Spinner fullScreen={true} />
          </div>,
          document.body
        )}
    </>
  );
};

export default LoginRequiredModal;

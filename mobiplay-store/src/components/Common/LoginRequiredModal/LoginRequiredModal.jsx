import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../context/ThemeContext";
import Button from "../../Common/Button/Button";
import Spinner from "../../Common/Spinner/Spinner";
import "./LoginRequiredModal.css";

const LoginRequiredModal = ({ show, onConfirm, onCancel }) => {
  const { t } = useTranslation();                  // Translation function
  const { theme } = useContext(ThemeContext);     // Current theme (light/dark)
  const modalRef = useRef(null);                  // Ref for modal element
  const [loading, setLoading] = useState(false); // Loading state for confirm action
  const [closing, setClosing] = useState(false); // Animate closing

  // Prevent body scrolling when modal is open
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
      const scrollY = document.body.dataset.scrollY
        ? parseInt(document.body.dataset.scrollY)
        : 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY); // Restore previous scroll
      delete document.body.dataset.scrollY;
    }
  }, [show]);

  // Close modal on outside click or Escape key
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

  // Confirm button handler (simulates loading)
  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1000); // Simulate network delay
  };

  // Cancel button handler with fade-out animation
  const handleCancel = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onCancel();
    }, 300); // Duration matches fade-out animation
  };

  if (!show) return null; // Do not render if modal is hidden

  return (
    <>
      {/* Modal overlay */}
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

      {/* Full-screen spinner using portal */}
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
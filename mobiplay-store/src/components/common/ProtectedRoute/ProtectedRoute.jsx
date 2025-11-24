import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginRequiredModal from "../LoginRequiredModal/LoginRequiredModal";
import { selectUser } from "../../../redux/slices/userSlice"; // selector من Redux

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(!user);

  const handleConfirmLogin = () => {
    setShowModal(false);
    navigate(`/${location.pathname.split("/")[1]}/login`, {
      state: { from: location.pathname },
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate(-1);
  };

  // إذا المستخدم مسجّل → اعرض المحتوى مباشرة
  if (user) return children;

  // المستخدم غير مسجّل → اعرض المودال
  return (
    <LoginRequiredModal
      show={showModal}
      onConfirm={handleConfirmLogin}
      onCancel={handleCancel}
    />
  );
};

export default ProtectedRoute;

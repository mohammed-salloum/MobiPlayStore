import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginRequiredModal from "../LoginRequiredModal/LoginRequiredModal";
import { selectUser } from "../../../redux/slices/userSlice"; // Redux selector for user state

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);           // Current logged-in user
  const navigate = useNavigate();                 // Router navigation
  const location = useLocation();                 // Current URL location
  const [showModal, setShowModal] = useState(!user); // Show modal if user is not logged in

  // User chooses to log in → redirect to login page
  const handleConfirmLogin = () => {
    setShowModal(false);
    navigate(`/${location.pathname.split("/")[1]}/login`, {
      state: { from: location.pathname },       // Preserve the path user was trying to access
    });
  };

  // User cancels → go back to previous page
  const handleCancel = () => {
    setShowModal(false);
    navigate(-1);
  };

  // If user is logged in, render the protected content
  if (user) return children;

  // If not logged in, show modal prompting login
  return (
    <LoginRequiredModal
      show={showModal}
      onConfirm={handleConfirmLogin}
      onCancel={handleCancel}
    />
  );
};

export default ProtectedRoute;
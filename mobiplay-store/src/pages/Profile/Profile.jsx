// src/pages/Profile/Profile.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaEdit, FaLock, FaUserCircle } from "react-icons/fa";
import Button from "../../components/Common/Button/Button";
import { selectUser, updateUserAsync } from "../../redux/slices/userSlice";
import { selectCartItems } from "../../redux/slices/cartSlice";
import { handleLogout as logoutService } from "../../services/cartService";
import "./Profile.css";

/**
 * Profile Page
 * --------------------------------------------------
 * Handles user profile display and updates:
 * - Shows user information (username, email, avatar)
 * - Allows editing profile details and avatar
 * - Handles password change securely
 * - Integrates with Redux for state management
 * - Supports RTL/LTR and i18n translations
 */
function Profile() {
  // i18n and RTL check
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  // Redux state
  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  // --------------------------------------------------
  // Initialize form data when user changes
  // --------------------------------------------------
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAvatar(null);
      setAvatarDeleted(false);
      setMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setAvatarUrl(user.avatar || null);
    }
  }, [user]);

  // --------------------------------------------------
  // Manage avatar preview URL safely
  // --------------------------------------------------
  useEffect(() => {
    let url = null;
    if (avatarDeleted) {
      setAvatarUrl(null);
      return;
    }

    if (avatar instanceof File || avatar instanceof Blob) {
      url = URL.createObjectURL(avatar);
      setAvatarUrl(url);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [avatar, avatarDeleted]);

  // --------------------------------------------------
  // Avatar input handlers
  // --------------------------------------------------
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarDeleted(false);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setAvatarDeleted(true);
    setAvatarUrl(null);
  };

  // --------------------------------------------------
  // Editing state handlers
  // --------------------------------------------------
  const openEdit = () => {
    setIsEditing(true);
    setShowPasswordForm(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
    setAvatar(null);
    setAvatarDeleted(false);
    setMessage("");
    setCurrentPassword("");
    setNewPassword("");
    setAvatarUrl(user.avatar || null);
  };

  // --------------------------------------------------
  // Save profile changes
  // --------------------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Password validation
    if (showPasswordForm) {
      if (newPassword && !currentPassword) {
        setMessage(t("profile.currentPasswordRequired"));
        return;
      }
      if (!newPassword && currentPassword) {
        setMessage(t("profile.newPasswordRequired"));
        return;
      }
    }

    // Prepare FormData for API
    const formData = new FormData();
    formData.append("username", username || user.username);
    formData.append("email", email || user.email);
    formData.append("avatarDeleted", avatarDeleted ? "true" : "false");

    if (showPasswordForm && newPassword) {
      formData.append("password", newPassword);
      formData.append("currentPassword", currentPassword || "");
    }

    if (avatar instanceof File) formData.append("avatar", avatar);

    try {
      const resultAction = await dispatch(
        updateUserAsync({ id: String(user.id), formData })
      );

      // Success
      if (updateUserAsync.fulfilled.match(resultAction)) {
        setMessage(t("profile.saved"));
        setIsEditing(false);
        setShowPasswordForm(false);
        setCurrentPassword("");
        setNewPassword("");
        setAvatar(null);
        setAvatarDeleted(false);
        setAvatarUrl(resultAction.payload.user.avatar || null);
      }
      // Expected errors
      else if (updateUserAsync.rejected.match(resultAction)) {
        const code = resultAction.payload?.code;
        const messageMap = {
          wrongCurrentPassword: t("profile.currentPasswordIncorrect"),
          currentPasswordRequired: t("profile.currentPasswordRequired"),
          newPasswordRequired: t("profile.newPasswordRequired"),
          emailExists: t("profile.emailExists"),
        };
        setMessage(messageMap[code] || t("profile.updateFailed"));
      }
    } catch {
      // Unexpected errors
      setMessage(t("profile.updateFailed"));
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  // --------------------------------------------------
  // Logout handler
  // --------------------------------------------------
  const handleLogout = () => {
  // Use i18n translation key instead of hardcoded text
  setToastMessage(t("profile.logoutSuccess")); 

  // Delay actual logout to allow toast to show
  setTimeout(() => logoutService(cartItems, dispatch, navigate, lang), 1000);
};


  // --------------------------------------------------
  // Not logged in view
  // --------------------------------------------------
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>{t("profile.notLoggedIn")}</h2>
          <Button onClick={() => navigate(`/${lang}/login`)} variant="primary">
            {t("nav.login")}
          </Button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main profile view
  // --------------------------------------------------
  return (
    <div className="profile-container" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="profile-title">{t("profile.title")}</h2>
      <div className="profile-card">

        {/* Avatar Section */}
        <div className="avatar-wrapper">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="profile-avatar-img" />
          ) : (
            <FaUserCircle size={80} className="profile-avatar-icon" />
          )}

          {isEditing && (
            <div className="avatar-actions">
              <label htmlFor="avatar-upload" className="avatar-action-btn edit">
                <FaEdit />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  className="avatar-action-btn delete"
                  onClick={handleDeleteAvatar}
                >
                  <FaTrash />
                </button>
              )}

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>

        {/* Profile Info or Edit Form */}
        {!isEditing ? (
          <>
            <h2 className="profile-name">{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-buttons">
              <Button onClick={openEdit} variant="primary">{t("profile.editProfile")}</Button>
              <Button onClick={handleLogout} variant="danger">{t("nav.logout")}</Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="edit-form">
            <input
              type="text"
              className="profile-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("profile.username")}
            />

            <input
              type="email"
              className="profile-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("profile.email")}
            />

            {!showPasswordForm ? (
              <Button type="button" onClick={() => setShowPasswordForm(true)} variant="secondary">
                <FaLock /> {t("profile.changePassword")}
              </Button>
            ) : (
              <div className="password-form">
                <input
                  type="password"
                  className="profile-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("profile.currentPassword")}
                />
                <input
                  type="password"
                  className="profile-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("profile.newPassword")}
                />
              </div>
            )}

            <div className="profile-buttons">
              <Button type="submit" variant="primary">{t("profile.save")}</Button>
              <Button onClick={cancelEdit} variant="danger">{t("profile.cancel")}</Button>
            </div>
          </form>
        )}

        {/* Feedback Messages */}
        {message && <p className="success-message">{message}</p>}
        {toastMessage && <div className="toast-message">{toastMessage}</div>}
      </div>
    </div>
  );
}

export default Profile;
// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaEdit, FaLock, FaUserCircle } from "react-icons/fa";
import Button from "../../components/Common/Button/Button";
import { selectUser, updateUserAsync } from "../../redux/slices/userSlice";
import { selectCartItems } from "../../redux/slices/cartSlice";
import { handleLogout as logoutService } from "../../services/cartService";
import "./Profile.css";

function Profile() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  const user = useSelector(selectUser);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // تهيئة البيانات عند تغيير المستخدم
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

  // إدارة عرض رابط الأفاتار بشكل آمن
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
const handleSave = async (e) => {
  e.preventDefault();
  if (!user) return;

  // التحقق من كلمة المرور
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
    const resultAction = await dispatch(updateUserAsync({ id: String(user.id), formData }));

    if (updateUserAsync.fulfilled.match(resultAction)) {
      // نجاح التحديث
      setMessage(t("profile.saved"));
      setIsEditing(false);
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setAvatar(null);
      setAvatarDeleted(false);
      setAvatarUrl(resultAction.payload.user.avatar || null);
    } else if (updateUserAsync.rejected.match(resultAction)) {
      // الأخطاء المتوقعة تظهر فقط بالواجهة
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
    // أخطاء غير متوقعة عامة
    setMessage(t("profile.updateFailed"));
  }

  // مسح الرسالة بعد 3 ثواني
  setTimeout(() => setMessage(""), 3000);
};


  const handleLogout = () => {
    setToastMessage(lang === "ar" ? "تم تسجيل الخروج 👋" : "Logged out 👋");
    setTimeout(() => logoutService(cartItems, dispatch, navigate, lang), 1000);
  };

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

  return (
    <div className="profile-container" dir={isRTL ? "rtl" : "ltr"}>
     <h2 className="profile-title">{t("profile.title")}</h2>
      <div className="profile-card">
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

        {message && <p className="success-message">{message}</p>}
        {toastMessage && <div className="toast-message">{toastMessage}</div>}
      </div>
    </div>
  );
}

export default Profile;

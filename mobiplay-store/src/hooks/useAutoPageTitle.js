import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function useAutoPageTitle({ baseTitle = "MobiPlayStore", skip = false }) {
  const location = useLocation();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (skip) return; // إذا الإعدادات مفتوحة، لا نغير العنوان

    let path = location.pathname.replace(/^\/+/, "");
    let key = "home";

    if (path) {
      const parts = path.split("/");
      const slug = ["en", "ar"].includes(parts[0].toLowerCase()) ? (parts[1] || "home") : parts[0];

      const aliasMap = {
        signin: "signIn",
        login: "signIn",
        register: "register",
        "reset-password": "resetPassword",
        "about-us": "about",
        "contact-us": "contact",
        "product": "productDetails", // صفحة تفاصيل المنتج
        "profile": "profile",        // صفحة الملف الشخصي
        "orders": "orders"           // صفحة الطلبات
      };

      key = aliasMap[slug.toLowerCase()] || slug.toLowerCase();

      // إذا مفتاح غير موجود في الترجمة نضع notFound
      const availableKeys = [
        "home","products","offers","faq","about","contact","cart",
        "checkout","signIn","register","resetPassword","settings",
        "notFound","productDetails","profile","orders"
      ];
      if (!availableKeys.includes(key)) key = "notFound";
    }

    document.title = t(`titles.${key}`, { defaultValue: key }) || baseTitle;
  }, [location, i18n.language, t, baseTitle, skip]);
}

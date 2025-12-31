import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to automatically set the document title based on the current route
 * and the selected language.
 *
 * @param {Object} options
 * @param {string} options.baseTitle - Default title to use if translation is missing
 * @param {boolean} options.skip - If true, skips updating the title
 */
export default function useAutoPageTitle({ baseTitle = "MobiPlayStore", skip = false }) {
  const location = useLocation();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (skip) return; // Do not update title if skip flag is true

    // Get the current path without leading slashes
    let path = location.pathname.replace(/^\/+/, "");
    let key = "home"; // Default translation key

    if (path) {
      const parts = path.split("/");

      // Handle language prefixes in the URL (e.g., /en/home or /ar/home)
      const slug = ["en", "ar"].includes(parts[0].toLowerCase()) ? (parts[1] || "home") : parts[0];

      // Map URL slugs to translation keys
      const aliasMap = {
        signin: "signIn",
        login: "signIn",
        register: "register",
        "reset-password": "resetPassword",
        "about-us": "about",
        "contact-us": "contact",
        "product": "productDetails",
        "profile": "profile",
        "orders": "orders"
      };

      key = aliasMap[slug.toLowerCase()] || slug.toLowerCase();

      // Validate key against available translation keys
      const availableKeys = [
        "home","products","offers","faq","about","contact","cart",
        "checkout","signIn","register","resetPassword","settings",
        "notFound","productDetails","profile","orders"
      ];

      if (!availableKeys.includes(key)) key = "notFound"; // Fallback if key is missing
    }

    // Set the document title using the translation key or fallback to baseTitle
    document.title = t(`titles.${key}`, { defaultValue: key }) || baseTitle;

  }, [location, i18n.language, t, baseTitle, skip]);
}

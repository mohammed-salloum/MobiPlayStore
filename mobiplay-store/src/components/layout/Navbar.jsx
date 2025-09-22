import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { FaGamepad, FaBars, FaTimes } from "react-icons/fa";
import ThemeSwitcher from "../common/ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../common/LanguageSwitcher/LanguageSwitcher";
import FontSwitcher from "../common/FontSwitcher/FontSwitcher";
import CartIcon from "../CartIcon/CartIcon";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

function Navbar() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const isRTL = language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { path: "", label: t("nav.home") },
    { path: "products", label: t("nav.productsLabel") },
    { path: "offers", label: t("nav.offersLabel") },
    { path: "about-us", label: t("nav.aboutLabel") },
    { path: "contact-us", label: t("nav.contactLabel") },
  ];

  const moreLinks = [
    { path: "faq", label: t("nav.faqLabel") },
    { path: "reviews", label: t("nav.reviewsLabel") },
  ];

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${theme} ${scrolled ? "scrolled" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="navbar-container">
        <NavLink to={`/${language}/`} className="navbar-brand" onClick={closeMenu}>
          <FaGamepad /> {t("siteName")}
        </NavLink>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className={`navbar-content ${isOpen ? "open" : ""}`}>
          <ul className="navbar-links">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={`/${language}/${path}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            <li className="dropdown">
              <span className="dropdown-toggle" onClick={toggleDropdown}>
                {t("nav.more")}
              </span>
              <ul className={`dropdown-menu ${dropdownOpen ? "open" : ""}`}>
                {moreLinks.map(({ path, label }) => (
                  <li key={path}>
                    <NavLink
                      to={`/${language}/${path}`}
                      className={({ isActive }) => (isActive ? "active" : "")}
                      onClick={closeMenu}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="navbar-tools">
            <LanguageSwitcher />
            <FontSwitcher />
            <ThemeSwitcher />
            <CartIcon collapseNavbar={closeMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

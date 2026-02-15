import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import { LanguageContext } from "../../context/LanguageContext";
import { FontContext } from "../../context/FontContext";
import { FaGamepad, FaBars, FaTimes, FaUserCircle, FaUser } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import CartIcon from "../CartIcon/CartIcon";
import { useTranslation } from "react-i18next";
import { selectUser, logout } from "../../redux/slices/userSlice";
import "./Navbar.css";

function Navbar({ openSettings }) {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { fontSize, fontFamily } = useContext(FontContext);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = language === "ar";

  // =========================
  // State
  // =========================
  const [isOpen, setIsOpen] = useState(false); // Hamburger menu open state
  const [scrolled, setScrolled] = useState(false); // Navbar shadow on scroll
  const [userMenuOpen, setUserMenuOpen] = useState(false); // User dropdown

  // =========================
  // Refs
  // =========================
  const menuBtnRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const navContentRef = useRef(null);
  const userMenuRef = useRef(null);

  // =========================
  // Navigation Links
  // =========================
  const navLinks = [
    { path: "", label: t("nav.home") },
    { path: "products", label: t("nav.productsLabel") },
    { path: "offers", label: t("nav.offersLabel") },
    { path: "faq", label: t("nav.faqLabel") },
    { path: "contact-us", label: t("nav.contactLabel") },
    { path: "about-us", label: t("nav.aboutLabel") },
  ];

  // =========================
  // Menu & User Menu Handlers
  // =========================
  const closeMenu = () => {
    if (document.activeElement) document.activeElement.blur();
    setIsOpen(false);
    setUserMenuOpen(false);
    menuBtnRef.current?.focus({ preventScroll: true });
  };

  const toggleMenu = () => {
    setIsOpen(prev => {
      const newState = !prev;
      if (!prev && navContentRef.current) {
        setTimeout(() => navContentRef.current.scrollTop = 0, 0);
      }
      return newState;
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate(`/${language}/login`, { replace: true });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const isHomeActive = () => {
    const homePath = `/${language}/`;
    return location.pathname === homePath || location.pathname === `/${language}`;
  };

  // =========================
  // Scroll Detection for Navbar Shadow
  // =========================
  const handleScroll = useCallback(() => setScrolled(window.scrollY > 50), []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // =========================
  // Apply Font Settings via CSS Variables
  // =========================
  useEffect(() => {
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--main-font", fontFamily);
  }, [fontSize, fontFamily]);

  // =========================
  // Apply Theme to Body
  // =========================
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // =========================
  // Scroll to top on route change
  // =========================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // =========================
  // Close user dropdown on outside click
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // Prevent body scroll when hamburger menu is open
  // =========================
  useEffect(() => {
    const navContent = navContentRef.current;
    if (!isOpen || !navContent) return;

    let startY = 0;

    const touchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const touchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const atTop = navContent.scrollTop === 0;
      const atBottom = navContent.scrollHeight - navContent.scrollTop <= navContent.clientHeight;

      // Prevent scrolling body when over/under scrolled
      if ((atTop && currentY > startY) || (atBottom && currentY < startY)) {
        e.preventDefault();
      }
      e.stopPropagation(); // Allow scrolling inside menu
    };

    document.body.style.overflow = "hidden"; // Lock body scroll
    navContent.addEventListener("touchstart", touchStart, { passive: false });
    navContent.addEventListener("touchmove", touchMove, { passive: false });

    return () => {
      document.body.style.overflow = "";
      navContent.removeEventListener("touchstart", touchStart);
      navContent.removeEventListener("touchmove", touchMove);
    };
  }, [isOpen]);

  // =========================
  // Render
  // =========================
  return (
    <>
      {/* Overlay behind menu */}
      <div className={`navbar-overlay ${isOpen ? "show" : ""} ${theme}`} onClick={closeMenu} tabIndex={-1} />

      {/* Navbar */}
      <nav className={`navbar ${theme} ${scrolled ? "scrolled" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="navbar-container">

          {/* Brand / Logo */}
          <NavLink
            to={`/${language}/`}
            className={isHomeActive() ? "active navbar-brand" : "navbar-brand"}
            end
            onClick={() => { closeMenu(); scrollToTop(); }}
          >
            <FaGamepad /> {t("siteName")}
          </NavLink>

          {/* Navigation links (Hamburger menu content) */}
          <div ref={navContentRef} id="navbar-menu" className={`navbar-content ${isOpen ? "open" : ""}`} role="dialog" aria-modal={isOpen}>
            <ul className="navbar-links">
              {navLinks.map(({ path, label }, index) => {
                const fullPath = `/${language}${path ? `/${path}` : "/"}`;
                return (
                  <li key={path || index} style={{ transitionDelay: `${index * 0.05}s` }}>
                    <NavLink
                      to={fullPath}
                      className={({ isActive }) => (path === "" && isHomeActive() ? "active" : isActive ? "active" : "")}
                      end={path === ""}
                      onClick={() => { closeMenu(); if (location.pathname === fullPath) scrollToTop(); }}
                    >
                      {label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Sign-in if not logged in */}
            {!user && (
              <NavLink to={`/${language}/login`} className="mobile-signin" onClick={() => { closeMenu(); scrollToTop(); }}>
                <FaUserCircle className="signin-icon" />
                <span className="signin-text">{t("nav.signIn")}</span>
              </NavLink>
            )}
          </div>

          {/* Navbar tools: Cart, User, Settings, Hamburger */}
          <div className="navbar-tools">
            <CartIcon collapseNavbar={() => { closeMenu(); scrollToTop(); }} onClick={() => { if (!user) navigate(`/${language}/login`); }} />

            {user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button className="avatar-btn" onClick={(e) => { e.stopPropagation(); setUserMenuOpen(prev => !prev); }} aria-label="User menu">
                  {user.avatar && !user.avatar.includes("placeholder") ? (
                    <img src={user.avatar} alt={user.username || "User Avatar"} className="navbar-avatar" />
                  ) : (
                    <FaUserCircle size={32} />
                  )}
                </button>
                {userMenuOpen && (
                  <div className="dropdown show">
                    <NavLink to={`/${language}/profile`} className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FaUser className="dropdown-icon" /> {t("nav.profile")}
                    </NavLink>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FiLogOut className="dropdown-icon" /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to={`/${language}/login`} className="unified-signin" aria-label={t("nav.signIn")} onClick={scrollToTop}>
                <FaUserCircle className="signin-icon" />
                <span className="signin-text">{t("nav.signIn")}</span>
              </NavLink>
            )}

            {/* Settings Button */}
            <button type="button" ref={settingsBtnRef} className="settings-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openSettings(); settingsBtnRef.current?.focus({ preventScroll: true }); }} aria-label="Settings">
              <FiSettings className="settings-icon" />
              <span className="settings-text">{t("nav.settings") || "Settings"}</span>
            </button>

            {/* Hamburger / Menu Toggle */}
            <button type="button" ref={menuBtnRef} className="menu-toggle" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(); }} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="navbar-menu">
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
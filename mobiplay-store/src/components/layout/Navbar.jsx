import React, { useState, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaGamepad, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import FontSelector from '../common/FontSelector'; // ✅ استدعاء المكون
import "./Navbar.css";
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t } = useTranslation();
  const cartItems = useSelector(state => state.cart.items);
  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleNavbar = () => setIsCollapsed(prev => !prev);
  const collapseNavbar = () => setIsCollapsed(true);

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.productsLabel') },
    { to: '/offers', label: t('nav.offersLabel') },
    { to: '/about', label: t('nav.aboutLabel') },
    { to: '/contact', label: t('nav.contactLabel') },
  ];

  const moreLinks = [
    { to: '/faq', label: t("nav.faqLabel") },
    { to: '/reviews', label: t('nav.reviewsLabel') },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `nav-link fw-semibold ${isActive ? 'active fw-bold' : ''}`;

  return (
    <nav className={`navbar fixed-top navbar-expand-lg ${darkMode ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container-fluid px-3">
        <NavLink className="navbar-brand" to="/" onClick={collapseNavbar}>
          <FaGamepad />
          {t('siteName')}
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`${isCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navLinks.map(({ to, label }) => (
              <li key={to} className="nav-item">
                <NavLink to={to} className={getNavLinkClass} onClick={collapseNavbar}>
                  {label}
                </NavLink>
              </li>
            ))}

            <li className="nav-item dropdown">
              <a
                href="#!"
                className={`nav-link dropdown-toggle fw-semibold ${darkMode ? 'text-light' : ''}`}
                id="moreDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
                style={{ cursor: 'pointer' }}
              >
                {t('nav.more')}
              </a>
              <ul
                className={`dropdown-menu ${darkMode ? 'dropdown-menu-dark' : 'dropdown-menu-light'}`}
                aria-labelledby="moreDropdown"
              >
                {moreLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        'dropdown-item ' + (isActive ? 'active fw-bold' : '')
                      }
                      onClick={collapseNavbar}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav navbar-nav-end d-flex align-items-center gap-2">
            {/* ✅ Language Switcher */}
            <li className="nav-item">
              <LanguageSwitcher />
            </li>

            {/* ✅ Font Selector */}
            <li className="nav-item">
              <FontSelector darkMode={darkMode} />
            </li>

            {/* ✅ Dark Mode Toggle */}
            <li className="nav-item">
              <button
                onClick={toggleDarkMode}
                className={`btn-toggle-darkmode ${darkMode ? 'btn-light' : 'btn-dark'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
            </li>

            {/* ✅ Cart */}
            <li className="nav-item position-relative">
              <NavLink
                to="/cart"
                className="nav-link d-flex align-items-center position-relative fw-semibold"
                onClick={collapseNavbar}
              >
                <FaShoppingCart size={22} />
                <span className="ms-2">{t('nav.cart')}</span>
                {totalQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalQuantity}
                    <span className="visually-hidden">{t('nav.itemsInCart')}</span>
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaGamepad, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from './ThemeContext';

function Navbar() {
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
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/offers', label: 'Offers' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const moreLinks = [
    { to: '/faq', label: 'FAQ' },
    { to: '/reviews', label: 'Reviews' },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `nav-link fw-semibold ${isActive ? 'active fw-bold' : ''}`;

  return (
    <nav
      className={`navbar fixed-top navbar-expand-lg ${
        darkMode ? 'navbar-dark' : 'navbar-light bg-white'
      }`}
      style={{
        backgroundColor: darkMode ? '#121212' : '#ffffff',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="container-fluid px-3">
        <NavLink
          className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2"
          to="/"
          onClick={collapseNavbar}
          style={{
            color: darkMode ? '#bb86fc' : '#0d6efd',
            transition: 'color 0.3s ease',
          }}
        >
          <FaGamepad style={{ color: darkMode ? '#bb86fc' : '#0d6efd' }} />
          MobiPlayStore
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
                className={`nav-link dropdown-toggle fw-semibold ${
                  darkMode ? 'text-light' : ''
                }`}
                id="moreDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
                style={{ cursor: 'pointer' }}
              >
                More
              </a>
              <ul
                className={`dropdown-menu ${darkMode ? 'dropdown-menu-dark' : ''}`}
                aria-labelledby="moreDropdown"
                style={{ backgroundColor: darkMode ? '#121212' : '' }}
              >
                {moreLinks.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        'dropdown-item ' + (isActive ? 'active fw-bold' : '')
                      }
                      onClick={collapseNavbar}
                      style={{
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (darkMode) {
                          e.currentTarget.style.backgroundColor = '#3a1f7b';
                          e.currentTarget.style.color = '#fff';
                        } else {
                          e.currentTarget.style.backgroundColor = '#0d6efd';
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = darkMode ? '#ddd' : '#212529';
                      }}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            {/* زر الوضع الداكن */}
            <li className="nav-item">
              <button
                onClick={toggleDarkMode}
                className={`btn rounded-circle d-flex align-items-center justify-content-center ${
                  darkMode ? 'btn-light' : 'btn-dark'
                }`}
                aria-label="Toggle dark mode"
                style={{
                  width: '28px',
                  height: '28px',
                  padding: 0,
                  fontSize: '16px',
                  lineHeight: 1,
                  border: 'none',
                  color: darkMode ? '#FFD700' : '#000',
                  backgroundColor: 'transparent',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (darkMode) {
                    e.currentTarget.style.color = '#FFC107';
                  } else {
                    e.currentTarget.style.color = '#333';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = darkMode ? '#FFD700' : '#000';
                }}
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
            </li>

            {/* أيقونة السلة */}
            <li className="nav-item position-relative">
              <NavLink
                to="/cart"
                className="nav-link d-flex align-items-center position-relative fw-semibold"
                onClick={collapseNavbar}
                style={{
                  fontSize: '18px',
                  color: darkMode ? '#bb86fc' : '#0d6efd',
                  transition: 'color 0.3s ease',
                }}
              >
                <FaShoppingCart size={22} />
                <span className="ms-2">Cart</span>
                {totalQuantity > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: '0.7rem',
                      minWidth: '18px',
                      height: '18px',
                      lineHeight: '18px',
                    }}
                  >
                    {totalQuantity}
                    <span className="visually-hidden">items in cart</span>
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

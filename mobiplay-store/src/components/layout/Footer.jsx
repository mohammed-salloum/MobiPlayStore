import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import "./Footer.css";
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faLinkedinIn,
  faYoutube,
  faInstagram,
  faPinterestP,
} from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <footer className={`footer ${darkMode ? 'footer-dark' : 'footer-light'} ${isRTL ? 'rtl' : 'ltr'}`} key="footer-main">
        <div className="footer-container" key="footer-container">

          {/* Useful Links */}
          <div className="footer-column useful-links" key="footer-useful-links">
            <h5 key="footer-useful-links-title">{t('footer.usefulLinks')}</h5>
            <ul className="vertical-list" key="footer-useful-links-list">
              <li key="footer-home-link"><a href="/">{t('home')}</a></li>
              <li key="footer-about-link"><a href="/about">{t('aboutLabel')}</a></li>
              <li key="footer-contact-link"><a href="/contact">{t('contactLabel')}</a></li>
            </ul>
          </div>

          {/* Store Info */}
          <div className="footer-column store-info" key="footer-store-info">
            <h5 key="footer-store-name">{t('footer.storeName')}</h5>
            <ul className="vertical-list" key="footer-store-list">
              <li key="footer-city">{t('footer.city')}</li>
              <li key="footer-country">{t('footer.country')}</li>
            </ul>
          </div>

          {/* About */}
          <div className="footer-column about-us" key="footer-about-us">
            <h5 key="footer-about-title">{t('footer.aboutUs')}</h5>
            <p key="footer-about-text">{t('footer.aboutText')}</p>
          </div>

          {/* Connect */}
          <div className="footer-column connect-with-us" key="footer-connect">
            <h5 key="footer-connect-title">{t('footer.connect')}</h5>
            <ul className="contact-list" key="footer-contact-list">
              <li key="footer-contact-message">💬 <a href="/contact">{t('contactLabel')}</a></li>
              <li key="footer-contact-email">📧 <a href="mailto:info@mobiplaystore.com">info@mobiplaystore.com</a></li>
              <li key="footer-contact-phone">📞 <a href="tel:+963944123456">+(963) 944 123 456</a></li>
            </ul>
            <div className="social-icons" key="footer-social-icons">
              <a href="#" key="footer-social-facebook" className="social-icon facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" key="footer-social-x" className="social-icon x"><FontAwesomeIcon icon={faXTwitter} /></a>
              <a href="#" key="footer-social-linkedin" className="social-icon linkedin"><FontAwesomeIcon icon={faLinkedinIn} /></a>
              <a href="#" key="footer-social-youtube" className="social-icon youtube"><FontAwesomeIcon icon={faYoutube} /></a>
              <a href="#" key="footer-social-instagram" className="social-icon instagram"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" key="footer-social-pinterest" className="social-icon pinterest"><FontAwesomeIcon icon={faPinterestP} /></a>
            </div>
          </div>

        </div>
      </footer>

      {/* Footer Bottom */}
      <div className={`footer-bottom ${darkMode ? 'footer-dark' : 'footer-light'} ${isRTL ? 'rtl' : 'ltr'}`} key="footer-bottom">
        <div className="footer-bottom-container" key="footer-bottom-container">
          <p key="footer-all-rights">{t('footer.allRightsReserved')}</p>
          <p key="footer-powered-by">
            {t('footer.poweredBy')} <strong className="react-box">React</strong> -{' '}
            <a href="#" className="no-underline-link" onClick={e => e.preventDefault()} key="footer-free-website">
              {t('footer.freeWebsite')}
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;

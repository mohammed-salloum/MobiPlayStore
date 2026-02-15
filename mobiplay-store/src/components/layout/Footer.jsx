import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faLinkedinIn,
  faYoutube,
  faInstagram,
  faPinterestP,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import "./Footer.css";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar'; // RTL check for Arabic
  const lang = i18n.language || 'en';  // Default language fallback

  return (
    <>
      {/* =========================
          Footer Section
          - Main footer container
          - Applies RTL/LTR class dynamically
      ======================== */}
      <footer className={`footer ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="footer-container">

          {/* =========================
              Useful Links Column
              - Navigation links translated
              - Uses dynamic language in URL
          ======================== */}
          <div className="footer-column useful-links">
            <h5>{t('footer.usefulLinks')}</h5>
            <ul className="vertical-list">
              <li><a href={`/${lang}/`}>{t('home')}</a></li>
              <li><a href={`/${lang}/about-us`}>{t('aboutLabel')}</a></li>
              <li><a href={`/${lang}/contact-us`}>{t('contactLabel')}</a></li>
            </ul>
          </div>

          {/* =========================
              About Us Column
              - Short description of the store/company
          ======================== */}
          <div className="footer-column about-us">
            <h5>{t('footer.aboutUs')}</h5>
            <p>{t('footer.aboutText')}</p>
          </div>

          {/* =========================
              Store Info Column
              - City and country details
          ======================== */}
          <div className="footer-column store-info">
            <h5>{t('footer.storeName')}</h5>
            <ul className="vertical-list">
              <li>{t('footer.city')}</li>
              <li>{t('footer.country')}</li>
            </ul>
          </div>

          {/* =========================
              Connect With Us Column
              - Contact methods and social links
              - Social icons use FontAwesome
          ======================== */}
          <div className="footer-column connect-with-us">
            <h5>{t('footer.connect')}</h5>
            <ul className="contact-list">
              <li>💬 <a href={`/${lang}/contact-us`}>{t('contactLabel')}</a></li>
              <li>📧 <a href="mailto:info@mobiplaystore.com">info@mobiplaystore.com</a></li>
              <li>📞 <a href="tel:+963944123456">+(963) 944 123 456</a></li>
            </ul>

            {/* =========================
                Social Media Icons
                - Each platform gets its own styled link
            ======================== */}
            <div className="social-icons">
              <a href="#" className="social-icon facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="social-icon x"><FontAwesomeIcon icon={faXTwitter} /></a>
              <a href="#" className="social-icon linkedin"><FontAwesomeIcon icon={faLinkedinIn} /></a>
              <a href="#" className="social-icon youtube"><FontAwesomeIcon icon={faYoutube} /></a>
              <a href="#" className="social-icon instagram"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="social-icon pinterest"><FontAwesomeIcon icon={faPinterestP} /></a>
            </div>
          </div>

        </div>
      </footer>

      {/* =========================
          Footer Bottom Section
          - Copyright & credits
          - Handles RTL/LTR layout
      ======================== */}
      <div className={`footer-bottom ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="footer-bottom-container">
          <p>{t('footer.allRightsReserved')}</p>
          <p>
            {t('footer.poweredBy')} <strong className="react-box">React</strong> -{' '}
            <a href="#" className="no-underline-link" onClick={e => e.preventDefault()}>
              {t('footer.freeWebsite')}
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;

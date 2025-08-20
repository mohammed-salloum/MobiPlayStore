import React, { useContext, useState, useEffect } from 'react';
import { FaRocket, FaLock, FaGamepad } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import "./FeaturesSection.css";

const FeaturesSection = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    { icon: <FaRocket size={48} />, title: t('features.fastDelivery.title') || '', desc: t('features.fastDelivery.text') || '' },
    { icon: <FaLock size={48} />, title: t('features.securePayment.title') || '', desc: t('features.securePayment.text') || '' },
    { icon: <FaGamepad size={48} />, title: t('features.wideSelection.title') || '', desc: t('features.wideSelection.text') || '' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4, duration: 1.5, type: 'spring', stiffness: 70 }
    })
  };

  const hoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: darkMode
        ? '0 15px 40px rgba(255, 215, 0, 0.35)'
        : '0 15px 40px rgba(0, 123, 255, 0.25)',
      transition: { duration: 0.5 }
    }
  };

  return (
    <section
      className={`features-section container my-5 ${darkMode ? 'dark' : 'light'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* العنوان الرئيسي */}
      {isMobile ? (
        <h2 className="text-center mb-5 fw-bold">
          {t('features.sectionTitle') || ''}
        </h2>
      ) : (
        <motion.h2
          className="text-center mb-5 fw-bold"
          initial={{ x: isRTL ? 200 : -200, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          animate={{ y: [0, -5, 0, 5, 0] }}
          transition={{
            x: { duration: 1.2, ease: "easeOut" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {t('features.sectionTitle') || ''}
        </motion.h2>
      )}

      <div className="row text-center gx-4 gy-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="col-md-4"
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            variants={cardVariants}
          >
            <motion.div 
              className={`card shadow-sm h-100 feature-card ${darkMode ? 'dark' : 'light'}`}
              whileHover="hover"
              variants={hoverVariants}
            >
              <motion.div 
                className="icon-wrapper mb-3 animate"
                whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
              >
                {feature?.icon || null}
              </motion.div>
              <div className="card-body">
                <h5 className="card-title mb-3">{feature?.title || ''}</h5>
                <p className="card-text fs-6">{feature?.desc || ''}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

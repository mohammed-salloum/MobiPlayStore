import React, { useContext, useState, useEffect } from "react";
import { FaRocket, FaLock, FaGamepad } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AnimatedBackground from "../common/AnimatedBackground/AnimatedBackground";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    { icon: <FaRocket size={48} />, title: t("features.fastDelivery.title"), desc: t("features.fastDelivery.text") },
    { icon: <FaLock size={48} />, title: t("features.securePayment.title"), desc: t("features.securePayment.text") },
    { icon: <FaGamepad size={48} />, title: t("features.wideSelection.title"), desc: t("features.wideSelection.text") },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.4, duration: 1.5, type: "spring", stiffness: 70 } }),
  };

  return (
    <section className={`features-section`} dir={isRTL ? "rtl" : "ltr"}>
      <AnimatedBackground theme={theme} />

      <motion.h2 className="features-title" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.5 }}>
        {t("features.sectionTitle")}
      </motion.h2>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="icon-wrapper">{feature.icon}</div>
            <h5 className="feature-title">{feature.title}</h5>
            <p className="feature-desc">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

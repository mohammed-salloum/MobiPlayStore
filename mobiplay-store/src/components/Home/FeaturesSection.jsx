import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FaRocket, FaLock, FaGamepad, FaHeadset } from "react-icons/fa";
import FeatureCard from "../../components/Common/FeatureCard/FeatureCard";
import Carousel from "../../components/Common/Carousel/Carousel";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    setFeatures([
      {
        icon: <FaRocket size={40} />,
        title: t("features.fastDelivery.title"),
        desc: t("features.fastDelivery.text"),
      },
      {
        icon: <FaLock size={40} />,
        title: t("features.securePayment.title"),
        desc: t("features.securePayment.text"),
      },
      {
        icon: <FaGamepad size={40} />,
        title: t("features.wideSelection.title"),
        desc: t("features.wideSelection.text"),
      },
      {
        icon: <FaHeadset size={40} />,
        title: t("features.support.title") || "24/7 Support",
        desc: t("features.support.text") || "Our support team is always available.",
      },
    ]);
  }, [i18n.language, t]);

  return (
    <section
      className={`features-section ${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="features-title">{t("features.sectionTitle")}</h2>

      <Carousel rtl={i18n.language === "ar"}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </Carousel>
    </section>
  );
};

export default FeaturesSection;

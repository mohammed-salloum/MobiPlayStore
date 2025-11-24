import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBolt, FaUsers, FaBullseye, FaLightbulb } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import Carousel from "../../components/Common/Carousel/Carousel";
import FeatureCard from "../../components/Common/FeatureCard/FeatureCard";
import "./AboutUs.css";

function AboutUs() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [aboutFeatures, setAboutFeatures] = useState([]);

  useEffect(() => {
    setAboutFeatures([
      {
        icon: <FaUsers size={50} />,
        title: t("about.team.title"),
        desc: t("about.team.text"),
      },
      {
        icon: <FaBullseye size={50} />,
        title: t("about.mission.title"),
        desc: t("about.mission.text"),
      },
      {
        icon: <FaLightbulb size={50} />,
        title: t("about.values.title"),
        desc: t("about.values.text"),
      },
      {
        icon: <FaBolt size={50} />,
        title: t("about.speed.title"),
        desc: t("about.speed.text"),
      },
    ]);
  }, [t, i18n.language]);

  return (
    <section className={`about-section ${theme}`} dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="about-title">{t("about.title")}</h2>
      <p className="about-lead-text">{t("about.description")}</p>

      <Carousel rtl={isRTL}>
        {aboutFeatures.map((feat, index) => (
          <FeatureCard
            key={index}
            icon={feat.icon}
            title={feat.title}
            desc={feat.desc}
          />
        ))}
      </Carousel>

      <div className="footer-text">
        <p>{t("about.footerText")}</p>
      </div>
    </section>
  );
}

export default AboutUs;

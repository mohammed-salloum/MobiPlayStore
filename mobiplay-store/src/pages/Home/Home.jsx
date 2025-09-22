import React from "react";
import { useTranslation } from "react-i18next";
import HeroSection from "../../components/Home/HeroSection";
import FeaturesSection from "../../components/Home/FeaturesSection";

const Home = () => {
  const { i18n } = useTranslation();

  return (
    <main dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
};

export default Home;

import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import './Home.css';
import { useTranslation } from "react-i18next";

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

import { useTranslation } from "react-i18next";
import HeroSection from "../../components/Home/HeroSection";
import FeaturesSection from "../../components/Home/FeaturesSection"; // تأكد من الاستيراد
import HappyClientsSection from "../../components/Home/HappyClientsSection";
import "./Home.css";

const Home = () => {
  const { i18n } = useTranslation();

  return (
    <main className="home-container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <HeroSection className="hero-section" />
      <FeaturesSection className="features-section" />
      <HappyClientsSection className="happy-section" />
    </main>
  );
};

export default Home;

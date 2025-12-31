// Import the translation hook from react-i18next
// This hook is used to access the current language and control localization
import { useTranslation } from "react-i18next";

// Import home page sections (UI components)
import HeroSection from "../../components/Home/HeroSection";
import FeaturesSection from "../../components/Home/FeaturesSection";
import HappyClientsSection from "../../components/Home/HappyClientsSection";

// Import Home page specific styles
import "./Home.css";

// Home component represents the main landing page of the application
const Home = () => {
  // Access the i18n instance to determine the current language
  const { i18n } = useTranslation();

  return (
    // Main container for the Home page
    // The text direction is dynamically set based on the selected language
    // RTL for Arabic, LTR for all other languages
    <main
      className="home-container"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero section: main introductory area of the homepage */}
      <HeroSection className="hero-section" />

      {/* Features section: highlights key features or services */}
      <FeaturesSection className="features-section" />

      {/* Happy clients section: displays testimonials or client satisfaction */}
      <HappyClientsSection className="happy-section" />
    </main>
  );
};

export default Home;

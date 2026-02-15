import "./AnimatedBackground.css"; // Custom CSS file for background animations

/* =========================
   AnimatedBackground Component
   - Renders animated backgrounds based on the active theme
   - Each theme displays a specific visual effect
========================= */
const AnimatedBackground = ({ theme }) => {
  return (
    <div className={`animated-bg ${theme}`}>
      
      {/* Dark theme: animated stars */}
      {theme === "dark" && <div className="stars"></div>}

      {/* Light theme: sun rays effect */}
      {theme === "light" && <div className="sun-rays"></div>}

      {/* Reading theme: paper-like texture */}
      {theme === "reading" && <div className="paper-texture"></div>}

      {/* Colorblind theme: high-contrast aurora background */}
      {theme === "colorblind" && <div className="aurora-bg"></div>}
    </div>
  );
};

export default AnimatedBackground;
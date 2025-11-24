import "./AnimatedBackground.css"; // ملف CSS مخصص للأنيميشن

const AnimatedBackground = ({ theme }) => {
  return (
    <div className={`animated-bg ${theme}`}>
      {theme === "dark" && <div className="stars"></div>}
      {theme === "light" && <div className="sun-rays"></div>}
      {theme === "reading" && <div className="paper-texture"></div>}
      {theme === "colorblind" && <div className="aurora-bg"></div>}
    </div>
  );
};

export default AnimatedBackground;

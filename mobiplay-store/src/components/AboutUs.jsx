import React, { useContext } from "react";
import { FaGamepad, FaShieldAlt, FaBolt } from "react-icons/fa";
import { ThemeContext } from "./ThemeContext";

function About() {
  const { darkMode } = useContext(ThemeContext);

  // تعريف ألوان الخلفية والنصوص حسب الوضع (داكن أو فاتح)
  const darkBg = "bg-[#1e1e1e]";
  const lightBg = "bg-light";

  const darkTextPrimary = "text-gray-100";
  const darkTextSecondary = "text-gray-400";

  // تغيير لون الأيقونات حسب الوضع
  const iconStyle = {
    color: darkMode ? "#bb86fc" : "#0d6efd",
  };

  return (
    <div className="container mt-5">
      {/* الصندوق الرئيسي مع تهيئة الألوان بناءً على الوضع */}
      <div
        className={`p-5 rounded shadow-lg ${
          darkMode ? `${darkBg} ${darkTextPrimary}` : `${lightBg} text-dark`
        }`}
        style={{ lineHeight: 1.6 }}
      >
        <h2 className="mb-4 text-center font-semibold text-3xl">
          About MobiPlayStore
        </h2>

        <p className={`lead ${darkMode ? darkTextSecondary : "text-muted"}`}>
          MobiPlayStore is your trusted source for mobile game top-up cards. We’re passionate about delivering fast, secure, and affordable digital products for gamers around the world.
        </p>

        <div className="row mt-4">
          {/* الميزات الأساسية مع أيقونات ملونة */}
          <div className="col-md-4 text-center mb-3">
            <FaGamepad size={40} className="mb-2" style={iconStyle} />
            <h5 className={darkMode ? darkTextPrimary : ""}>Wide Game Selection</h5>
            <p className={darkMode ? darkTextSecondary : "text-muted"}>
              We offer top-ups for popular mobile games like PUBG, Free Fire, and more.
            </p>
          </div>
          <div className="col-md-4 text-center mb-3">
            <FaShieldAlt size={40} className="mb-2" style={iconStyle} />
            <h5 className={darkMode ? darkTextPrimary : ""}>Safe & Secure</h5>
            <p className={darkMode ? darkTextSecondary : "text-muted"}>
              Your transactions are protected with the latest security standards.
            </p>
          </div>
          <div className="col-md-4 text-center mb-3">
            <FaBolt size={40} className="mb-2" style={iconStyle} />
            <h5 className={darkMode ? darkTextPrimary : ""}>Instant Delivery</h5>
            <p className={darkMode ? darkTextSecondary : "text-muted"}>
              Receive your codes instantly after payment – no waiting.
            </p>
          </div>
        </div>

        {/* خاتمة نصية تشجع المستخدم */}
        <div className="mt-4 text-center">
          <p className={darkMode ? darkTextSecondary : "text-muted"}>
            Whether you're a casual player or a competitive gamer, MobiPlayStore is here to make your gaming experience smoother and more rewarding.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;

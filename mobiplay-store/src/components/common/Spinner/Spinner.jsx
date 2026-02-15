import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import "./Spinner.css";

/**
 * Spinner component for showing a loading indicator.
 * Can be rendered normally or as a full-screen overlay.
 * 
 * @param {boolean} fullScreen - Determines if spinner covers the full screen. Default is false.
 */
const Spinner = ({ fullScreen = false }) => {
  // Access the current theme (e.g., "light" or "dark") from ThemeContext
  const { theme } = useContext(ThemeContext);

  return (
    // Wrapper div; applies different CSS classes based on fullScreen prop
    <div className={fullScreen ? "spinner-wrapper-fullscreen" : "spinner-wrapper"}>
      {/* Spinner element itself, styled differently depending on the current theme */}
      <div className={`spinner spinner-${theme}`}></div>
    </div>
  );
};

export default Spinner;
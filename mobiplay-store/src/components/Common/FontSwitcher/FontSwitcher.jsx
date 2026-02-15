import { useContext } from "react";
import "./FontSwitcher.css";
import { FontContext } from "../../../context/FontContext";

// Constants to control font resizing
const MAX_OFFSET = 1; // Maximum difference from default font size (in px)
const DELTA = 0.5;    // Each click changes font size by 0.5px

const FontSwitcher = ({ defaultSize = 15 }) => {
  // Get current font size from context and the setter function
  const { fontSize, setFontSize } = useContext(FontContext);

  // Handler for button clicks (increase, decrease, reset)
  const handleSizeClick = (type) => {
    let newSize = fontSize;

    if (type === "reset") newSize = defaultSize; // Reset to default
    if (type === "increase" && fontSize < defaultSize + MAX_OFFSET) newSize += DELTA; // Increment
    if (type === "decrease" && fontSize > defaultSize - MAX_OFFSET) newSize -= DELTA; // Decrement

    // Update context state
    setFontSize(newSize);

    // Apply the new font size to the root element using CSS variable
    document.documentElement.style.setProperty("--main-font-size", `${newSize}px`);
  };

  return (
    <div className="fonts-container">
      {/* Increase font size */}
      <button className="font-btn" onClick={() => handleSizeClick("increase")}>A+</button>

      {/* Reset font size to default */}
      <button className="font-btn" onClick={() => handleSizeClick("reset")}>A</button>

      {/* Decrease font size */}
      <button className="font-btn" onClick={() => handleSizeClick("decrease")}>A-</button>
    </div>
  );
};

export default FontSwitcher;
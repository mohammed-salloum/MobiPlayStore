import React, { useContext } from "react";
import "./FontSwitcher.css";
import { FontContext } from "../../../context/FontContext";

const MAX_OFFSET = 1; // أقصى فرق عن الافتراضي
const DELTA = 0.5;       // كل ضغطة تغير 1px

const FontSwitcher = ({ defaultSize = 15 }) => {
  const { fontSize, setFontSize } = useContext(FontContext);

  const handleSizeClick = (type) => {
    let newSize = fontSize;

    if (type === "reset") newSize = defaultSize;
    if (type === "increase" && fontSize < defaultSize + MAX_OFFSET) newSize += DELTA;
    if (type === "decrease" && fontSize > defaultSize - MAX_OFFSET) newSize -= DELTA;

    setFontSize(newSize);
    document.documentElement.style.setProperty("--main-font-size", `${newSize}px`);
  };

  return (
    <div className="fonts-container">
      <button className="font-btn" onClick={() => handleSizeClick("increase")}>A+</button>
      <button className="font-btn" onClick={() => handleSizeClick("reset")}>A</button>
      <button className="font-btn" onClick={() => handleSizeClick("decrease")}>A-</button>
    </div>
  );
};

export default FontSwitcher;

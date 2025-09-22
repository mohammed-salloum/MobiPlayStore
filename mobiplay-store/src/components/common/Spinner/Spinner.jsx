import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import "./Spinner.css";

const Spinner = ({ fullScreen = false }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={fullScreen ? "spinner-wrapper-fullscreen" : "spinner-wrapper"}>
      <div className={`spinner spinner-${theme}`}></div>
    </div>
  );
};

export default Spinner;

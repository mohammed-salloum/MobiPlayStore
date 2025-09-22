import React from "react";
import Select from "react-select";
import "./CustomSelect.css";

const CustomSelect = ({ options, value, onChange, isSearchable = false }) => {
  return (
    <Select
      classNamePrefix="custom-select"
      className="custom-select-container"
      options={options}
      value={value}
      onChange={onChange}
      isSearchable={isSearchable}
      menuPosition="fixed"   // تجعل القائمة تظهر فوق كل العناصر
      menuPortalTarget={document.body}  // تضمن أن القائمة لا تختفي
    />
  );
};

export default CustomSelect;

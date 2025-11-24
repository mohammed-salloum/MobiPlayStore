import React from "react";
import Select from "react-select";
import "./CustomSelect.css";

const CustomSelect = ({ options, value, onChange, isSearchable = false, placeholder, selectKey }) => {
  return (
 <Select
  key={selectKey}
  classNamePrefix="custom-select"
  className="custom-select-container"
  options={options}
  value={value ?? null}
  onChange={onChange}
  isSearchable={isSearchable}
  placeholder={placeholder}
  isClearable={false}
  menuPortalTarget={document.body} // ✅ يخليها فوق كل العناصر
  menuPosition="fixed"
  styles={{
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // ✅ يمنع أي عناصر من تغطيتها
    }),
    menu: (base) => ({
      ...base,
      marginTop: 4,
      borderRadius: 6,
      overflow: "hidden",
    }),
  }}
/>

  );
};

export default CustomSelect;

import Select from "react-select";
import "./CustomSelect.css";

/**
 * CustomSelect
 * A wrapper around react-select for consistent styling and behavior across the app.
 * 
 * Props:
 * - options: array of { value, label } for dropdown items
 * - value: currently selected option
 * - onChange: callback for selection changes
 * - isSearchable: enable/disable search input
 * - placeholder: text shown when nothing is selected
 * - selectKey: unique key to force re-render (useful for controlled resets)
 */
const CustomSelect = ({
  options,
  value,
  onChange,
  isSearchable = false,
  placeholder,
  selectKey,
}) => {
  return (
    <Select
      key={selectKey}                          // Forces remount when key changes
      classNamePrefix="custom-select"          // Scoped class names for styling
      className="custom-select-container"      // Base wrapper class
      options={options}                        // Options to display
      value={value ?? null}                     // Selected value (null if undefined)
      onChange={onChange}                       // Callback when user selects
      isSearchable={isSearchable}              // Enable search if true
      placeholder={placeholder}                // Placeholder text
      isClearable={false}                       // Prevent clearing selection
      menuPortalTarget={document.body}          // Renders menu at root for z-index handling
      menuPosition="fixed"                      // Fix menu position relative to viewport
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,                        // Ensure dropdown is above all other elements
        }),
        menu: (base) => ({
          ...base,
          marginTop: 4,                        // Small spacing from input
          borderRadius: 6,                      // Rounded corners
          overflow: "hidden",                  // Prevent content overflow
        }),
      }}
    />
  );
};

export default CustomSelect;

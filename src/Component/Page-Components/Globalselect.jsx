import React from "react";
import Select from "react-select";

const GlobalSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  isMulti = false,
  isDisabled = false,
  styles = {},
}) => {
 // Default styles (can be overridden by passing `styles` prop)
// const defaultStyles = {
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#3371ff",
//     "&:hover": { borderColor: "black" },
//     boxShadow: "none",
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? "#e0e0e0" : "white",
//     "&:hover": {
//       backgroundColor: "#f0f0f0",
//     },
//   }),
// };

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isMulti={isMulti}
      isDisabled={isDisabled}
      // styles={{ ...defaultStyles, ...styles }}
    />
  );
};

export default GlobalSelect;

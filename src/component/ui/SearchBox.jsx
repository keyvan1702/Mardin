import React from "react";
import { LuSearch } from "react-icons/lu";

const SearchBox = ({ value, onChange, placeholder = "جستجو..." }) => (
  <label className="searchbox">
    <LuSearch className="searchboxicon" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  </label>
);

export default SearchBox;

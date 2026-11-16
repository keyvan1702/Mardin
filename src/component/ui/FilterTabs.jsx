import React from "react";
import { tofa } from "../../utils/format";

// تب‌های فیلتر؛ options: [[کلید, برچسب, تعداد؟], ...]
const FilterTabs = ({ value, onChange, options }) => (
  <div className="tabbar" role="tablist">
    {options.map(([key, label, count]) => (
      <button
        key={key}
        type="button"
        role="tab"
        aria-selected={value === key}
        className={`tab ${value === key ? "tabactive" : ""}`}
        onClick={() => onChange(key)}
      >
        {label}
        {count != null && <span className="tabcount">{tofa(count)}</span>}
      </button>
    ))}
  </div>
);

export default FilterTabs;

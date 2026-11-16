import React from "react";

// کلید روشن/خاموش
const Switch = ({ checked, onChange, label, disabled = false }) => (
  <label className={`switch ${disabled ? "switch-disabled" : ""}`}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="switchtrack" />
    {label && <span className="switchlabel">{label}</span>}
  </label>
);

export default Switch;

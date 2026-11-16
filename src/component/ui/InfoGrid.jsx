import React from "react";

// جفت‌های «برچسب: مقدار»؛ items: [[برچسب, مقدار], ...]
const InfoGrid = ({ items }) => (
  <dl className="infogrid">
    {items.map(([label, value]) => (
      <div key={label} className="inforow">
        <dt>{label}</dt>
        <dd>{value ?? "—"}</dd>
      </div>
    ))}
  </dl>
);

export default InfoGrid;

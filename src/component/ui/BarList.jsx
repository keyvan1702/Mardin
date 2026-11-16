import React from "react";
import { tofa } from "../../utils/format";

// نمودار میله‌ای افقی ساده؛ items: [{label, value}]
const BarList = ({ items, unit = "" }) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="barlist">
      {items.map((it, i) => (
        <li key={it.label} className="barrow">
          <span className="barlabel">
            <span className="barrank">{tofa(i + 1)}</span>
            {it.label}
          </span>
          <span className="bartrack">
            <span className="barfill" style={{ width: `${(it.value / max) * 100}%` }} />
          </span>
          <span className="barvalue">
            {tofa(it.value)} {unit}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default BarList;

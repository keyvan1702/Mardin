import React from "react";
import { tofa } from "../../utils/format";

// نوار پیشرفت ظرفیت: «۱۴ از ۲۰»
const Meter = ({ value, max }) => {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="meter">
      <div className="meterbar">
        <span className={`meterfill ${pct >= 100 ? "meterfill-full" : ""}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="metertext">
        {tofa(value)} از {tofa(max)}
      </span>
    </div>
  );
};

export default Meter;

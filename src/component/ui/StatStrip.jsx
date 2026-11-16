import React from "react";
import { tofa } from "../../utils/format";

// ردیف شمارنده‌های کوچک بالای صفحه‌های فهرست
// items: [{ label, value (عدد یا متن), icon, tone: gold|success|danger|info|slate }]
const StatStrip = ({ items }) => (
  <section className="statstrip" aria-label="خلاصه">
    {items.map((it) => {
      const Icon = it.icon;
      return (
        <div key={it.label} className="statchip">
          {Icon && (
            <span className={`statchipicon statchipicon-${it.tone || "slate"}`}>
              <Icon />
            </span>
          )}
          <div className="statchipbody">
            <strong className={`statchipvalue ${typeof it.value === "string" && it.value.length > 12 ? "statchipvalue-sm" : ""}`}>
              {typeof it.value === "number" ? tofa(it.value) : it.value}
            </strong>
            <span className="statchiplabel">{it.label}</span>
          </div>
        </div>
      );
    })}
  </section>
);

export default StatStrip;

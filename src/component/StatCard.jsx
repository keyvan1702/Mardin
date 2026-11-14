import React from "react";
import { tofa } from "../utils/format";

// tone: "gold" یا "slate"؛ مقدار null یعنی هنوز بارگذاری نشده
const StatCard = ({ icon: Icon, label, value, tone = "gold" }) => (
  <div className="statcard">
    <span className={`statcardicon statcardicon-${tone}`}>
      <Icon />
    </span>
    <div className="statcardbody">
      {value == null ? (
        <span className="skeleton skeleton-num" />
      ) : (
        <strong className="statcardvalue">{tofa(value)}</strong>
      )}
      <span className="statcardlabel">{label}</span>
    </div>
  </div>
);

export default StatCard;

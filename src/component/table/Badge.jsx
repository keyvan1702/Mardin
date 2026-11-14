import React from "react";

const Badge = ({ tone = "slate", children }) => (
  <span className={`badge badge-${tone}`}>{children}</span>
);

export default Badge;
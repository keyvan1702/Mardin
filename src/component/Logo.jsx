import React from "react";

// نشان «م» لاتین ماردین؛ با رنگ اصلی برند
const Logo = ({ size = 40 }) => (
  <svg
    width={size}
    height={(size * 34) / 44}
    viewBox="0 0 44 34"
    fill="none"
    aria-hidden="true"
    className="logo"
  >
    <path
      d="M0 34 8.5 4a3 3 0 0 1 5.2-1L22 14.5 30.3 3a3 3 0 0 1 5.2 1L44 34h-9.5l-4.3-15.4-6.4 9a3 3 0 0 1-4.9 0l-6.4-9L9.2 34H0Z"
      fill="var(--primary)"
    />
    <path d="M14 34 22 22l8 12h-5l-3-4.4-3 4.4h-5Z" fill="var(--primary-dark)" />
  </svg>
);

export default Logo;

import React from "react";

// کارت اطلاعاتی با عنوان؛ actions اختیاری (سمت چپ عنوان)
const Panel = ({ title, hint, actions, children, className = "" }) => (
  <section className={`panel ${className}`}>
    {(title || actions) && (
      <header className="panelhead">
        <div>
          {title && <h2>{title}</h2>}
          {hint && <p>{hint}</p>}
        </div>
        {actions && <div className="panelactions">{actions}</div>}
      </header>
    )}
    <div className="panelbody">{children}</div>
  </section>
);

export default Panel;

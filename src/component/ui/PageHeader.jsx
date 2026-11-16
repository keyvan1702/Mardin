import React from "react";

// سربرگ یکسان همه‌ی صفحه‌ها: عنوان + توضیح کوتاه + کنش‌های اصلی (سمت چپ)
const PageHeader = ({ title, subtitle, actions }) => (
  <div className="pagehead">
    <div className="pageheadtext">
      <h1 className="pagetitle">
        <span>{title}</span>
      </h1>
      {subtitle && <p className="pagesub">{subtitle}</p>}
    </div>
    {actions && <div className="pageactions">{actions}</div>}
  </div>
);

export default PageHeader;

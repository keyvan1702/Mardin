import React from "react";
import { findMenuItem } from "../utils/menu";

// صفحه‌ی موقت هر بخش تا وقتی که محتوای واقعی‌اش ساخته شود
const ModulePage = ({ itemKey }) => {
  const item = findMenuItem(itemKey);
  if (!item) return null;
  const Icon = item.icon;

  return (
    <div className="modulepage">
      <h1 className="pagetitle">
        <span>{item.label}</span>
      </h1>
      <div className="emptystate">
        {Icon && (
          <span className="emptystateicon">
            <Icon />
          </span>
        )}
        <h2>این بخش هنوز ساخته نشده</h2>
        <p>
          جدول و فرم‌های «{item.label}» بعد از آماده شدن API در همین صفحه قرار
          می‌گیرند.
        </p>
      </div>
    </div>
  );
};

export default ModulePage;
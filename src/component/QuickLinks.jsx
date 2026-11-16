import React from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { firstPath, visibleMenu } from "../utils/menu";
import usePermissions from "../hooks/usePermissions";

// کاشی‌های میان‌بر پایین داشبورد؛ فقط بخش‌هایی که نقش کاربر به آن‌ها دسترسی دارد
const QuickLinks = () => {
  const { role } = usePermissions();
  const items = visibleMenu(role).filter((i) => i.quick);

  return (
    <section className="quicklinks" aria-label="دسترسی سریع">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.key} to={firstPath(item)} className="quickcard">
            <Icon className="quickcardicon" />
            <span className="quickcardlabel">{item.label}</span>
            <span className="quickcardgo">
              <LuArrowLeft />
            </span>
            <span className="quickcardcorner" aria-hidden="true" />
          </Link>
        );
      })}
    </section>
  );
};

export default QuickLinks;

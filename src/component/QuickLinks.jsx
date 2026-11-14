import React from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { MENU_ITEMS, firstPath } from "../utils/menu";
import { can } from "../utils/permissions";
import usePermissions from "../hooks/usePermissions";

// ردیف کارت‌های میان‌بر پایین داشبورد
const QuickLinks = () => {
  const { role } = usePermissions();
  const items = MENU_ITEMS.filter((i) => i.quick && (!i.perm || can(role, i.perm)));

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

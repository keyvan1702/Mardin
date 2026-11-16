import React from "react";
import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";
import usePermissions from "../../hooks/usePermissions";

// دکمه‌ی اصلی «افزودن …»؛ فقط برای نقش‌های دارای دسترسی «کامل» به آن بخش
const AddAction = ({ module, to, children }) => {
  const { edit } = usePermissions();
  if (module && !edit(module)) return null;
  return to ? (
    <Link to={to} className="btnprimary">
      <LuPlus /> {children}
    </Link>
  ) : (
    <button type="button" className="btnprimary">
      <LuPlus /> {children}
    </button>
  );
};

export default AddAction;

import React from "react";
import { Link } from "react-router-dom";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import usePermissions from "../../hooks/usePermissions";

// دکمه‌های ویرایش/حذف هر ردیف (فعلاً استاتیک)
// module: اگر بدهید فقط برای نقش‌هایی که دسترسی «کامل» دارند دیده می‌شود
// editTo: اگر بدهید ویرایش یک لینک است
const RowActions = ({ label = "", module, editTo, noDelete = false }) => {
  const { edit } = usePermissions();
  if (module && !edit(module)) return null;

  const editProps = { className: "btnicon", title: "ویرایش", "aria-label": `ویرایش ${label}` };
  return (
    <div className="table-actions">
      {editTo ? (
        <Link to={editTo} {...editProps}>
          <LuPencil />
        </Link>
      ) : (
        <button type="button" {...editProps}>
          <LuPencil />
        </button>
      )}
      {!noDelete && (
        <button type="button" className="btnicon btnicon-danger" title="حذف" aria-label={`حذف ${label}`}>
          <LuTrash2 />
        </button>
      )}
    </div>
  );
};

export default RowActions;

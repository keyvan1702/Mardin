import React from "react";
import { Link } from "react-router-dom";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import usePermissions from "../../hooks/usePermissions";

/**
 * دکمه‌های ویرایش/حذف هر ردیف.
 * module: فقط برای نقش‌هایی که دسترسی «کامل» دارند دیده می‌شود
 * editTo: ویرایش به‌صورت لینک | onEdit: ویرایش با تابع | onDelete: حذف با تابع
 */
const RowActions = ({ label = "", module, editTo, onEdit, onDelete }) => {
  const { edit } = usePermissions();
  if (module && !edit(module)) return null;

  const props = { className: "btnicon", title: "ویرایش", "aria-label": `ویرایش ${label}` };
  return (
    <div className="table-actions">
      {editTo ? (
        <Link to={editTo} {...props}>
          <LuPencil />
        </Link>
      ) : (
        onEdit && (
          <button type="button" onClick={onEdit} {...props}>
            <LuPencil />
          </button>
        )
      )}
      {onDelete && (
        <button type="button" className="btnicon btnicon-danger" title="حذف" aria-label={`حذف ${label}`} onClick={onDelete}>
          <LuTrash2 />
        </button>
      )}
    </div>
  );
};

export default RowActions;

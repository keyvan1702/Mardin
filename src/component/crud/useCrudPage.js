import { useState } from "react";
import { useToast } from "../ToastContext";
import { apiErrorMessage } from "../../services/apiService";

/**
 * وضعیت «پنجره‌ی افزودن/ویرایش» و «تأیید حذف» یک صفحه‌ی فهرست.
 * api: { create, update, remove } از services/actions.js
 */
export default function useCrudPage(api, label) {
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null بسته | {} جدید | ردیف
  const [deleting, setDeleting] = useState(null);

  const save = (values) => {
    if (editing?.id) {
      api.update(editing.id, values);
      toast.success(`${label} ویرایش شد`);
    } else {
      api.create(values);
      toast.success(`${label} اضافه شد`);
    }
    setEditing(null);
  };

  const remove = () => {
    try {
      api.remove(deleting.id);
      toast.success(`${label} حذف شد`);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
    setDeleting(null);
  };

  return { editing, setEditing, deleting, setDeleting, save, remove };
}

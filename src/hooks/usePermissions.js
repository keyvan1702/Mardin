import { useMemo } from "react";
import { getStoredUser } from "../component/Login";
import { ROLE_LABELS, can, canAccess, canEdit, normalizeRole } from "../utils/permissions";

// نقش و دسترسی‌های کاربر واردشده
export default function usePermissions() {
  const user = getStoredUser();
  const role = normalizeRole(user?.role);
  return useMemo(
    () => ({
      userId: user?.id ?? null,
      role,
      roleLabel: ROLE_LABELS[role],
      canWrite: can(role, "write"),
      canManageUsers: can(role, "manageUsers"),
      access: (module) => canAccess(role, module), // آیا بخش را می‌بیند؟
      edit: (module) => canEdit(role, module), // آیا می‌تواند تغییر دهد؟
    }),
    [user?.id, role],
  );
}

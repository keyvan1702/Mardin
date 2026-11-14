import { useMemo } from "react";
import { getStoredUser } from "../component/Login";
import { ROLE_LABELS, can, normalizeRole } from "../utils/permissions";

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
    }),
    [user?.id, role],
  );
}

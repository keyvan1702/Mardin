import { getState } from "../services/store";
import { DEFAULT_ACCESS } from "./access";

// نقش‌ها طبق پیوست قرارداد: مدیر، اپراتور، حسابدار، تکنسین
export const ROLES = {
  MANAGER: "manager",
  OPERATOR: "operator",
  ACCOUNTANT: "accountant",
  TECHNICIAN: "technician",
};

export const ROLE_LABELS = {
  manager: "مدیر",
  operator: "اپراتور",
  accountant: "حسابدار",
  technician: "تکنسین",
};

// نقش‌های قدیمی که ممکن است در نشست ذخیره‌شده باشند
const LEGACY = { "super-admin": "manager", admin: "operator", viewer: "technician" };

// نقش نامعتبر یا خالی = کمترین دسترسی
export const normalizeRole = (role) =>
  ROLE_LABELS[role] ? role : LEGACY[role] || ROLES.TECHNICIAN;

export const ACCESS_LABELS = { full: "کامل", view: "مشاهده", none: "بدون دسترسی" };
export const ACCESS_ORDER = ["none", "view", "full"];

export { MODULES, DEFAULT_ACCESS } from "./access";

// ماتریس دسترسی از حافظه‌ی پنل خوانده می‌شود؛ تغییر آن در «نقش‌ها و دسترسی‌ها» فوراً اثر می‌کند
export const accessLevel = (role, module) =>
  getState().access?.[normalizeRole(role)]?.[module] ?? DEFAULT_ACCESS[normalizeRole(role)]?.[module] ?? "none";

export const canAccess = (role, module) => !module || accessLevel(role, module) !== "none";
export const canEdit = (role, module) => accessLevel(role, module) === "full";

// سازگاری با کدهای قبلی (write / manageUsers)
export const can = (role, permission) => {
  const r = normalizeRole(role);
  if (permission === "manageUsers") return r === ROLES.MANAGER;
  if (permission === "write") return r === ROLES.MANAGER || r === ROLES.OPERATOR;
  return true;
};

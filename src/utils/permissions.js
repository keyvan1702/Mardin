// نقش‌ها: viewer / admin / super-admin (هم‌نام با نقش‌های پروژه‌ی قبلی تا بعداً با API یکی بماند)
export const ROLES = {
  VIEWER: "viewer",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
};

export const ROLE_LABELS = {
  viewer: "مشاهده‌گر",
  admin: "اوپراتور",
  "super-admin": "مدیر کل",
};

const RANK = { viewer: 1, admin: 2, "super-admin": 3 };

// نقش نامعتبر یا خالی = کمترین دسترسی
export const normalizeRole = (role) => (RANK[role] ? role : ROLES.VIEWER);

export const hasRole = (role, min) => RANK[normalizeRole(role)] >= RANK[min];

// حداقل نقش لازم برای هر دسترسی. جدول دسترسی‌ها فقط همین‌جا تعریف می‌شود.
export const PERMISSIONS = {
  view: ROLES.VIEWER, // دیدن بخش‌ها
  write: ROLES.ADMIN, // افزودن/ویرایش/حذف و تنظیمات
  manageUsers: ROLES.SUPER_ADMIN, // مدیریت کاربران و کارکنان
};

export const can = (role, permission) =>
  hasRole(role, PERMISSIONS[permission] || ROLES.SUPER_ADMIN);

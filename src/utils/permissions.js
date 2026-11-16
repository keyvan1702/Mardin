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

// بخش‌های پنل؛ کلید هر بخش در utils/menu.js هم استفاده شده است
export const MODULES = [
  { key: "dashboard", label: "داشبورد آماری" },
  { key: "customers", label: "مدیریت مشتریان" },
  { key: "staff", label: "مدیریت کارکنان" },
  { key: "installers", label: "مدیریت نصابان" },
  { key: "roles", label: "نقش‌ها و سطح دسترسی" },
  { key: "missions", label: "درخواست‌های خدمات (تیکت)" },
  { key: "products", label: "محصولات و دسته‌بندی‌ها" },
  { key: "qr", label: "QR کد و پرونده محصول" },
  { key: "warranty", label: "گارانتی و سرویس دوره‌ای" },
  { key: "services", label: "مدیریت خدمات" },
  { key: "courses", label: "دوره‌ها، ورکشاپ‌ها و ثبت‌نام‌ها" },
  { key: "content", label: "محتوای وبسایت" },
  { key: "invoices", label: "فاکتور و پرداخت" },
  { key: "reports", label: "گزارش‌ها" },
  { key: "activity", label: "لاگ فعالیت‌ها" },
  { key: "notifications", label: "اعلان‌ها و پیامک" },
  { key: "settings", label: "تنظیمات سایت" },
  { key: "profile", label: "پروفایل من" },
];

const all = (level) => Object.fromEntries(MODULES.map((m) => [m.key, level]));

// سطح دسترسی پیش‌فرض هر نقش به هر بخش (full | view | none)
export const DEFAULT_ACCESS = {
  manager: all("full"),
  operator: {
    ...all("none"),
    dashboard: "full", customers: "full", staff: "view", installers: "full",
    missions: "full", products: "view", qr: "full", warranty: "full", services: "view",
    courses: "full", content: "full", invoices: "view", reports: "view",
    notifications: "view", profile: "full",
  },
  accountant: {
    ...all("none"),
    dashboard: "view", customers: "view", missions: "view", products: "view",
    warranty: "view", services: "view", invoices: "full", reports: "view", profile: "full",
  },
  technician: {
    ...all("none"),
    dashboard: "view", missions: "view", products: "view", qr: "view",
    warranty: "view", services: "view", profile: "full",
  },
};

export const accessLevel = (role, module) =>
  DEFAULT_ACCESS[normalizeRole(role)]?.[module] ?? "none";

export const canAccess = (role, module) => !module || accessLevel(role, module) !== "none";
export const canEdit = (role, module) => accessLevel(role, module) === "full";

// سازگاری با کدهای قبلی (write / manageUsers)
export const can = (role, permission) => {
  const r = normalizeRole(role);
  if (permission === "manageUsers") return r === ROLES.MANAGER;
  if (permission === "write") return r === ROLES.MANAGER || r === ROLES.OPERATOR;
  return true;
};

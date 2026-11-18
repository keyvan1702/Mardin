import {
  LuHouse, LuUsers, LuBriefcase, LuSend, LuPackage, LuFileText, LuGraduationCap, LuHeadphones,
  LuSettings, LuList, LuTags, LuNewspaper, LuImage, LuSlidersHorizontal, LuUserCog, LuClipboardList,
  LuFileUser, LuWrench, LuHistory, LuUserRound, LuQrCode, LuBadgeCheck, LuReceipt, LuFilePlus,
  LuTrendingUp, LuScrollText, LuBell, LuShieldCheck, LuBookOpen, LuTriangleAlert, LuUserPlus, LuLayoutTemplate,
} from "react-icons/lu";
import { canAccess, canEdit } from "./permissions";

/**
 * تنها منبع تعریف بخش‌ها (منو، میان‌بر داشبورد، مسیرها).
 * module: بخش دسترسی (utils/permissions.js)؛ زیرمنوها اگر module نداشته باشند از گروه ارث می‌برند.
 * quick: در ردیف میان‌بر داشبورد باشد.
 * ساختار بر اساس «پنل مدیریت» در پیوست شماره ۱ قرارداد است.
 */
export const MENU_ITEMS = [
  { key: "dashboard", label: "داشبورد", icon: LuHouse, path: "/", end: true, module: "dashboard" },

  {
    key: "customers", label: "مدیریت مشتریان", icon: LuUsers, path: "/customers", module: "customers", quick: true,
    children: [
      { key: "customers-list", label: "فهرست مشتریان", path: "/customers", end: true, icon: LuList },
      { key: "customers-new", label: "افزودن مشتری", path: "/customers/new", icon: LuUserPlus, needsEdit: true },
    ],
  },

  {
    key: "staff", label: "کارکنان و نصابان", icon: LuBriefcase, path: "/staff",
    children: [
      { key: "staff-list", label: "فهرست کارکنان", path: "/staff", end: true, icon: LuUserRound, module: "staff" },
      { key: "staff-installers", label: "نصاب‌ها", path: "/staff/installers", icon: LuWrench, module: "installers" },
      { key: "staff-roles", label: "نقش‌ها و دسترسی‌ها", path: "/staff/roles", icon: LuShieldCheck, module: "roles" },
    ],
  },

  {
    key: "missions", label: "درخواست‌های خدمات", icon: LuSend, path: "/missions", module: "missions", quick: true,
    children: [
      { key: "missions-active", label: "فهرست درخواست‌ها", path: "/missions", end: true, icon: LuClipboardList },
      { key: "missions-new", label: "ثبت درخواست", path: "/missions/new", icon: LuFilePlus, needsEdit: true },
      { key: "missions-assign", label: "تخصیص به تکنسین", path: "/missions/assign", icon: LuUserRound, needsEdit: true },
      { key: "missions-history", label: "تاریخچه", path: "/missions/history", icon: LuHistory },
    ],
  },

  {
    key: "products", label: "محصولات و QR", icon: LuPackage, path: "/products", quick: true,
    children: [
      { key: "products-list", label: "فهرست محصولات", path: "/products", end: true, icon: LuList, module: "products" },
      { key: "products-categories", label: "دسته‌بندی‌ها", path: "/products/categories", icon: LuTags, module: "products" },
      { key: "products-qr", label: "QR کد و پرونده محصول", path: "/products/qr", icon: LuQrCode, module: "qr" },
      { key: "products-warranties", label: "گارانتی و سرویس", path: "/products/warranties", icon: LuBadgeCheck, module: "warranty" },
    ],
  },

  { key: "services", label: "مدیریت خدمات", icon: LuHeadphones, path: "/services", module: "services" },

  {
    key: "registrations", label: "دوره‌ها و ورکشاپ‌ها", icon: LuGraduationCap, path: "/registrations", module: "courses",
    children: [
      { key: "registrations-workshops", label: "ورکشاپ‌ها", path: "/registrations/workshops", end: true, icon: LuGraduationCap },
      { key: "registrations-workshop-members", label: "ثبت‌نام و پیش‌ثبت‌نام", path: "/registrations/workshops/registrations", icon: LuUsers },
      { key: "registrations-resumes", label: "بررسی رزومه‌ها", path: "/registrations/resumes", icon: LuFileUser },
    ],
  },

  {
    key: "site-content", label: "محتوای وبسایت", icon: LuFileText, path: "/site-content", module: "content", quick: true,
    children: [
      { key: "site-pages", label: "صفحات", path: "/site-content/pages", icon: LuLayoutTemplate },
      { key: "site-articles", label: "مقالات", path: "/site-content/articles", icon: LuBookOpen },
      { key: "site-news", label: "اخبار", path: "/site-content/news", icon: LuNewspaper },
      { key: "site-slider", label: "اسلایدر", path: "/site-content/slider", icon: LuImage },
    ],
  },

  {
    key: "finance", label: "فاکتور و پرداخت", icon: LuReceipt, path: "/finance", module: "invoices", quick: true,
    children: [
      { key: "finance-list", label: "فاکتورها", path: "/finance", end: true, icon: LuReceipt },
      { key: "finance-new", label: "ثبت فاکتور", path: "/finance/new", icon: LuFilePlus, needsEdit: true },
    ],
  },

  {
    key: "reports", label: "گزارش‌ها", icon: LuTrendingUp, path: "/reports", module: "reports", quick: true,
    children: [
      { key: "reports-technicians", label: "عملکرد تکنسین‌ها", path: "/reports", end: true, icon: LuWrench },
      { key: "reports-faults", label: "خرابی‌ها و خدمات", path: "/reports/faults", icon: LuTriangleAlert },
      { key: "reports-activity", label: "لاگ فعالیت‌ها", path: "/reports/activity", icon: LuScrollText, module: "activity" },
    ],
  },

  {
    key: "settings", label: "تنظیمات", icon: LuSettings, path: "/settings", bottom: true,
    children: [
      { key: "settings-general", label: "عمومی", path: "/settings", end: true, icon: LuSlidersHorizontal, module: "settings" },
      { key: "settings-notifications", label: "اعلان‌ها و پیامک", path: "/settings/notifications", icon: LuBell, module: "notifications" },
      { key: "settings-profile", label: "پروفایل من", path: "/settings/profile", icon: LuUserCog, module: "profile" },
    ],
  },
];

// بخش دسترسیِ یک برگ: مال خودش یا مال گروه
const moduleOf = (leaf, parent) => leaf.module ?? parent?.module;

// مسیر اولین صفحه‌ی یک آیتم؛ برای گروه‌ها همان اولین زیرمنو
export const firstPath = (item) => item.children?.[0]?.path ?? item.path;

// منوی قابل‌نمایش برای یک نقش (بدون گروه‌های خالی)
export const visibleMenu = (role) =>
  MENU_ITEMS.map((item) => {
    if (!item.children) return canAccess(role, item.module) ? item : null;
    const children = item.children.filter(
      (c) => canAccess(role, moduleOf(c, item)) && (!c.needsEdit || canEdit(role, moduleOf(c, item))),
    );
    return children.length ? { ...item, children } : null;
  }).filter(Boolean);

// همه‌ی برگ‌ها به‌همراه گروهشان (برای جستجوی بالای صفحه)
export const MENU_LEAVES = MENU_ITEMS.flatMap((item) =>
  item.children ? item.children.map((c) => ({ ...c, parent: item, module: moduleOf(c, item) })) : [item],
);

export const findMenuItem = (key) => {
  for (const item of MENU_ITEMS) {
    if (item.key === key) return item;
    const child = item.children?.find((c) => c.key === key);
    if (child) return { ...child, parent: item };
  }
  return null;
};

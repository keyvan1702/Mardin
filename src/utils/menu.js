import {
  LuHouse,
  LuUsers,
  LuBriefcase,
  LuSend,
  LuPackage,
  LuFileText,
  LuGraduationCap,
  LuHeadphones,
  LuSettings,
  LuList,
  LuTags,
  LuImage,
  LuNewspaper,
  LuSlidersHorizontal,
  LuShieldCheck,
  LuUserCog,
  LuClipboardList,
  LuFileUser,
  LuWrench,
  LuHistory,
  LuUserRound,
  LuPhone,
} from "react-icons/lu";

export const MENU_ITEMS = [
  { key: "dashboard", label: "داشبورد", icon: LuHouse, path: "/", end: true },

  {
    key: "customers",
    label: "مدیریت مشتریان",
    icon: LuUsers,
    path: "/customers",
    perm: "manageUsers",
    quick: true,
    children: [
      { key: "customers-list", label: "فهرست مشتریان", path: "/customers", end: true },
      { key: "customers-new", label: "افزودن مشتری", path: "/customers/new" },
    ],
  },

  {
    key: "staff",
    label: "مدیریت کارکنان",
    icon: LuBriefcase,
    path: "/staff",
    perm: "manageUsers",
    quick: true,
    children: [
      { key: "staff-list", label: "فهرست کارکنان", path: "/staff", end: true },
      { key: "staff-installers", label: "نصاب‌ها", path: "/staff/installers" },
    ],
  },

  {
    key: "missions",
    label: "مدیریت ماموریت‌ها",
    icon: LuSend,
    path: "/missions",
    quick: true,
    children: [
      { key: "missions-active", label: "درخواست‌های فعال", path: "/missions", end: true, icon: LuWrench },
      { key: "missions-assign", label: "تخصیص به نصاب", path: "/missions/assign", icon: LuUserRound },
      { key: "missions-history", label: "تاریخچه ماموریت‌ها", path: "/missions/history", icon: LuHistory },
    ],
  },

  {
    key: "registrations",
    label: "مدیریت ثبت‌نام‌ها",
    icon: LuClipboardList,
    path: "/registrations",
    quick: true,
    children: [
      { key: "registrations-workshops", label: "ورکشاپ‌ها", path: "/registrations/workshops", end: true, icon: LuGraduationCap },
      { key: "registrations-workshop-members", label: "ثبت‌نام‌شدگان ورکشاپ", path: "/registrations/workshops/registrations", icon: LuUsers },
      { key: "registrations-resumes", label: "بررسی رزومه‌ها", path: "/registrations/resumes", icon: LuFileUser },
    ],
  },

  {
    key: "products",
    label: "مدیریت محصولات",
    icon: LuPackage,
    path: "/products",
    children: [
      { key: "products-list", label: "فهرست محصولات", path: "/products", end: true, icon: LuList },
      { key: "products-categories", label: "دسته‌بندی‌ها", path: "/products/categories", icon: LuTags },
    ],
  },

  {
    key: "site-content",
    label: "مدیریت بخش عمومی سایت",
    icon: LuFileText,
    path: "/site-content",
    quick: true,
    children: [
      { key: "site-slider", label: "اسلایدر", path: "/site-content/slider", icon: LuImage },
      { key: "site-news", label: "اخبار", path: "/site-content/news", icon: LuNewspaper },
    ],
  },

  { key: "services", label: "مدیریت خدمات", icon: LuHeadphones, path: "/services", quick: true },

  {
    key: "settings",
    label: "تنظیمات",
    icon: LuSettings,
    path: "/settings",
    bottom: true,
    children: [
      { key: "settings-general", label: "عمومی", path: "/settings", end: true, perm: "write", icon: LuSlidersHorizontal },
      { key: "settings-access", label: "دسترسی‌ها", path: "/settings/access", perm: "manageUsers", icon: LuShieldCheck },
      { key: "settings-profile", label: "پروفایل من", path: "/settings/profile", icon: LuUserCog },
    ],
  },
];

// مسیر اولین صفحه‌ی یک آیتم؛ برای گروه‌ها همان اولین زیرمنو
export const firstPath = (item) => item.children?.[0]?.path ?? item.path;

export const findMenuItem = (key) => {
  for (const item of MENU_ITEMS) {
    if (item.key === key) return item;
    const child = item.children?.find((c) => c.key === key);
    if (child) return { ...child, parent: item };
  }
  return null;
};
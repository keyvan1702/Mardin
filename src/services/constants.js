// ثابت‌های پنل (مراحل، اولویت‌ها، برچسب‌ها)؛ داده‌ی قابل‌ویرایش در services/store.js است.

// مراحل هر درخواست از ثبت تا بسته‌شدن
export const MISSION_STAGES = [
  { key: "registered", label: "ثبت درخواست" },
  { key: "review", label: "بررسی اپراتور" },
  { key: "assigned", label: "ارجاع به تکنسین" },
  { key: "inprogress", label: "در حال انجام" },
  { key: "finished", label: "پایان کار" },
  { key: "closed", label: "تأیید مشتری" },
];

export const PRIORITY = {
  low: { label: "کم", tone: "slate" },
  normal: { label: "عادی", tone: "info" },
  high: { label: "بالا", tone: "gold" },
  urgent: { label: "فوری", tone: "danger" },
};

// وضعیت پاسخ تکنسین/درخواست
export const MISSION_STATUS = {
  pending: { label: "بدون تکنسین", tone: "gold" },
  assigned: { label: "منتظر پاسخ تکنسین", tone: "info" },
  accepted: { label: "پذیرفته‌شده", tone: "success" },
  rejected: { label: "ردشده", tone: "danger" },
  done: { label: "تمام‌شده", tone: "slate" },
  cancelled: { label: "لغوشده", tone: "slate" },
};

export const FAULTS = {
  motor: "موتور صدا می‌دهد یا بالا نمی‌رود",
  remote: "ریموت کنترل پاسخ نمی‌دهد",
  rail: "کرکره روی ریل گیر می‌کند",
  power: "قطع ناگهانی برق در حین کار",
  skew: "کرکره کج بسته می‌شود",
  other: "سایر",
};

// مواردی که مشمول گارانتی نیستند (نمایش برای اطلاع مشتری)
export const WARRANTY_EXCLUSIONS = [
  "آسیب فیزیکی ناشی از ضربه یا برخورد",
  "نوسان یا قطعی برق و اتصال به برق نامناسب",
  "دستکاری یا تعمیر توسط افراد غیرمجاز",
  "عدم انجام سرویس دوره‌ای در زمان مقرر",
];

// پایه‌ی نمایشی آمار داشبورد (سوابق قبل از این پنل)؛ با اتصال API حذف می‌شود
export const STATS_BASE = { requests: 3414, customers: 1245, technicians: 82 };

// پایه‌ی نمایشی گزارش‌ها
export const REPORT_BASE = {
  faults: { motor: 31, remote: 26, rail: 18, power: 14, skew: 11 },
  services: { "سرویس دوره‌ای": 60, "تعمیر موتور کرکره": 38, "نصب کرکره برقی": 30, "نصب ریموت کنترل": 17 },
  avgHours: { "رضا صادقی": 2.4, "علی موسوی": 2.9, "سعید کاظمی": 2.1, "حمید نوری": 3.8 },
};

import { daysFromNow } from "../utils/warranty";

/* ─────────────── کاربران پنل (ورود نمایشی) ─────────────── */
export const MOCK_USERS = [
  { id: 1, username: "admin", password: "1234", name: "علی کیوانلو", role: "manager" },
  { id: 2, username: "operator", password: "1234", name: "مریم احمدی", role: "operator" },
  { id: 3, username: "accountant", password: "1234", name: "لیلا بهرامی", role: "accountant" },
  { id: 4, username: "tech", password: "1234", name: "رضا صادقی", role: "technician" },
];

/* ─────────────── داشبورد ─────────────── */
// آمار درخواست‌ها، تکنسین‌ها و مشتریان (پیوست، پنل مدیریت ← داشبورد)
export const MOCK_STATS = {
  openRequests: 47,
  requests: 3420,
  customers: 1250,
  technicians: 86,
};

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// تعداد درخواست ثبت‌شده در هر روز
export function buildSiteStats(days) {
  const rand = mulberry32(days * 7919);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from({ length: days }, (_, i) => {
    const progress = days === 1 ? 1 : i / (days - 1);
    const trend = 9 + 17 * Math.pow(progress, 1.4);
    const wave = Math.sin(i * 0.9) * 3.2 + (rand() - 0.5) * 4;
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    return {
      date: date.toISOString(),
      value: Math.min(38, Math.max(2, Math.round(trend + wave))),
    };
  });
}

/* ─────────────── مشتریان ─────────────── */
export const MOCK_CUSTOMERS = [
  { id: 1, name: "مهدی رضایی", phone: "09121234567", email: "mahdi@example.com", city: "تهران", address: "خیابان ولیعصر، پلاک ۱۲", status: "active", joinedAt: "1403/10/22" },
  { id: 2, name: "زهرا کریمی", phone: "09351112233", email: "zahra@example.com", city: "اصفهان", address: "خیابان چهارباغ", status: "active", joinedAt: "1403/11/14" },
  { id: 3, name: "حسین نادری", phone: "09189998877", email: "hossein@example.com", city: "مشهد", address: "بلوار وکیل‌آباد", status: "inactive", joinedAt: "1403/08/30" },
  { id: 4, name: "نگین شریفی", phone: "09127776655", email: "negin@example.com", city: "شیراز", address: "خیابان زند", status: "active", joinedAt: "1403/12/17" },
  { id: 5, name: "امیر قاسمی", phone: "09364445566", email: "amir@example.com", city: "تبریز", address: "خیابان امام", status: "blocked", joinedAt: "1403/06/25" },
];

/* ─────────────── کارکنان (نقش‌ها: مدیر، اپراتور، حسابدار، تکنسین) ─────────────── */
export const MOCK_STAFF = [
  { id: 1, name: "علی کیوانلو", title: "مدیر کل", roleKey: "manager", phone: "09121110001", city: "تهران", active: true },
  { id: 2, name: "مریم احمدی", title: "اپراتور پشتیبانی", roleKey: "operator", phone: "09354445566", city: "تهران", active: true },
  { id: 3, name: "لیلا بهرامی", title: "حسابدار", roleKey: "accountant", phone: "09121110006", city: "تهران", active: true },
  { id: 4, name: "رضا صادقی", title: "نصاب ارشد", roleKey: "technician", phone: "09121112233", city: "تهران", active: true },
  { id: 5, name: "کاظم رحیمی", title: "نصاب", roleKey: "technician", phone: "09187778899", city: "کرج", active: false },
];

export const MOCK_INSTALLERS = [
  { id: 1, name: "رضا صادقی", phone: "09121112233", city: "تهران", rating: 4.8, doneJobs: 132, online: true, activeMissions: 2 },
  { id: 2, name: "علی موسوی", phone: "09123334455", city: "تهران", rating: 4.6, doneJobs: 87, online: true, activeMissions: 1 },
  { id: 3, name: "سعید کاظمی", phone: "09356667788", city: "کرج", rating: 4.9, doneJobs: 210, online: false, activeMissions: 0 },
  { id: 4, name: "حمید نوری", phone: "09199998877", city: "تهران", rating: 4.3, doneJobs: 45, online: true, activeMissions: 3 },
];

/* ─────────────── درخواست‌های خدمات (تیکت) ─────────────── */
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

// status: pending → جستجوی نصاب | accepted → پذیرفته‌شده | rejected → ردشده | done → تمام‌شده
export const MOCK_MISSIONS = [
  {
    id: 101, tracking: "MR-1404-0101", priority: "normal", stage: "inprogress",
    customer: "مهدی رضایی", customerPhone: "09121234567", city: "تهران", address: "ولیعصر، پلاک ۱۲",
    service: "نصب کرکره برقی", description: "کرکره ۳ متری، موتور جدید نصب شود.", price: 3500000,
    createdAt: "1404/02/12 - 10:30", status: "accepted", installer: "رضا صادقی", installerPhone: "09121112233",
    respondedAt: "1404/02/12 - 10:45",
    events: [
      { at: "1404/02/12 - 10:30", text: "درخواست توسط مشتری ثبت شد" },
      { at: "1404/02/12 - 10:38", text: "اپراتور درخواست را بررسی و به رضا صادقی ارجاع داد" },
      { at: "1404/02/12 - 10:45", text: "تکنسین ماموریت را پذیرفت" },
      { at: "1404/02/12 - 12:10", text: "تکنسین به محل رسید و کار آغاز شد" },
    ],
  },
  {
    id: 102, tracking: "MR-1404-0102", priority: "high", stage: "registered",
    customer: "زهرا کریمی", customerPhone: "09351112233", city: "اصفهان", address: "چهارباغ، کوچه ۵",
    service: "تعمیر موتور کرکره", description: "موتور صدا می‌دهد و بالا نمی‌رود.", price: 850000,
    createdAt: "1404/02/13 - 09:15", status: "pending", installer: null, installerPhone: null, respondedAt: null,
    events: [{ at: "1404/02/13 - 09:15", text: "درخواست توسط مشتری ثبت شد" }],
  },
  {
    id: 103, tracking: "MR-1404-0103", priority: "normal", stage: "review",
    customer: "نگین شریفی", customerPhone: "09127776655", city: "شیراز", address: "خیابان زند، پلاک ۴۲",
    service: "نصب ریموت کنترل", description: "دو ریموت جدید برای کرکره پارکینگ.", price: 450000,
    createdAt: "1404/02/13 - 14:00", status: "rejected", installer: "سعید کاظمی", installerPhone: "09356667788",
    respondedAt: "1404/02/13 - 14:20", rejectReason: "خارج از محدوده سرویس",
    events: [
      { at: "1404/02/13 - 14:00", text: "درخواست توسط مشتری ثبت شد" },
      { at: "1404/02/13 - 14:08", text: "اپراتور درخواست را به سعید کاظمی ارجاع داد" },
      { at: "1404/02/13 - 14:20", text: "تکنسین ماموریت را رد کرد: خارج از محدوده سرویس" },
    ],
  },
  {
    id: 104, tracking: "MR-1404-0104", priority: "low", stage: "closed",
    customer: "حسین نادری", customerPhone: "09189998877", city: "مشهد", address: "وکیل‌آباد، بلوار ۱۰",
    service: "سرویس دوره‌ای کرکره", description: "روغن‌کاری و بررسی عملکرد.", price: 300000,
    createdAt: "1404/02/10 - 16:00", status: "done", installer: "علی موسوی", installerPhone: "09123334455",
    respondedAt: "1404/02/10 - 16:30", rating: 5, feedback: "سریع و حرفه‌ای انجام شد.",
    events: [
      { at: "1404/02/10 - 16:00", text: "درخواست توسط مشتری ثبت شد" },
      { at: "1404/02/10 - 16:10", text: "اپراتور درخواست را به علی موسوی ارجاع داد" },
      { at: "1404/02/10 - 16:30", text: "تکنسین ماموریت را پذیرفت" },
      { at: "1404/02/11 - 11:00", text: "تکنسین گزارش کار و پایان کار را ثبت کرد" },
      { at: "1404/02/11 - 18:20", text: "مشتری پایان کار را تأیید و نظرسنجی ثبت کرد" },
    ],
  },
  {
    id: 105, tracking: "MR-1404-0105", priority: "urgent", stage: "registered",
    customer: "مهدی رضایی", customerPhone: "09121234567", city: "تهران", address: "ولیعصر، پلاک ۱۲",
    service: "تعمیر ریل کرکره", description: "کرکره وسط مسیر گیر کرده و باز نمی‌شود.", price: 1200000,
    createdAt: "1404/02/14 - 08:05", status: "pending", installer: null, installerPhone: null, respondedAt: null,
    events: [{ at: "1404/02/14 - 08:05", text: "درخواست توسط مشتری با اولویت فوری ثبت شد" }],
  },
  {
    id: 106, tracking: "MR-1404-0106", priority: "normal", stage: "finished",
    customer: "نگین شریفی", customerPhone: "09127776655", city: "شیراز", address: "خیابان زند، پلاک ۴۲",
    service: "سرویس دوره‌ای کرکره", description: "سرویس شش‌ماهه‌ی کرکره پارکینگ.", price: 300000,
    createdAt: "1404/02/11 - 09:00", status: "accepted", installer: "علی موسوی", installerPhone: "09123334455",
    respondedAt: "1404/02/11 - 09:20",
    events: [
      { at: "1404/02/11 - 09:00", text: "درخواست توسط مشتری ثبت شد" },
      { at: "1404/02/11 - 09:12", text: "اپراتور درخواست را به علی موسوی ارجاع داد" },
      { at: "1404/02/11 - 09:20", text: "تکنسین ماموریت را پذیرفت" },
      { at: "1404/02/12 - 15:40", text: "تکنسین پایان کار را ثبت کرد؛ منتظر تأیید مشتری" },
    ],
  },
];

/* ─────────────── ورکشاپ‌ها و ثبت‌نام‌ها ─────────────── */
export const MOCK_WORKSHOPS = [
  { id: 1, title: "ورکشاپ نصب و راه‌اندازی کرکره برقی", instructor: "رضا صادقی", date: "1404/02/15", capacity: 30, enrolled: 22, status: "open", location: "تهران - سالن همایش" },
  { id: 2, title: "ورکشاپ عیب‌یابی موتور و ریموت", instructor: "سعید کاظمی", date: "1404/03/02", capacity: 20, enrolled: 20, status: "full", location: "آنلاین" },
  { id: 3, title: "ورکشاپ ایمنی و نگهداری درب‌های برقی", instructor: "علی موسوی", date: "1404/03/20", capacity: 25, enrolled: 8, status: "open", location: "اصفهان" },
  { id: 4, title: "ورکشاپ نصب سایبان برقی", instructor: "حمید نوری", date: "1404/01/10", capacity: 30, enrolled: 30, status: "done", location: "مشهد" },
];

// status: confirmed | prereg (پیش‌ثبت‌نام) | pending | canceled
export const MOCK_REGISTRATIONS = [
  { id: 1, customer: "مهدی رضایی", phone: "09121234567", workshop: "نصب و راه‌اندازی کرکره برقی", date: "1404/02/01", status: "confirmed" },
  { id: 2, customer: "زهرا کریمی", phone: "09351112233", workshop: "عیب‌یابی موتور و ریموت", date: "1404/02/10", status: "confirmed" },
  { id: 3, customer: "نگین شریفی", phone: "09127776655", workshop: "ایمنی و نگهداری درب‌های برقی", date: "1404/02/25", status: "pending" },
  { id: 4, customer: "حسین نادری", phone: "09189998877", workshop: "نصب و راه‌اندازی کرکره برقی", date: "1404/02/03", status: "canceled" },
  { id: 5, customer: "سمیرا رستمی", phone: "09357778899", workshop: "ایمنی و نگهداری درب‌های برقی", date: "1404/02/26", status: "prereg" },
  { id: 6, customer: "امیر حسینی", phone: "09123456789", workshop: "عیب‌یابی موتور و ریموت", date: "1404/02/27", status: "prereg" },
];

/* ─────────────── رزومه‌ها (درخواست همکاری) ─────────────── */
export const MOCK_RESUMES = [
  { id: 1, name: "امیر حسینی", phone: "09123456789", email: "amir.h@example.com", city: "تهران", position: "نصاب کرکره برقی", experience: "۳ سال سابقه نصب کرکره و درب برقی", submittedAt: "1404/02/11", status: "pending", note: "" },
  { id: 2, name: "سمیرا رستمی", phone: "09357778899", email: "samira@example.com", city: "کرج", position: "پشتیبان مشتریان", experience: "۲ سال تجربه پشتیبانی تلفنی", submittedAt: "1404/02/09", status: "approved", note: "مصاحبه تلفنی موفق بود." },
  { id: 3, name: "سعید کاظمی", phone: "09121113344", email: "saeed@example.com", city: "تهران", position: "نصاب کرکره برقی", experience: "بدون سابقه", submittedAt: "1404/02/08", status: "rejected", note: "نیاز به سابقه کار مرتبط." },
];

/* ─────────────── محصولات (دسته‌بندی طبق پیوست) ─────────────── */
export const MOCK_CATEGORIES = [
  { id: 1, name: "درب کرکره‌ای", count: 6 },
  { id: 2, name: "جکی", count: 4 },
  { id: 3, name: "ریلی", count: 3 },
  { id: 4, name: "سایبان برقی", count: 5 },
  { id: 5, name: "اپراتور", count: 8 },
];

export const MOCK_PRODUCTS = [
  { id: 1, name: "درب کرکره‌ای برقی ۳ متری", category: "درب کرکره‌ای", price: 4200000, stock: 12, status: "active" },
  { id: 2, name: "درب کرکره‌ای صنعتی ۵ متری", category: "درب کرکره‌ای", price: 8900000, stock: 5, status: "active" },
  { id: 3, name: "اپراتور جکی ۶۰۰ کیلوگرم", category: "جکی", price: 3200000, stock: 0, status: "out" },
  { id: 4, name: "سایبان برقی ۴ متری", category: "سایبان برقی", price: 6100000, stock: 7, status: "active" },
  { id: 5, name: "درب ریلی اتوماتیک", category: "ریلی", price: 7400000, stock: 3, status: "active" },
  { id: 6, name: "ریموت کنترل ۴ کاناله (قطعه)", category: "اپراتور", price: 350000, stock: 40, status: "active" },
];

/* ─────────────── QR کد و پرونده محصول ─────────────── */
// تاریخ‌ها نسبت به امروز ساخته می‌شوند تا وضعیت گارانتی همیشه نمونه‌ی خوبی بماند
export const MOCK_QR = [
  { id: 1, code: "MR-7K2Q-4F9D", product: "درب کرکره‌ای برقی ۳ متری", category: "درب کرکره‌ای", motor: "موتور ۳۰۰ کیلوگرم ایتالیایی", customer: "مهدی رضایی", installedAt: daysFromNow(-90), warrantyMonths: 24, serviceEvery: 6, installer: "رضا صادقی", active: true, repairs: [{ date: daysFromNow(-30), title: "تعویض ریموت کنترل", tech: "رضا صادقی" }] },
  { id: 2, code: "MR-3H8M-A2LP", product: "اپراتور جکی ۶۰۰ کیلوگرم", category: "جکی", motor: "جک بازویی ۶۰۰", customer: "زهرا کریمی", installedAt: daysFromNow(-400), warrantyMonths: 12, serviceEvery: 6, installer: "علی موسوی", active: true, repairs: [{ date: daysFromNow(-200), title: "سرویس دوره‌ای", tech: "علی موسوی" }, { date: daysFromNow(-40), title: "تعمیر برد کنترل", tech: "سعید کاظمی" }] },
  { id: 3, code: "MR-9D5T-W6RX", product: "درب ریلی اتوماتیک", category: "ریلی", motor: "موتور ریلی ۱۲۰۰", customer: "حسین نادری", installedAt: daysFromNow(-350), warrantyMonths: 12, serviceEvery: 6, installer: "سعید کاظمی", active: true, repairs: [] },
  { id: 4, code: "MR-2B7N-Q4ZC", product: "سایبان برقی ۴ متری", category: "سایبان برقی", motor: "موتور لوله‌ای ۵۰", customer: "نگین شریفی", installedAt: daysFromNow(-20), warrantyMonths: 18, serviceEvery: 6, installer: "علی موسوی", active: true, repairs: [] },
  { id: 5, code: "MR-6V1K-E8YU", product: "درب کرکره‌ای صنعتی ۵ متری", category: "درب کرکره‌ای", motor: "موتور ۵۰۰ کیلوگرم", customer: "مهدی رضایی", installedAt: daysFromNow(-715), warrantyMonths: 24, serviceEvery: 6, installer: "رضا صادقی", active: true, repairs: [{ date: daysFromNow(-300), title: "تعویض لاستیک آب‌بند", tech: "رضا صادقی" }] },
  { id: 6, code: "MR-4P9S-C3JA", product: "اپراتور جکی ۶۰۰ کیلوگرم", category: "جکی", motor: "جک بازویی ۶۰۰", customer: "امیر قاسمی", installedAt: daysFromNow(-150), warrantyMonths: 24, serviceEvery: 6, installer: "حمید نوری", active: false, repairs: [] },
  { id: 7, code: "MR-8G3F-L1TB", product: "درب کرکره‌ای برقی ۳ متری", category: "درب کرکره‌ای", motor: "موتور ۳۰۰ کیلوگرم ایتالیایی", customer: "نگین شریفی", installedAt: daysFromNow(-60), warrantyMonths: 24, serviceEvery: 6, installer: "علی موسوی", active: true, repairs: [] },
  { id: 8, code: "MR-1X6R-D9HM", product: "سایبان برقی ۴ متری", category: "سایبان برقی", motor: "موتور لوله‌ای ۵۰", customer: "زهرا کریمی", installedAt: daysFromNow(-5), warrantyMonths: 36, serviceEvery: 6, installer: "رضا صادقی", active: true, repairs: [] },
];

// مواردی که مشمول گارانتی نیستند (نمایش برای اطلاع مشتری)
export const WARRANTY_EXCLUSIONS = [
  "آسیب فیزیکی ناشی از ضربه یا برخورد",
  "نوسان یا قطعی برق و اتصال به برق نامناسب",
  "دستکاری یا تعمیر توسط افراد غیرمجاز",
  "عدم انجام سرویس دوره‌ای در زمان مقرر",
];

/* ─────────────── محتوای وبسایت ─────────────── */
export const MOCK_PAGES = [
  { id: 1, title: "صفحه اصلی", slug: "/", status: "published", updatedAt: "1404/02/10", summary: "لندینگ: استعلام قیمت، معرفی خدمات و نمونه‌کارها", body: "" },
  { id: 2, title: "روند کاری", slug: "/work-process", status: "published", updatedAt: "1404/02/08", summary: "مراحل کار ماردین از مشاوره تا تحویل", body: "" },
  { id: 3, title: "درباره کسب‌وکار", slug: "/business", status: "published", updatedAt: "1404/02/03", summary: "معرفی حوزه فعالیت: کرکره برقی", body: "" },
  { id: 4, title: "درباره ما", slug: "/about", status: "published", updatedAt: "1404/01/25", summary: "معرفی شرکت", body: "" },
  { id: 5, title: "فرصت‌های شغلی", slug: "/careers", status: "draft", updatedAt: "1404/02/12", summary: "فرصت‌های همکاری برای نصابان", body: "" },
  { id: 6, title: "ارتباط با ما", slug: "/contact", status: "published", updatedAt: "1404/01/18", summary: "تماس و آدرس دفاتر", body: "" },
];

export const MOCK_ARTICLES = [
  { id: 1, title: "راهنمای نگهداری از کرکره برقی", date: "1404/02/09", status: "published", author: "علی کیوانلو", summary: "چند نکته‌ی ساده برای عمر بیشتر موتور و ریل", body: "" },
  { id: 2, title: "تفاوت جکی و ریلی؛ کدام برای پارکینگ مناسب است؟", date: "1404/02/02", status: "published", author: "رضا صادقی", summary: "مقایسه‌ی دو نوع اپراتور از نظر قیمت و کاربرد", body: "" },
  { id: 3, title: "نکات ایمنی هنگام استفاده از درب‌های برقی", date: "1404/01/20", status: "draft", author: "مریم احمدی", summary: "", body: "" },
];

export const MOCK_SLIDES = [
  { id: 1, title: "نصب کرکره برقی با گارانتی", active: true, order: 1 },
  { id: 2, title: "خدمات پس از فروش و سرویس دوره‌ای", active: true, order: 2 },
  { id: 3, title: "استعلام قیمت آنلاین", active: false, order: 3 },
];

export const MOCK_NEWS = [
  { id: 1, title: "افتتاح شعبه جدید در شیراز", date: "1404/02/10", status: "published", summary: "", body: "" },
  { id: 2, title: "به‌روزرسانی سیستم QR و پرونده محصول", date: "1404/02/05", status: "published", summary: "", body: "" },
  { id: 3, title: "جشنواره سرویس رایگان بهاره", date: "1404/01/28", status: "draft", summary: "", body: "" },
];

/* ─────────────── خدمات ─────────────── */
export const MOCK_SERVICES = [
  { id: 1, name: "نصب کرکره برقی", basePrice: 1500000, active: true },
  { id: 2, name: "تعمیر موتور کرکره", basePrice: 850000, active: true },
  { id: 3, name: "سرویس دوره‌ای", basePrice: 300000, active: true },
  { id: 4, name: "نصب ریموت کنترل", basePrice: 450000, active: false },
];

/* ─────────────── فاکتور و پرداخت ─────────────── */
// type: invoice | proforma ؛ payment: paid | pending | cancelled
export const MOCK_INVOICES = [
  { id: 1, number: "INV-1404-0021", type: "invoice", customer: "مهدی رضایی", date: "1404/02/12", payment: "paid", linkSent: true, items: [{ kind: "service", title: "نصب کرکره برقی", qty: 1, price: 1500000 }, { kind: "part", title: "درب کرکره‌ای برقی ۳ متری", qty: 1, price: 4200000 }] },
  { id: 2, number: "INV-1404-0022", type: "invoice", customer: "حسین نادری", date: "1404/02/11", payment: "paid", linkSent: true, items: [{ kind: "service", title: "سرویس دوره‌ای", qty: 1, price: 300000 }] },
  { id: 3, number: "INV-1404-0023", type: "invoice", customer: "نگین شریفی", date: "1404/02/13", payment: "pending", linkSent: true, items: [{ kind: "service", title: "سرویس دوره‌ای", qty: 1, price: 300000 }, { kind: "part", title: "ریموت کنترل ۴ کاناله (قطعه)", qty: 2, price: 350000 }] },
  { id: 4, number: "PRO-1404-0009", type: "proforma", customer: "زهرا کریمی", date: "1404/02/13", payment: "pending", linkSent: false, items: [{ kind: "service", title: "تعمیر موتور کرکره", qty: 1, price: 850000 }] },
  { id: 5, number: "INV-1404-0020", type: "invoice", customer: "امیر قاسمی", date: "1404/02/02", payment: "cancelled", linkSent: true, items: [{ kind: "part", title: "اپراتور جکی ۶۰۰ کیلوگرم", qty: 1, price: 3200000 }] },
];

export const invoiceTotal = (inv) => inv.items.reduce((s, it) => s + it.qty * it.price, 0);

/* ─────────────── گزارش‌ها و لاگ ─────────────── */
// عملکرد تکنسین‌ها در ۳۰ روز اخیر
export const MOCK_TECH_REPORT = [
  { id: 1, name: "رضا صادقی", done: 38, avgHours: 2.4, rating: 4.8, rejectRate: 4, onTime: 96 },
  { id: 2, name: "علی موسوی", done: 31, avgHours: 2.9, rating: 4.6, rejectRate: 8, onTime: 91 },
  { id: 3, name: "سعید کاظمی", done: 44, avgHours: 2.1, rating: 4.9, rejectRate: 3, onTime: 98 },
  { id: 4, name: "حمید نوری", done: 17, avgHours: 3.8, rating: 4.3, rejectRate: 15, onTime: 82 },
];

export const MOCK_FAULTS = [
  { title: "موتور صدا می‌دهد یا بالا نمی‌رود", count: 38 },
  { title: "ریموت کنترل پاسخ نمی‌دهد", count: 29 },
  { title: "کرکره روی ریل گیر می‌کند", count: 21 },
  { title: "قطع ناگهانی برق در حین کار", count: 14 },
  { title: "کرکره کج بسته می‌شود", count: 11 },
];

export const MOCK_TOP_SERVICES = [
  { title: "سرویس دوره‌ای", count: 64 },
  { title: "تعمیر موتور کرکره", count: 41 },
  { title: "نصب کرکره برقی", count: 33 },
  { title: "نصب ریموت کنترل", count: 18 },
];

// type: auth | create | update | delete | assign
export const MOCK_ACTIVITY = [
  { id: 1, user: "علی کیوانلو", type: "auth", action: "ورود به پنل", target: "—", at: "1404/02/14 - 08:02" },
  { id: 2, user: "مریم احمدی", type: "assign", action: "ارجاع درخواست به تکنسین", target: "MR-1404-0101 ← رضا صادقی", at: "1404/02/12 - 10:38" },
  { id: 3, user: "لیلا بهرامی", type: "create", action: "ثبت فاکتور", target: "INV-1404-0023", at: "1404/02/13 - 15:10" },
  { id: 4, user: "مریم احمدی", type: "update", action: "تغییر وضعیت درخواست", target: "MR-1404-0103 ← بررسی اپراتور", at: "1404/02/13 - 14:25" },
  { id: 5, user: "علی کیوانلو", type: "create", action: "تولید QR جدید", target: "MR-8G3F-L1TB", at: "1404/02/12 - 09:30" },
  { id: 6, user: "علی کیوانلو", type: "update", action: "ویرایش صفحه وبسایت", target: "درباره ما", at: "1404/02/11 - 17:44" },
  { id: 7, user: "مریم احمدی", type: "delete", action: "حذف مشتری آزمایشی", target: "مشتری #۱۸", at: "1404/02/11 - 12:05" },
  { id: 8, user: "علی کیوانلو", type: "update", action: "تغییر سطح دسترسی نقش حسابدار", target: "گزارش‌ها ← مشاهده", at: "1404/02/10 - 11:20" },
  { id: 9, user: "مریم احمدی", type: "update", action: "غیرفعال‌سازی QR", target: "MR-4P9S-C3JA", at: "1404/02/09 - 16:12" },
  { id: 10, user: "لیلا بهرامی", type: "auth", action: "ورود به پنل", target: "—", at: "1404/02/09 - 09:01" },
];

/* ─────────────── اعلان‌ها (پیامک و داخلی) ─────────────── */
export const MOCK_NOTIFY_RULES = [
  { key: "request", label: "ثبت درخواست", desc: "پس از ثبت درخواست خدمات توسط مشتری", sms: true, inApp: true, sample: "درخواست شما با شماره پیگیری {شماره_پیگیری} ثبت شد." },
  { key: "dispatch", label: "اعزام تکنسین", desc: "وقتی تکنسین برای درخواست اعزام می‌شود", sms: true, inApp: true, sample: "تکنسین {نام_تکنسین} برای درخواست {شماره_پیگیری} اعزام شد." },
  { key: "arrived", label: "رسیدن تکنسین", desc: "وقتی تکنسین به محل می‌رسد", sms: true, inApp: false, sample: "تکنسین ماردین به محل شما رسید." },
  { key: "finished", label: "پایان کار", desc: "پس از ثبت پایان کار؛ مشتری برای تأیید و نظرسنجی دعوت می‌شود", sms: true, inApp: true, sample: "کار درخواست {شماره_پیگیری} پایان یافت. لطفاً تأیید و امتیاز دهید." },
  { key: "warranty", label: "پایان گارانتی", desc: "قبل از پایان گارانتی محصول", sms: true, inApp: true, sample: "گارانتی {محصول} شما {تعداد_روز} روز دیگر پایان می‌یابد." },
];

export const MOCK_NOTIFY_LOG = [
  { id: 1, event: "ثبت درخواست", to: "09351112233", channel: "sms", status: "delivered", at: "1404/02/13 - 09:15" },
  { id: 2, event: "اعزام تکنسین", to: "09121234567", channel: "sms", status: "delivered", at: "1404/02/12 - 10:38" },
  { id: 3, event: "اعزام تکنسین", to: "مهدی رضایی", channel: "inapp", status: "delivered", at: "1404/02/12 - 10:38" },
  { id: 4, event: "پایان کار", to: "09127776655", channel: "sms", status: "failed", at: "1404/02/12 - 15:41" },
  { id: 5, event: "پایان گارانتی", to: "09189998877", channel: "sms", status: "delivered", at: "1404/02/10 - 09:00" },
  { id: 6, event: "ثبت درخواست", to: "مریم احمدی", channel: "inapp", status: "delivered", at: "1404/02/14 - 08:05" },
];

// اعلان‌های داخلی که در زنگ بالای صفحه دیده می‌شوند
export const MOCK_INBOX = [
  { id: 1, title: "درخواست فوری جدید", text: "MR-1404-0105 • تعمیر ریل کرکره • تهران", at: "امروز، ۰۸:۰۵", unread: true, to: "/missions/assign" },
  { id: 2, title: "ماموریت رد شد", text: "سعید کاظمی ماموریت MR-1404-0103 را رد کرد", at: "دیروز، ۱۴:۲۰", unread: true, to: "/missions/assign" },
  { id: 3, title: "رزومه‌ی جدید", text: "امیر حسینی برای «نصاب کرکره برقی» درخواست داده است", at: "۲ روز پیش", unread: false, to: "/registrations/resumes" },
];

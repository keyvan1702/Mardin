export const MOCK_USERS = [
  { id: 1, username: "admin", password: "1234", name: "علی کیوانلو", role: "super-admin" },
  { id: 2, username: "operator", password: "1234", name: "سارا احمدی", role: "admin" },
  { id: 3, username: "viewer", password: "1234", name: "رضا محمدی", role: "viewer" },
];

export const MOCK_STATS = {
  customers: 1250,
  products: 248,
  workshops: 12,
  services: 7,
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

export function buildSiteStats(days) {
  const rand = mulberry32(days * 7919);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from({ length: days }, (_, i) => {
    const progress = days === 1 ? 1 : i / (days - 1);
    const trend = 480 + 820 * Math.pow(progress, 1.5);
    const wave = Math.sin(i * 0.9) * 110 + (rand() - 0.5) * 140;
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    return {
      date: date.toISOString(),
      value: Math.min(1480, Math.max(40, Math.round(trend + wave))),
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

/* ─────────────── کارکنان / نصاب‌ها ─────────────── */
export const MOCK_STAFF = [
  { id: 1, name: "رضا صادقی", role: "نصاب ارشد", phone: "09121112233", city: "تهران", active: true },
  { id: 2, name: "مریم احمدی", role: "پشتیبان", phone: "09354445566", city: "تهران", active: true },
  { id: 3, name: "کاظم رحیمی", role: "نصاب", phone: "09187778899", city: "کرج", active: false },
];

export const MOCK_INSTALLERS = [
  { id: 1, name: "رضا صادقی", phone: "09121112233", city: "تهران", rating: 4.8, doneJobs: 132, online: true, activeMissions: 2 },
  { id: 2, name: "علی موسوی", phone: "09123334455", city: "تهران", rating: 4.6, doneJobs: 87, online: true, activeMissions: 1 },
  { id: 3, name: "سعید کاظمی", phone: "09356667788", city: "کرج", rating: 4.9, doneJobs: 210, online: false, activeMissions: 0 },
  { id: 4, name: "حمید نوری", phone: "09199998877", city: "تهران", rating: 4.3, doneJobs: 45, online: true, activeMissions: 3 },
];

/* ─────────────── ماموریت‌ها (شبیه اسنپ) ─────────────── */
// status: pending → جستجوی نصاب | accepted → پذیرفته‌شده | rejected → رد‌شده | done → تمام‌شده
export const MOCK_MISSIONS = [
  {
    id: 101,
    customer: "مهدی رضایی",
    customerPhone: "09121234567",
    city: "تهران",
    address: "ولیعصر، پلاک ۱۲",
    service: "نصب کرکره برقی",
    description: "کرکره ۳ متری، موتور جدید نصب شود.",
    price: 3500000,
    createdAt: "1404/02/12 - 10:30",
    status: "accepted",
    installer: "رضا صادقی",
    installerPhone: "09121112233",
    respondedAt: "1404/02/12 - 10:45",
  },
  {
    id: 102,
    customer: "زهرا کریمی",
    customerPhone: "09351112233",
    city: "اصفهان",
    address: "چهارباغ، کوچه ۵",
    service: "تعمیر موتور کرکره",
    description: "موتور صدا می‌دهد و بالا نمی‌رود.",
    price: 850000,
    createdAt: "1404/02/13 - 09:15",
    status: "pending",
    installer: null,
    installerPhone: null,
    respondedAt: null,
  },
  {
    id: 103,
    customer: "نگین شریفی",
    customerPhone: "09127776655",
    city: "شیراز",
    address: "خیابان زند، پلاک ۴۲",
    service: "نصب ریموت کنترل",
    description: "دو ریموت جدید برای کرکره پارکینگ.",
    price: 450000,
    createdAt: "1404/02/13 - 14:00",
    status: "rejected",
    installer: "سعید کاظمی",
    installerPhone: "09356667788",
    respondedAt: "1404/02/13 - 14:20",
    rejectReason: "خارج از محدوده سرویس",
  },
  {
    id: 104,
    customer: "حسین نادری",
    customerPhone: "09189998877",
    city: "مشهد",
    address: "وکیل‌آباد، بلوار ۱۰",
    service: "سرویس دوره‌ای کرکره",
    description: "روغن‌کاری و بررسی عملکرد.",
    price: 300000,
    createdAt: "1404/02/10 - 16:00",
    status: "done",
    installer: "علی موسوی",
    installerPhone: "09123334455",
    respondedAt: "1404/02/10 - 16:30",
  },
];

/* ─────────────── ورکشاپ‌ها (فقط اسم‌نویسی) ─────────────── */
// بدون پرداخت — ظرفیت و لیست ثبت‌نام
export const MOCK_WORKSHOPS = [
  { id: 1, title: "ورکشاپ مدیریت پروژه چابک", instructor: "دکتر سعید مرادی", date: "1404/02/15", capacity: 30, enrolled: 22, status: "open", location: "تهران - سالن همایش" },
  { id: 2, title: "ورکشاپ طراحی رابط کاربری", instructor: "مهندس لیلا حسینی", date: "1404/03/02", capacity: 20, enrolled: 20, status: "full", location: "آنلاین" },
  { id: 3, title: "ورکشاپ تحلیل داده با پایتون", instructor: "دکتر رضا شریفی", date: "1404/03/20", capacity: 25, enrolled: 8, status: "open", location: "اصفهان" },
  { id: 4, title: "ورکشاپ امنیت شبکه", instructor: "مهندس آرش کاظمی", date: "1404/01/10", capacity: 30, enrolled: 30, status: "done", location: "مشهد" },
];

// ثبت‌نام‌ها — بدون پرداخت
export const MOCK_REGISTRATIONS = [
  { id: 1, customer: "مهدی رضایی", phone: "09121234567", workshop: "مدیریت پروژه چابک", date: "1404/02/01", status: "confirmed" },
  { id: 2, customer: "زهرا کریمی", phone: "09351112233", workshop: "طراحی رابط کاربری", date: "1404/02/10", status: "confirmed" },
  { id: 3, customer: "نگین شریفی", phone: "09127776655", workshop: "تحلیل داده با پایتون", date: "1404/02/25", status: "pending" },
  { id: 4, customer: "حسین نادری", phone: "09189998877", workshop: "مدیریت پروژه چابک", date: "1404/02/03", status: "canceled" },
];

/* ─────────────── رزومه‌ها (درخواست همکاری) ─────────────── */
// status: pending → در انتظار بررسی | approved → تأیید | rejected → رد
export const MOCK_RESUMES = [
  {
    id: 1,
    name: "امیر حسینی",
    phone: "09123456789",
    email: "amir.h@example.com",
    city: "تهران",
    position: "نصاب کرکره برقی",
    experience: "۳ سال سابقه نصب کرکره و درب برقی",
    submittedAt: "1404/02/11",
    status: "pending",
    note: "",
  },
  {
    id: 2,
    name: "سمیرا رستمی",
    phone: "09357778899",
    email: "samira@example.com",
    city: "کرج",
    position: "پشتیبان مشتریان",
    experience: "۲ سال تجربه پشتیبانی تلفنی",
    submittedAt: "1404/02/09",
    status: "approved",
    note: "مصاحبه تلفنی موفق بود.",
  },
  {
    id: 3,
    name: "سعید کاظمی",
    phone: "09121113344",
    email: "saeed@example.com",
    city: "تهران",
    position: "نصاب کرکره برقی",
    experience: "بدون سابقه",
    submittedAt: "1404/02/08",
    status: "rejected",
    note: "نیاز به سابقه کار مرتبط.",
  },
];

/* ─────────────── محصولات ─────────────── */
export const MOCK_PRODUCTS = [
  { id: 1, name: "کرکره برقی رومیزی ۳ متری", category: "کرکره برقی", price: 4200000, stock: 12, status: "active" },
  { id: 2, name: "کرکره برقی صنعتی ۵ متری", category: "کرکره برقی", price: 8900000, stock: 5, status: "active" },
  { id: 3, name: "موتور کرکره ایتالیایی", category: "موتور", price: 3200000, stock: 0, status: "out" },
  { id: 4, name: "ریموت کنترل ۴ کاناله", category: "لوازم جانبی", price: 350000, stock: 40, status: "active" },
];

export const MOCK_CATEGORIES = [
  { id: 1, name: "کرکره برقی", count: 8 },
  { id: 2, name: "موتور", count: 3 },
  { id: 3, name: "لوازم جانبی", count: 15 },
];

/* ─────────────── بخش عمومی سایت ─────────────── */
export const MOCK_SLIDES = [
  { id: 1, title: "نصب کرکره برقی با گارانتی", active: true, order: 1 },
  { id: 2, title: "خدمات تعمیر تخصصی", active: true, order: 2 },
  { id: 3, title: "تخفیف ویژه نصب", active: false, order: 3 },
];

export const MOCK_NEWS = [
  { id: 1, title: "افتتاح شعبه جدید در شیراز", date: "1404/02/10", published: true },
  { id: 2, title: "به‌روزرسانی سیستم نصب هوشمند", date: "1404/02/05", published: true },
  { id: 3, title: "جشنواره فروش تابستانه", date: "1404/01/28", published: false },
];

/* ─────────────── خدمات ─────────────── */
export const MOCK_SERVICES = [
  { id: 1, name: "نصب کرکره برقی", basePrice: 1500000, active: true },
  { id: 2, name: "تعمیر موتور کرکره", basePrice: 850000, active: true },
  { id: 3, name: "سرویس دوره‌ای", basePrice: 300000, active: true },
  { id: 4, name: "نصب ریموت کنترل", basePrice: 450000, active: false },
];
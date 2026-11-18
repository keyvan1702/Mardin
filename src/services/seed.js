import { agoISO, jalaliYear } from "../utils/format";
import { daysFromNow } from "../utils/warranty";
import { DEFAULT_ACCESS } from "../utils/access";

/**
 * داده‌ی اولیه‌ی پنل (فقط وقتی حافظه‌ی مرورگر خالی است ساخته می‌شود).
 * همه‌ی تاریخ‌ها ISO هستند و هنگام نمایش به شمسی تبدیل می‌شوند.
 * با وصل شدن API این فایل کنار گذاشته می‌شود.
 */
const Y = () => jalaliYear();

export function makeSeed() {
  const year = Y();

  const staff = [
    { id: 1, name: "علی کیوانلو", title: "مدیر کل", roleKey: "manager", phone: "09121110001", city: "تهران", username: "admin", password: "1234", active: true },
    { id: 2, name: "مریم احمدی", title: "اپراتور پشتیبانی", roleKey: "operator", phone: "09354445566", city: "تهران", username: "operator", password: "1234", active: true },
    { id: 3, name: "لیلا بهرامی", title: "حسابدار", roleKey: "accountant", phone: "09121110006", city: "تهران", username: "accountant", password: "1234", active: true },
    { id: 4, name: "رضا صادقی", title: "تکنسین ارشد", roleKey: "technician", phone: "09121112233", city: "تهران", username: "tech", password: "1234", active: true },
    { id: 5, name: "کاظم رحیمی", title: "تکنسین", roleKey: "technician", phone: "09187778899", city: "کرج", username: "kazem", password: "1234", active: false },
  ];

  const customers = [
    { id: 1, name: "مهدی رضایی", phone: "09121234567", email: "mahdi@example.com", city: "تهران", address: "خیابان ولیعصر، پلاک ۱۲", status: "active", note: "", joinedAt: daysFromNow(-120) },
    { id: 2, name: "زهرا کریمی", phone: "09351112233", email: "zahra@example.com", city: "اصفهان", address: "خیابان چهارباغ، کوچه ۵", status: "active", note: "", joinedAt: daysFromNow(-95) },
    { id: 3, name: "حسین نادری", phone: "09189998877", email: "hossein@example.com", city: "مشهد", address: "بلوار وکیل‌آباد", status: "inactive", note: "", joinedAt: daysFromNow(-200) },
    { id: 4, name: "نگین شریفی", phone: "09127776655", email: "negin@example.com", city: "شیراز", address: "خیابان زند، پلاک ۴۲", status: "active", note: "", joinedAt: daysFromNow(-60) },
    { id: 5, name: "امیر قاسمی", phone: "09364445566", email: "amir@example.com", city: "تبریز", address: "خیابان امام", status: "blocked", note: "عدم پرداخت فاکتور", joinedAt: daysFromNow(-260) },
  ];

  const installers = [
    { id: 1, name: "رضا صادقی", phone: "09121112233", city: "تهران", rating: 4.8, doneJobs: 132, online: true },
    { id: 2, name: "علی موسوی", phone: "09123334455", city: "تهران", rating: 4.6, doneJobs: 87, online: true },
    { id: 3, name: "سعید کاظمی", phone: "09356667788", city: "کرج", rating: 4.9, doneJobs: 210, online: false },
    { id: 4, name: "حمید نوری", phone: "09199998877", city: "تهران", rating: 4.3, doneJobs: 45, online: true },
  ];

  const categories = [
    { id: 1, name: "درب کرکره‌ای" }, { id: 2, name: "جکی" }, { id: 3, name: "ریلی" },
    { id: 4, name: "سایبان برقی" }, { id: 5, name: "اپراتور" },
  ];

  const products = [
    { id: 1, name: "درب کرکره‌ای برقی ۳ متری", category: "درب کرکره‌ای", price: 4200000, stock: 12 },
    { id: 2, name: "درب کرکره‌ای صنعتی ۵ متری", category: "درب کرکره‌ای", price: 8900000, stock: 5 },
    { id: 3, name: "اپراتور جکی ۶۰۰ کیلوگرم", category: "جکی", price: 3200000, stock: 0 },
    { id: 4, name: "سایبان برقی ۴ متری", category: "سایبان برقی", price: 6100000, stock: 7 },
    { id: 5, name: "درب ریلی اتوماتیک", category: "ریلی", price: 7400000, stock: 3 },
    { id: 6, name: "ریموت کنترل ۴ کاناله (قطعه)", category: "اپراتور", price: 350000, stock: 40 },
  ];

  const services = [
    { id: 1, name: "نصب کرکره برقی", basePrice: 1500000, active: true },
    { id: 2, name: "تعمیر موتور کرکره", basePrice: 850000, active: true },
    { id: 3, name: "سرویس دوره‌ای", basePrice: 300000, active: true },
    { id: 4, name: "نصب ریموت کنترل", basePrice: 450000, active: false },
  ];

  const mk = (id, over) => ({
    id, tracking: `MR-${year}-${String(100 + id - 100).padStart(4, "0")}`, fault: "", rating: null, feedback: "", rejectReason: "", ...over,
  });

  const missions = [
    mk(106, { priority: "normal", stage: "finished", status: "assigned", customerId: 4, customer: "نگین شریفی", phone: "09127776655", city: "شیراز", address: "خیابان زند، پلاک ۴۲", service: "سرویس دوره‌ای", description: "سرویس شش‌ماهه‌ی کرکره پارکینگ.", price: 300000, installerId: 2, installer: "علی موسوی", createdAt: agoISO(3, 2), events: [
      { at: agoISO(3, 2), text: "درخواست ثبت شد" }, { at: agoISO(3, 1), text: "اپراتور درخواست را به علی موسوی ارجاع داد" }, { at: agoISO(3, 0.5), text: "تکنسین ماموریت را پذیرفت" }, { at: agoISO(2, 6), text: "تکنسین پایان کار را ثبت کرد؛ منتظر تأیید مشتری" }] }),
    mk(105, { priority: "urgent", stage: "registered", status: "pending", customerId: 1, customer: "مهدی رضایی", phone: "09121234567", city: "تهران", address: "ولیعصر، پلاک ۱۲", service: "تعمیر موتور کرکره", fault: "rail", description: "کرکره وسط مسیر گیر کرده و باز نمی‌شود.", price: 1200000, installerId: null, installer: null, createdAt: agoISO(0, 3), events: [{ at: agoISO(0, 3), text: "درخواست با اولویت فوری ثبت شد" }] }),
    mk(104, { priority: "low", stage: "closed", status: "done", customerId: 3, customer: "حسین نادری", phone: "09189998877", city: "مشهد", address: "وکیل‌آباد، بلوار ۱۰", service: "سرویس دوره‌ای", description: "روغن‌کاری و بررسی عملکرد.", price: 300000, installerId: 2, installer: "علی موسوی", createdAt: agoISO(6), rating: 5, feedback: "سریع و حرفه‌ای انجام شد.", events: [
      { at: agoISO(6), text: "درخواست ثبت شد" }, { at: agoISO(6, -1), text: "اپراتور درخواست را به علی موسوی ارجاع داد" }, { at: agoISO(5, 20), text: "تکنسین ماموریت را پذیرفت" }, { at: agoISO(5), text: "تکنسین پایان کار را ثبت کرد" }, { at: agoISO(4, 20), text: "مشتری پایان کار را تأیید و نظرسنجی ثبت کرد" }] }),
    mk(103, { priority: "normal", stage: "review", status: "rejected", customerId: 4, customer: "نگین شریفی", phone: "09127776655", city: "شیراز", address: "خیابان زند، پلاک ۴۲", service: "نصب ریموت کنترل", fault: "remote", description: "دو ریموت جدید برای کرکره پارکینگ.", price: 450000, installerId: null, installer: null, createdAt: agoISO(2), rejectReason: "خارج از محدوده سرویس", events: [
      { at: agoISO(2), text: "درخواست ثبت شد" }, { at: agoISO(1, 23), text: "اپراتور درخواست را به سعید کاظمی ارجاع داد" }, { at: agoISO(1, 22), text: "تکنسین ماموریت را رد کرد: خارج از محدوده سرویس" }] }),
    mk(102, { priority: "high", stage: "registered", status: "pending", customerId: 2, customer: "زهرا کریمی", phone: "09351112233", city: "اصفهان", address: "چهارباغ، کوچه ۵", service: "تعمیر موتور کرکره", fault: "motor", description: "موتور صدا می‌دهد و بالا نمی‌رود.", price: 850000, installerId: null, installer: null, createdAt: agoISO(1), events: [{ at: agoISO(1), text: "درخواست ثبت شد" }] }),
    mk(101, { priority: "normal", stage: "inprogress", status: "accepted", customerId: 1, customer: "مهدی رضایی", phone: "09121234567", city: "تهران", address: "ولیعصر، پلاک ۱۲", service: "نصب کرکره برقی", description: "کرکره ۳ متری، موتور جدید نصب شود.", price: 3500000, installerId: 1, installer: "رضا صادقی", createdAt: agoISO(1, 5), events: [
      { at: agoISO(1, 5), text: "درخواست ثبت شد" }, { at: agoISO(1, 4.5), text: "اپراتور درخواست را به رضا صادقی ارجاع داد" }, { at: agoISO(1, 4), text: "تکنسین ماموریت را پذیرفت" }, { at: agoISO(1, 2), text: "تکنسین به محل رسید و کار آغاز شد" }] }),
  ];

  const workshops = [
    { id: 1, title: "ورکشاپ نصب و راه‌اندازی کرکره برقی", instructor: "رضا صادقی", date: daysFromNow(10), capacity: 30, enrolled: 22, status: "open", location: "تهران - سالن همایش" },
    { id: 2, title: "ورکشاپ عیب‌یابی موتور و ریموت", instructor: "سعید کاظمی", date: daysFromNow(25), capacity: 20, enrolled: 20, status: "full", location: "آنلاین" },
    { id: 3, title: "ورکشاپ ایمنی و نگهداری درب‌های برقی", instructor: "علی موسوی", date: daysFromNow(45), capacity: 25, enrolled: 8, status: "open", location: "اصفهان" },
    { id: 4, title: "ورکشاپ نصب سایبان برقی", instructor: "حمید نوری", date: daysFromNow(-40), capacity: 30, enrolled: 30, status: "done", location: "مشهد" },
  ];

  const registrations = [
    { id: 1, name: "مهدی رضایی", phone: "09121234567", workshopId: 1, createdAt: daysFromNow(-9), status: "confirmed" },
    { id: 2, name: "زهرا کریمی", phone: "09351112233", workshopId: 2, createdAt: daysFromNow(-8), status: "confirmed" },
    { id: 3, name: "نگین شریفی", phone: "09127776655", workshopId: 3, createdAt: daysFromNow(-4), status: "pending" },
    { id: 4, name: "حسین نادری", phone: "09189998877", workshopId: 1, createdAt: daysFromNow(-7), status: "canceled" },
    { id: 5, name: "سمیرا رستمی", phone: "09357778899", workshopId: 3, createdAt: daysFromNow(-3), status: "prereg" },
    { id: 6, name: "امیر حسینی", phone: "09123456789", workshopId: 2, createdAt: daysFromNow(-2), status: "prereg" },
  ];

  const resumes = [
    { id: 1, name: "امیر حسینی", phone: "09123456789", email: "amir.h@example.com", city: "تهران", position: "نصاب کرکره برقی", experience: "۳ سال سابقه نصب کرکره و درب برقی", submittedAt: daysFromNow(-3), status: "pending", note: "" },
    { id: 2, name: "سمیرا رستمی", phone: "09357778899", email: "samira@example.com", city: "کرج", position: "پشتیبان مشتریان", experience: "۲ سال تجربه پشتیبانی تلفنی", submittedAt: daysFromNow(-6), status: "approved", note: "مصاحبه تلفنی موفق بود." },
    { id: 3, name: "سعید فروغی", phone: "09121113344", email: "saeed@example.com", city: "تهران", position: "نصاب کرکره برقی", experience: "بدون سابقه", submittedAt: daysFromNow(-8), status: "rejected", note: "نیاز به سابقه کار مرتبط." },
  ];

  const qr = [
    { id: 1, code: "MR-7K2Q-4F9D", product: "درب کرکره‌ای برقی ۳ متری", category: "درب کرکره‌ای", motor: "موتور ۳۰۰ کیلوگرم ایتالیایی", customer: "مهدی رضایی", installedAt: daysFromNow(-90), warrantyMonths: 24, serviceEvery: 6, installer: "رضا صادقی", active: true, repairs: [{ date: daysFromNow(-30), title: "تعویض ریموت کنترل", tech: "رضا صادقی" }] },
    { id: 2, code: "MR-3H8M-A2LP", product: "اپراتور جکی ۶۰۰ کیلوگرم", category: "جکی", motor: "جک بازویی ۶۰۰", customer: "زهرا کریمی", installedAt: daysFromNow(-400), warrantyMonths: 12, serviceEvery: 6, installer: "علی موسوی", active: true, repairs: [{ date: daysFromNow(-200), title: "سرویس دوره‌ای", tech: "علی موسوی" }, { date: daysFromNow(-40), title: "تعمیر برد کنترل", tech: "سعید کاظمی" }] },
    { id: 3, code: "MR-9D5T-W6RX", product: "درب ریلی اتوماتیک", category: "ریلی", motor: "موتور ریلی ۱۲۰۰", customer: "حسین نادری", installedAt: daysFromNow(-350), warrantyMonths: 12, serviceEvery: 6, installer: "سعید کاظمی", active: true, repairs: [] },
    { id: 4, code: "MR-2B7N-Q4ZC", product: "سایبان برقی ۴ متری", category: "سایبان برقی", motor: "موتور لوله‌ای ۵۰", customer: "نگین شریفی", installedAt: daysFromNow(-20), warrantyMonths: 18, serviceEvery: 6, installer: "علی موسوی", active: true, repairs: [] },
    { id: 5, code: "MR-6V1K-E8YU", product: "درب کرکره‌ای صنعتی ۵ متری", category: "درب کرکره‌ای", motor: "موتور ۵۰۰ کیلوگرم", customer: "مهدی رضایی", installedAt: daysFromNow(-715), warrantyMonths: 24, serviceEvery: 6, installer: "رضا صادقی", active: true, repairs: [{ date: daysFromNow(-300), title: "تعویض لاستیک آب‌بند", tech: "رضا صادقی" }] },
    { id: 6, code: "MR-4P9S-C3JA", product: "اپراتور جکی ۶۰۰ کیلوگرم", category: "جکی", motor: "جک بازویی ۶۰۰", customer: "امیر قاسمی", installedAt: daysFromNow(-150), warrantyMonths: 24, serviceEvery: 6, installer: "حمید نوری", active: false, repairs: [] },
  ];

  const pages = [
    { id: 1, title: "صفحه اصلی", slug: "/", status: "published", updatedAt: daysFromNow(-4), summary: "لندینگ: استعلام قیمت، معرفی خدمات و نمونه‌کارها", body: "" },
    { id: 2, title: "روند کاری", slug: "/work-process", status: "published", updatedAt: daysFromNow(-6), summary: "مراحل کار ماردین از مشاوره تا تحویل", body: "" },
    { id: 3, title: "درباره کسب‌وکار", slug: "/business", status: "published", updatedAt: daysFromNow(-11), summary: "معرفی حوزه فعالیت: کرکره برقی", body: "" },
    { id: 4, title: "درباره ما", slug: "/about", status: "published", updatedAt: daysFromNow(-20), summary: "معرفی شرکت", body: "" },
    { id: 5, title: "فرصت‌های شغلی", slug: "/careers", status: "draft", updatedAt: daysFromNow(-2), summary: "فرصت‌های همکاری برای نصابان", body: "" },
    { id: 6, title: "ارتباط با ما", slug: "/contact", status: "published", updatedAt: daysFromNow(-25), summary: "تماس و آدرس دفاتر", body: "" },
  ];
  const articles = [
    { id: 1, title: "راهنمای نگهداری از کرکره برقی", date: daysFromNow(-5), status: "published", author: "علی کیوانلو", summary: "چند نکته‌ی ساده برای عمر بیشتر موتور و ریل", body: "" },
    { id: 2, title: "تفاوت جکی و ریلی؛ کدام برای پارکینگ مناسب است؟", date: daysFromNow(-12), status: "published", author: "رضا صادقی", summary: "مقایسه‌ی دو نوع اپراتور از نظر قیمت و کاربرد", body: "" },
    { id: 3, title: "نکات ایمنی هنگام استفاده از درب‌های برقی", date: daysFromNow(-22), status: "draft", author: "مریم احمدی", summary: "", body: "" },
  ];
  const news = [
    { id: 1, title: "افتتاح شعبه جدید در شیراز", date: daysFromNow(-8), status: "published", summary: "", body: "" },
    { id: 2, title: "به‌روزرسانی سیستم QR و پرونده محصول", date: daysFromNow(-13), status: "published", summary: "", body: "" },
    { id: 3, title: "جشنواره سرویس رایگان بهاره", date: daysFromNow(-20), status: "draft", summary: "", body: "" },
  ];
  const slides = [
    { id: 1, title: "نصب کرکره برقی با گارانتی", active: true, order: 1 },
    { id: 2, title: "خدمات پس از فروش و سرویس دوره‌ای", active: true, order: 2 },
    { id: 3, title: "استعلام قیمت آنلاین", active: false, order: 3 },
  ];

  const invoices = [
    { id: 1, number: `INV-${year}-0021`, type: "invoice", customer: "مهدی رضایی", date: daysFromNow(-10), payment: "paid", linkSent: true, request: "", items: [{ kind: "service", title: "نصب کرکره برقی", qty: 1, price: 1500000 }, { kind: "part", title: "درب کرکره‌ای برقی ۳ متری", qty: 1, price: 4200000 }] },
    { id: 2, number: `INV-${year}-0022`, type: "invoice", customer: "حسین نادری", date: daysFromNow(-8), payment: "paid", linkSent: true, request: "", items: [{ kind: "service", title: "سرویس دوره‌ای", qty: 1, price: 300000 }] },
    { id: 3, number: `INV-${year}-0023`, type: "invoice", customer: "نگین شریفی", date: daysFromNow(-3), payment: "pending", linkSent: true, request: "", items: [{ kind: "service", title: "سرویس دوره‌ای", qty: 1, price: 300000 }, { kind: "part", title: "ریموت کنترل ۴ کاناله (قطعه)", qty: 2, price: 350000 }] },
    { id: 4, number: `PRO-${year}-0009`, type: "proforma", customer: "زهرا کریمی", date: daysFromNow(-1), payment: "pending", linkSent: false, request: "", items: [{ kind: "service", title: "تعمیر موتور کرکره", qty: 1, price: 850000 }] },
    { id: 5, number: `INV-${year}-0020`, type: "invoice", customer: "امیر قاسمی", date: daysFromNow(-30), payment: "cancelled", linkSent: true, request: "", items: [{ kind: "part", title: "اپراتور جکی ۶۰۰ کیلوگرم", qty: 1, price: 3200000 }] },
  ];

  const notifyRules = [
    { key: "request", label: "ثبت درخواست", desc: "پس از ثبت درخواست خدمات توسط مشتری", sms: true, inApp: true, sample: "درخواست با شماره پیگیری {شماره_پیگیری} ثبت شد." },
    { key: "dispatch", label: "اعزام تکنسین", desc: "وقتی تکنسین برای درخواست اعزام می‌شود", sms: true, inApp: true, sample: "تکنسین {نام_تکنسین} برای درخواست {شماره_پیگیری} اعزام شد." },
    { key: "arrived", label: "رسیدن تکنسین", desc: "وقتی تکنسین به محل می‌رسد", sms: true, inApp: false, sample: "تکنسین ماردین برای درخواست {شماره_پیگیری} به محل شما رسید." },
    { key: "finished", label: "پایان کار", desc: "پس از ثبت پایان کار؛ مشتری برای تأیید و نظرسنجی دعوت می‌شود", sms: true, inApp: true, sample: "کار درخواست {شماره_پیگیری} پایان یافت. لطفاً تأیید و امتیاز دهید." },
    { key: "warranty", label: "پایان گارانتی", desc: "قبل از پایان گارانتی محصول", sms: true, inApp: true, sample: "گارانتی {محصول} شما {تعداد_روز} روز دیگر پایان می‌یابد." },
  ];

  return {
    staff, customers, installers, categories, products, services, missions, workshops, registrations, resumes,
    qr, pages, articles, news, slides, invoices, notifyRules,
    notifyLog: [
      { id: 3, event: "ثبت درخواست", to: "مهدی رضایی", channel: "inapp", status: "delivered", at: agoISO(0, 3), text: "" },
      { id: 2, event: "پایان کار", to: "09127776655", channel: "sms", status: "failed", at: agoISO(2, 6), text: "" },
      { id: 1, event: "اعزام تکنسین", to: "09121234567", channel: "sms", status: "delivered", at: agoISO(1, 4.5), text: "" },
    ],
    inbox: [
      { id: 3, title: "درخواست فوری جدید", text: `MR-${year}-0105 • تعمیر موتور کرکره • تهران`, at: agoISO(0, 3), unread: true, to: "/missions/105" },
      { id: 2, title: "ماموریت رد شد", text: `سعید کاظمی ماموریت MR-${year}-0103 را رد کرد`, at: agoISO(1, 22), unread: true, to: "/missions/103" },
      { id: 1, title: "رزومه‌ی جدید", text: "امیر حسینی برای «نصاب کرکره برقی» درخواست داده است", at: agoISO(3), unread: false, to: "/registrations/resumes" },
    ],
    activity: [
      { id: 2, user: "مریم احمدی", type: "assign", action: "ارجاع درخواست به تکنسین", target: `MR-${year}-0101 ← رضا صادقی`, at: agoISO(1, 4.5) },
      { id: 1, user: "علی کیوانلو", type: "auth", action: "ورود به پنل", target: "—", at: agoISO(0, 6) },
    ],
    settings: { siteName: "ماردین", phone: "02112345678", email: "info@mardin.ir", city: "تهران", address: "تهران، خیابان ولیعصر", workshopSignup: true, maintenance: false, smsPanel: false },
    access: JSON.parse(JSON.stringify(DEFAULT_ACCESS)),
  };
}

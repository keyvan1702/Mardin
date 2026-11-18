import { db, getState } from "./store";
import { AUTH_KEY } from "./apiService";
import { jalaliYear, nowISO } from "../utils/format";
import { daysFromNow } from "../utils/warranty";

/**
 * منطق کسب‌وکار پنل: هر تابع داده را تغییر می‌دهد، لاگ فعالیت می‌نویسد و در صورت نیاز اعلان می‌فرستد.
 * خطاهای قابل‌نمایش به کاربر با throw new Error("پیام فارسی") برمی‌گردند.
 * با وصل شدن API، بدنه‌ی این توابع به درخواست‌های واقعی تبدیل می‌شود.
 */

/* ───────── ابزارهای مشترک ───────── */
export function currentUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// type: auth | create | update | delete | assign
export function logActivity(type, action, target = "—") {
  db.insert("activity", { user: currentUser()?.name || "سیستم", type, action, target, at: nowISO() });
}

const fill = (tpl, ctx) => tpl.replace(/\{([^}]+)\}/g, (m, k) => ctx[k] ?? m);

// اعلان رویدادها: پیامک (اگر پنل پیامکی فعال باشد) و اعلان داخلی طبق تنظیمات
export function notify(eventKey, ctx = {}) {
  const s = getState();
  const rule = s.notifyRules.find((r) => r.key === eventKey);
  if (!rule) return;
  const text = fill(rule.sample, ctx);
  const at = nowISO();
  if (rule.sms && s.settings.smsPanel) {
    db.insert("notifyLog", { event: rule.label, to: ctx.phone || "—", channel: "sms", status: ctx.phone ? "delivered" : "failed", at, text });
  }
  if (rule.inApp) {
    db.insert("notifyLog", { event: rule.label, to: ctx.customer || "کارکنان", channel: "inapp", status: "delivered", at, text });
    db.insert("inbox", { title: rule.label, text, at, unread: true, to: ctx.link || "/missions" });
  }
}

// ساخت عملیات ثبت/ویرایش/حذف با لاگ برای یک مجموعه‌ی ساده
const crud = (collection, label, nameKey, { before } = {}) => ({
  create(data) {
    before?.("create", null, data);
    const row = db.insert(collection, data);
    logActivity("create", `ثبت ${label}`, row[nameKey]);
    return row;
  },
  update(id, data) {
    before?.("update", db.get(collection, id), data);
    const row = db.update(collection, id, data);
    logActivity("update", `ویرایش ${label}`, row[nameKey]);
    return row;
  },
  remove(id) {
    const row = db.get(collection, id);
    before?.("remove", row);
    db.remove(collection, id);
    logActivity("delete", `حذف ${label}`, row?.[nameKey]);
  },
});

const dup = (collection, field, value, selfId) =>
  db.all(collection).some((r) => r.id !== Number(selfId) && String(r[field]).trim() === String(value).trim());

/* ───────── مشتریان ───────── */
export const customersApi = {
  ...crud("customers", "مشتری", "name", {
    before(kind, row, data) {
      if (kind === "remove") {
        const open = db.all("missions").some((m) => m.customerId === row.id && m.stage !== "closed" && m.status !== "cancelled");
        if (open) throw new Error("این مشتری درخواست باز دارد؛ ابتدا درخواست‌هایش را ببندید.");
      } else if (dup("customers", "phone", data.phone, row?.id)) {
        throw new Error("مشتری‌ای با این شماره تلفن قبلاً ثبت شده است.");
      }
    },
  }),
  create(data) {
    if (dup("customers", "phone", data.phone, null)) throw new Error("مشتری‌ای با این شماره تلفن قبلاً ثبت شده است.");
    const row = db.insert("customers", { ...data, joinedAt: data.joinedAt || daysFromNow(0) });
    logActivity("create", "ثبت مشتری", row.name);
    return row;
  },
};

/* ───────── کارکنان (کاربران پنل) ───────── */
export const staffApi = crud("staff", "کارمند", "name", {
  before(kind, row, data) {
    const all = db.all("staff");
    const managers = all.filter((s) => s.roleKey === "manager" && s.active);
    if (kind === "remove") {
      if (row.id === currentUser()?.id) throw new Error("نمی‌توانید حساب خودتان را حذف کنید.");
      if (row.roleKey === "manager" && managers.length <= 1) throw new Error("حداقل یک مدیر باید باقی بماند.");
      return;
    }
    if (dup("staff", "username", data.username, row?.id)) throw new Error("این نام کاربری قبلاً استفاده شده است.");
    if (kind === "update") {
      const demoting = row.roleKey === "manager" && (data.roleKey !== "manager" || !data.active);
      if (demoting && managers.length <= 1) throw new Error("حداقل یک مدیر فعال باید باقی بماند.");
      if (row.id === currentUser()?.id && !data.active) throw new Error("نمی‌توانید حساب خودتان را غیرفعال کنید.");
    }
  },
});

/* ───────── نصابان ───────── */
export const installersApi = crud("installers", "نصاب", "name", {
  before(kind, row, data) {
    if (kind === "remove") {
      const busy = db.all("missions").some((m) => m.installerId === row.id && ["assigned", "inprogress"].includes(m.stage));
      if (busy) throw new Error("این نصاب ماموریت فعال دارد.");
    } else if (dup("installers", "phone", data.phone, row?.id)) {
      throw new Error("نصابی با این شماره تلفن قبلاً ثبت شده است.");
    }
  },
});

/* ───────── محصولات، دسته‌بندی‌ها، خدمات ───────── */
export const productsApi = crud("products", "محصول", "name");
export const servicesApi = crud("services", "خدمت", "name");
export const categoriesApi = crud("categories", "دسته‌بندی", "name", {
  before(kind, row, data) {
    if (kind === "remove" && db.all("products").some((p) => p.category === row.name)) {
      throw new Error("در این دسته محصول وجود دارد؛ ابتدا محصولات را جابه‌جا کنید.");
    }
    if (kind !== "remove" && dup("categories", "name", data.name, row?.id)) throw new Error("این دسته قبلاً وجود دارد.");
  },
});
// با تغییر نام دسته، محصولات آن هم به‌روز شوند
const baseCategoryUpdate = categoriesApi.update;
categoriesApi.update = (id, data) => {
  const old = db.get("categories", id);
  const row = baseCategoryUpdate(id, data);
  if (old && old.name !== row.name) {
    db.all("products").filter((p) => p.category === old.name).forEach((p) => db.update("products", p.id, { category: row.name }));
  }
  return row;
};

/* ───────── محتوای وبسایت ───────── */
export const pagesApi = crud("pages", "صفحه", "title");
export const articlesApi = crud("articles", "مقاله", "title");
export const newsApi = crud("news", "خبر", "title");
export const slidesApi = crud("slides", "اسلاید", "title");
export const contentApis = { pages: pagesApi, articles: articlesApi, news: newsApi };

/* ───────── ورکشاپ‌ها و ثبت‌نام‌ها ───────── */
const autoStatus = (w) => {
  if (w.status === "done") return w.status;
  return w.enrolled >= w.capacity ? "full" : "open";
};

export const workshopsApi = {
  ...crud("workshops", "ورکشاپ", "title"),
  create(data) {
    const row = db.insert("workshops", { ...data, enrolled: Number(data.enrolled) || 0 });
    db.update("workshops", row.id, { status: autoStatus({ ...row, status: data.status }) });
    logActivity("create", "ثبت ورکشاپ", row.title);
    return row;
  },
  update(id, data) {
    const row = db.update("workshops", id, data);
    db.update("workshops", id, { status: autoStatus(row) });
    logActivity("update", "ویرایش ورکشاپ", row.title);
    return row;
  },
};

function adjustEnrolled(workshopId, delta) {
  const w = db.get("workshops", workshopId);
  if (!w) return;
  const enrolled = Math.max(0, w.enrolled + delta);
  db.update("workshops", w.id, { enrolled, status: autoStatus({ ...w, enrolled }) });
}

export const registrationsApi = {
  create(data) {
    const w = db.get("workshops", data.workshopId);
    if (!w) throw new Error("ورکشاپ را انتخاب کنید.");
    if (data.status === "confirmed" && w.enrolled >= w.capacity) throw new Error("ظرفیت این ورکشاپ تکمیل است.");
    const row = db.insert("registrations", { ...data, createdAt: daysFromNow(0) });
    if (row.status === "confirmed") adjustEnrolled(w.id, 1);
    logActivity("create", "ثبت‌نام در ورکشاپ", `${row.name} ← ${w.title}`);
    return row;
  },
  setStatus(id, status) {
    const r = db.get("registrations", id);
    if (r.status === status) return r;
    const w = db.get("workshops", r.workshopId);
    if (status === "confirmed" && w && w.enrolled >= w.capacity) throw new Error("ظرفیت این ورکشاپ تکمیل است.");
    if (status === "confirmed") adjustEnrolled(r.workshopId, 1);
    if (r.status === "confirmed") adjustEnrolled(r.workshopId, -1);
    const row = db.update("registrations", id, { status });
    logActivity("update", "تغییر وضعیت ثبت‌نام", `${row.name} ← ${status === "confirmed" ? "تأیید" : status === "canceled" ? "لغو" : status}`);
    return row;
  },
  remove(id) {
    const r = db.get("registrations", id);
    if (r.status === "confirmed") adjustEnrolled(r.workshopId, -1);
    db.remove("registrations", id);
    logActivity("delete", "حذف ثبت‌نام", r.name);
  },
};

/* ───────── رزومه‌ها ───────── */
export const resumesApi = {
  approve(id) {
    const r = db.get("resumes", id);
    db.update("resumes", id, { status: "approved" });
    // متقاضی نصاب با تأیید رزومه به فهرست نصابان اضافه می‌شود
    let addedInstaller = false;
    if (r.position.includes("نصاب") && !db.all("installers").some((i) => i.phone === r.phone)) {
      db.insert("installers", { name: r.name, phone: r.phone, city: r.city, rating: 0, doneJobs: 0, online: false });
      addedInstaller = true;
    }
    logActivity("update", "تأیید رزومه", r.name);
    return { addedInstaller };
  },
  reject(id, note = "") {
    const r = db.get("resumes", id);
    db.update("resumes", id, { status: "rejected", note: note || r.note });
    logActivity("update", "رد رزومه", r.name);
  },
};

/* ───────── درخواست‌های خدمات (تیکت) ───────── */
const nextTracking = () => {
  const max = db.all("missions").reduce((m, x) => Math.max(m, Number(String(x.tracking).match(/(\d+)$/)?.[1] || 0)), 100);
  return `MR-${jalaliYear()}-${String(max + 1).padStart(4, "0")}`;
};

const addEvent = (m, text) => [...m.events, { at: nowISO(), text }];

export const missionsApi = {
  create(data) {
    const customer = db.get("customers", data.customerId);
    if (!customer) throw new Error("مشتری را انتخاب کنید.");
    if (customer.status === "blocked") throw new Error("حساب این مشتری مسدود است.");
    const tracking = nextTracking();
    const row = db.insert("missions", {
      ...data,
      customerId: customer.id, customer: customer.name, phone: customer.phone,
      tracking, stage: "registered", status: "pending", installerId: null, installer: null,
      createdAt: nowISO(), rating: null, feedback: "", rejectReason: "",
      events: [{ at: nowISO(), text: data.priority === "urgent" ? "درخواست با اولویت فوری ثبت شد" : "درخواست ثبت شد" }],
    });
    logActivity("create", "ثبت درخواست خدمات", tracking);
    notify("request", { شماره_پیگیری: tracking, phone: customer.phone, customer: customer.name, link: `/missions/${row.id}` });
    return row;
  },

  review(id) {
    const m = db.get("missions", id);
    db.update("missions", id, { stage: "review", events: addEvent(m, "اپراتور بررسی درخواست را آغاز کرد") });
    logActivity("update", "بررسی درخواست", m.tracking);
  },

  assign(id, installerId) {
    const m = db.get("missions", id);
    const inst = db.get("installers", installerId);
    if (!inst) throw new Error("تکنسین را انتخاب کنید.");
    if (m.stage === "closed" || m.status === "cancelled") throw new Error("این درخواست بسته شده است.");
    db.update("missions", id, {
      installerId: inst.id, installer: inst.name, stage: "assigned", status: "assigned", rejectReason: "",
      events: addEvent(m, `اپراتور درخواست را به ${inst.name} ارجاع داد`),
    });
    logActivity("assign", "ارجاع درخواست به تکنسین", `${m.tracking} ← ${inst.name}`);
    notify("dispatch", { شماره_پیگیری: m.tracking, نام_تکنسین: inst.name, phone: m.phone, customer: m.customer, link: `/missions/${m.id}` });
  },

  // پاسخ تکنسین (تا ساخته‌شدن پنل نصابان، اپراتور آن را ثبت می‌کند)
  accept(id) {
    const m = db.get("missions", id);
    db.update("missions", id, { status: "accepted", events: addEvent(m, `${m.installer} ماموریت را پذیرفت`) });
    logActivity("update", "پذیرش ماموریت", m.tracking);
  },
  reject(id, reason) {
    const m = db.get("missions", id);
    db.update("missions", id, {
      status: "rejected", stage: "review", installerId: null, installer: null, rejectReason: reason,
      rejections: [...(m.rejections || []), { installerId: m.installerId, reason, at: nowISO() }],
      events: addEvent(m, `${m.installer} ماموریت را رد کرد: ${reason}`),
    });
    logActivity("update", "رد ماموریت توسط تکنسین", `${m.tracking} • ${m.installer}`);
    db.insert("inbox", { title: "ماموریت رد شد", text: `${m.installer} ماموریت ${m.tracking} را رد کرد`, at: nowISO(), unread: true, to: `/missions/${m.id}` });
  },

  start(id) {
    const m = db.get("missions", id);
    db.update("missions", id, { stage: "inprogress", status: "accepted", events: addEvent(m, "تکنسین به محل رسید و کار آغاز شد") });
    logActivity("update", "شروع کار", m.tracking);
    notify("arrived", { شماره_پیگیری: m.tracking, phone: m.phone, customer: m.customer, link: `/missions/${m.id}` });
  },

  finish(id) {
    const m = db.get("missions", id);
    db.update("missions", id, { stage: "finished", events: addEvent(m, "تکنسین پایان کار را ثبت کرد؛ منتظر تأیید مشتری") });
    logActivity("update", "ثبت پایان کار", m.tracking);
    notify("finished", { شماره_پیگیری: m.tracking, phone: m.phone, customer: m.customer, link: `/missions/${m.id}` });
  },

  close(id, { rating, feedback }) {
    const m = db.get("missions", id);
    db.update("missions", id, {
      stage: "closed", status: "done", rating, feedback,
      events: addEvent(m, "مشتری پایان کار را تأیید و نظرسنجی ثبت کرد"),
    });
    const inst = db.get("installers", m.installerId);
    if (inst) {
      const total = inst.doneJobs + 1;
      const newRating = rating ? Math.round(((inst.rating * inst.doneJobs + rating) / total) * 10) / 10 : inst.rating;
      db.update("installers", inst.id, { doneJobs: total, rating: newRating });
    }
    logActivity("update", "بستن درخواست و ثبت نظرسنجی", m.tracking);
  },

  cancel(id, reason) {
    const m = db.get("missions", id);
    db.update("missions", id, { status: "cancelled", events: addEvent(m, `درخواست لغو شد: ${reason}`) });
    logActivity("update", "لغو درخواست", m.tracking);
  },

  remove(id) {
    const m = db.get("missions", id);
    db.remove("missions", id);
    logActivity("delete", "حذف درخواست", m.tracking);
  },
};

/* ───────── QR کد و پرونده محصول ───────── */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const part = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

export const qrApi = {
  create(data) {
    let code = `MR-${part()}-${part()}`;
    while (db.all("qr").some((q) => q.code === code)) code = `MR-${part()}-${part()}`;
    const row = db.insert("qr", { ...data, code, active: true, repairs: [] });
    logActivity("create", "تولید QR جدید", code);
    return row;
  },
  toggle(id) {
    const q = db.get("qr", id);
    db.update("qr", id, { active: !q.active });
    logActivity("update", q.active ? "غیرفعال‌سازی QR" : "فعال‌سازی QR", q.code);
  },
  addRepair(id, repair) {
    const q = db.get("qr", id);
    db.update("qr", id, { repairs: [...q.repairs, repair] });
    logActivity("update", "ثبت سابقه‌ی تعمیر", `${q.code} • ${repair.title}`);
  },
  remove(id) {
    const q = db.get("qr", id);
    db.remove("qr", id);
    logActivity("delete", "حذف QR", q.code);
  },
};

/* ───────── فاکتور و پرداخت ───────── */
const nextInvoiceNumber = (type) => {
  const prefix = type === "invoice" ? "INV" : "PRO";
  const max = db.all("invoices").filter((i) => i.number.startsWith(prefix)).reduce((m, i) => Math.max(m, Number(i.number.match(/(\d+)$/)?.[1] || 0)), 0);
  return `${prefix}-${jalaliYear()}-${String(max + 1).padStart(4, "0")}`;
};

export const invoicesApi = {
  create(data) {
    const row = db.insert("invoices", { ...data, number: nextInvoiceNumber(data.type), date: daysFromNow(0), linkSent: false });
    logActivity("create", "ثبت فاکتور", row.number);
    return row;
  },
  update(id, data) {
    const old = db.get("invoices", id);
    const row = db.update("invoices", id, { ...data, number: old.type === data.type ? old.number : nextInvoiceNumber(data.type) });
    logActivity("update", "ویرایش فاکتور", row.number);
    return row;
  },
  setPayment(id, payment) {
    const inv = db.get("invoices", id);
    db.update("invoices", id, { payment });
    logActivity("update", "تغییر وضعیت پرداخت", `${inv.number} ← ${payment === "paid" ? "پرداخت‌شده" : payment === "cancelled" ? "لغوشده" : "در انتظار"}`);
  },
  sendLink(id) {
    const inv = db.get("invoices", id);
    db.update("invoices", id, { linkSent: true });
    logActivity("update", "ارسال لینک فاکتور", inv.number);
  },
  remove(id) {
    const inv = db.get("invoices", id);
    db.remove("invoices", id);
    logActivity("delete", "حذف فاکتور", inv.number);
  },
};

/* ───────── تنظیمات، دسترسی‌ها و اعلان‌ها ───────── */
export const settingsApi = {
  save(data) {
    db.set("settings", { ...getState().settings, ...data });
    logActivity("update", "ویرایش تنظیمات سایت");
  },
  resetDemo() {
    db.reset();
  },
};

export const accessApi = {
  save(matrix) {
    db.set("access", matrix);
    logActivity("update", "تغییر سطح دسترسی نقش‌ها");
  },
};

export const notifyApi = {
  save(rules, smsPanel) {
    db.set("notifyRules", rules);
    db.set("settings", { ...getState().settings, smsPanel });
    logActivity("update", "ویرایش تنظیمات اعلان‌ها");
  },
  markAllRead() {
    getState().inbox.filter((n) => n.unread).forEach((n) => db.update("inbox", n.id, { unread: false }));
  },
  markRead(id) {
    db.update("inbox", id, { unread: false });
  },
};

// ویرایش پروفایل کاربر واردشده (نام و رمز)
export const profileApi = {
  update({ name, password }) {
    const me = currentUser();
    const row = db.get("staff", me.id);
    if (!row) throw new Error("حساب شما پیدا نشد.");
    db.update("staff", row.id, { name, ...(password ? { password } : {}) });
    // نام در نشست ذخیره‌شده هم به‌روز شود
    for (const store of [localStorage, sessionStorage]) {
      const raw = store.getItem(AUTH_KEY);
      if (raw) store.setItem(AUTH_KEY, JSON.stringify({ ...JSON.parse(raw), name }));
    }
    logActivity("update", "ویرایش پروفایل");
  },
};

// ابزارهای مشترک نمایش اعداد و تاریخ

export const tofa = (n) => Number(n || 0).toLocaleString("fa-IR");

const dayMonth = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
});

// مثلاً «۲۳ آبان»
export const fmtDayMonth = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : dayMonth.format(d);
};

// حروف اول نام برای آواتار (مثلاً «علی کیوانلو» ← «عک»)
export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");


/* ───────── ارقام فارسی، تاریخ امروز، جستجو ───────── */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

// فقط ارقام لاتین را فارسی می‌کند (برای تلفن، تاریخ‌های متنی و شناسه‌ها)
export const toFaDigits = (v) => String(v ?? "").replace(/[0-9]/g, (d) => FA_DIGITS[d]);

export const toLatinDigits = (v) =>
  String(v ?? "")
    .replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

// یکسان‌سازی متن برای جستجو (ی/ک عربی، ارقام فارسی، حروف)
export const norm = (v) =>
  toLatinDigits(v).replace(/ي/g, "ی").replace(/ك/g, "ک").toLowerCase();

const todayFormat = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

// مثلاً «یکشنبه ۲۳ آبان ۱۴۰۵»
export const todayFa = () => todayFormat.format(new Date());

// «۲۳ آبان ۱۴۰۵» از تاریخ ISO (yyyy-mm-dd)
const fullDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const fmtDate = (isoDate) => {
  if (!isoDate) return "—";
  const s = String(isoDate);
  const d = new Date(s.length === 10 ? `${s}T12:00:00` : s);
  return Number.isNaN(d.getTime()) ? s : fullDate.format(d);
};

// «۲۳ آبان ۱۴۰۵، ۱۴:۳۰» از زمان ISO
const dateTime = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
});
export const fmtDateTime = (isoDate) => {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  return Number.isNaN(d.getTime()) ? String(isoDate) : dateTime.format(d);
};

// سال شمسی برای ساخت شماره‌های پیگیری (مثلاً 1405)
export const jalaliYear = (d = new Date()) =>
  new Intl.DateTimeFormat("en-US-u-ca-persian", { year: "numeric" })
    .formatToParts(d)
    .find((p) => p.type === "year")?.value ?? "1405";

export const nowISO = () => new Date().toISOString();
export const agoISO = (days = 0, hours = 0) =>
  new Date(Date.now() - (days * 24 + hours) * 3600000).toISOString();

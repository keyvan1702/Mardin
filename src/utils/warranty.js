// محاسبه‌ی خودکار وضعیت گارانتی و سرویس دوره‌ای از روی تاریخ نصب

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const iso = (d) => d.toISOString().slice(0, 10);
const at = (isoDate) => new Date(`${isoDate}T12:00:00`);

// تاریخ نسبت به امروز (برای داده‌ی نمایشی که همیشه معتبر بماند)
export const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return iso(d);
};

// { end, days, status: active | expiring (≤ ۳۰ روز) | expired }
export function warrantyInfo(installedAt, months, now = new Date()) {
  const end = addMonths(at(installedAt), months);
  const days = Math.ceil((end - now) / 86400000);
  return { end: iso(end), days, status: days < 0 ? "expired" : days <= 30 ? "expiring" : "active" };
}

// نزدیک‌ترین سرویس دوره‌ای بعدی
export function nextService(installedAt, everyMonths, now = new Date()) {
  let i = 1;
  let d = addMonths(at(installedAt), everyMonths);
  while (d <= now && i < 240) {
    i += 1;
    d = addMonths(at(installedAt), everyMonths * i);
  }
  return iso(d);
}

export const WARRANTY_STATUS = {
  active: { label: "فعال", tone: "success" },
  expiring: { label: "رو به پایان", tone: "gold" },
  expired: { label: "پایان‌یافته", tone: "danger" },
};

import { STATS_BASE } from "./constants";

/* آمار داشبورد از روی داده‌ی زنده + پایه‌ی نمایشی (تا اتصال API) */

const isOpen = (m) => m.stage !== "closed" && m.status !== "cancelled";

export function dashboardStats(s) {
  return {
    openRequests: s.missions.filter(isOpen).length,
    requests: STATS_BASE.requests + s.missions.length,
    customers: STATS_BASE.customers + s.customers.length,
    technicians: STATS_BASE.technicians + s.installers.length,
  };
}

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

const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
};

// تعداد درخواست هر روز: سابقه‌ی نمایشی + درخواست‌های واقعی ثبت‌شده در همان روز
export function requestSeries(missions, days) {
  const rand = mulberry32(days * 7919);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const live = {};
  missions.forEach((m) => {
    const k = dayKey(m.createdAt);
    live[k] = (live[k] || 0) + 1;
  });

  return Array.from({ length: days }, (_, i) => {
    const progress = days === 1 ? 1 : i / (days - 1);
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const base = 9 + 15 * Math.pow(progress, 1.4) + Math.sin(i * 0.9) * 3 + (rand() - 0.5) * 4;
    return { date: date.toISOString(), value: Math.max(2, Math.round(base)) + (live[dayKey(date)] || 0) };
  });
}

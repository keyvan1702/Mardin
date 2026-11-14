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

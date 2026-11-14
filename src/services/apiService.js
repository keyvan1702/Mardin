import { MOCK_USERS, MOCK_STATS, buildSiteStats } from "./mockData";

/**
 * لایه‌ی سرویس. فعلاً همه‌چیز نمایشی است.
 *
 * برای وصل کردن API:
 *   ۱) axios را نصب کن و یک apiClient بساز (مثل پروژه‌ی Stockora: baseURL + اینترسپتور توکن + هندل ۴۰۱)
 *   ۲) بدنه‌ی هر تابع زیر را با یک درخواست واقعی عوض کن
 *   ۳) شکل خروجی توابع را نگه دار تا بقیه‌ی برنامه دست نخورد
 */

export const AUTH_KEY = "mardin_auth";

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // ورود ← { token, user }
  async login({ username, password }) {
    await delay(600);
    const found = MOCK_USERS.find(
      (u) => u.username === username.trim() && u.password === password,
    );
    if (!found) throw new Error("نام کاربری یا رمز عبور درست نیست.");
    const { password: _omit, ...user } = found;
    return { token: `mock-token-${user.id}`, user };
  },

  // شمارنده‌های بالای داشبورد ← { users, products, courses, services }
  async getDashboardStats() {
    await delay();
    return { ...MOCK_STATS };
  },

  // آمار کلی سایت ← [{ date: ISO, value: number }]
  async getSiteStats(days = 30) {
    await delay(350);
    return buildSiteStats(days);
  },
};

// پیام خطا برای نمایش به کاربر
export const apiErrorMessage = (err, fallback = "خطا در ارتباط با سرور") =>
  err?.message || fallback;

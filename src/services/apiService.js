import { getState } from "./store";
import { dashboardStats, requestSeries } from "./stats";

/**
 * لایه‌ی سرویس. فعلاً داده از حافظه‌ی مرورگر (services/store.js) می‌آید.
 *
 * برای وصل کردن API:
 *   ۱) axios را نصب کن و یک apiClient بساز (baseURL + توکن Bearer + هندل ۴۰۱)
 *   ۲) بدنه‌ی توابع این فایل و services/actions.js را با درخواست واقعی عوض کن
 *   ۳) شکل خروجی‌ها را نگه دار تا بقیه‌ی برنامه دست نخورد
 */

export const AUTH_KEY = "mardin_auth";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // ورود با نام کاربری و رمز کارکنان ← { token, user }
  async login({ username, password }) {
    await delay(500);
    const found = getState().staff.find(
      (u) => u.username === username.trim() && u.password === password,
    );
    if (!found) throw new Error("نام کاربری یا رمز عبور درست نیست.");
    if (!found.active) throw new Error("این حساب غیرفعال است. با مدیر تماس بگیرید.");
    return {
      token: `mock-token-${found.id}`,
      user: { id: found.id, name: found.name, role: found.roleKey, username: found.username },
    };
  },

  async getDashboardStats() {
    await delay(200);
    return dashboardStats(getState());
  },

  async getSiteStats(days = 30) {
    await delay(150);
    return requestSeries(getState().missions, days);
  },
};

// پیام خطا برای نمایش به کاربر
export const apiErrorMessage = (err, fallback = "خطا در ارتباط با سرور") =>
  err?.message || fallback;

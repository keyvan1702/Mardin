# ماردین (Mardin)

پنل مدیریت فارسی (RTL) با React + Vite. فعلاً بدون API و با داده‌ی نمایشی.

## اجرا

```bash
npm install
npm run dev
```

ورود نمایشی: `admin` / `1234` (همچنین `operator` و `viewer` با همین رمز)

## ساختار

```
src/
├── main.jsx                 Providerها: Theme → Toast → Data → Router
├── App.jsx                  فقط <Outlet />
├── pages/Maindashboard.jsx  لی‌اوت اصلی (منو + نوار بالا + Outlet Context)
├── component/
│   ├── Routers.jsx          مسیرها + RequireAuth / PublicOnly / RequirePermission
│   ├── Context.jsx          DataProvider (stats, siteStats, range)
│   ├── Login.jsx            ورود + getStoredUser / saveUser / clearUser
│   ├── Rightmenu.jsx        منوی کناری
│   ├── Topbar.jsx           جستجو، تم، اعلان، پروفایل
│   ├── DashboardHome.jsx    صفحه‌ی داشبورد
│   ├── StatCard.jsx · SiteStatsChart.jsx · QuickLinks.jsx
│   ├── ModulePage.jsx       صفحه‌ی موقت بخش‌ها
│   └── ThemeContext.jsx · ToastContext.jsx · Logo.jsx
├── hooks/                   useAsyncAction, usePermissions
├── services/
│   ├── apiService.js        ← تنها جایی که برای وصل کردن API عوض می‌شود
│   └── mockData.js          ← داده‌ی نمایشی (بعداً حذف می‌شود)
└── utils/                   menu.js (منبع تعریف بخش‌ها), permissions.js, format.js
```

## افزودن یک بخش جدید
۱) یک آیتم به `utils/menu.js` اضافه کن (منو، میان‌بر و مسیر خودکار ساخته می‌شوند)
۲) صفحه‌ی واقعی را بساز و در `Routers.jsx` به‌جای `ModulePage` همان بخش بگذار

## وصل کردن API
در `services/apiService.js` بدنه‌ی توابع `api.login`, `api.getDashboardStats`, `api.getSiteStats` را با درخواست واقعی عوض کن؛ شکل خروجی‌ها در کامنت‌ها آمده است.

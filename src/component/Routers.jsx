import {
  createBrowserRouter,
  useOutletContext,
  useLocation,
  Navigate,
} from "react-router-dom";

import App from "../App";
import Maindashboard from "../pages/Maindashboard";
import DashboardHome from "./DashboardHome";
import ModulePage from "./ModulePage";
import Login, { getStoredUser, clearUser } from "./Login";

import CustomersList from "../pages/CustomersList";
import CustomerForm from "../pages/CustomerForm";
import MissionForm from "../pages/MissionForm";
import StaffList from "../pages/StaffList";
import StaffInstallers from "../pages/StaffInstallers";
import RolesAccess from "../pages/RolesAccess";
import MissionsList from "../pages/MissionsList";
import MissionDetail from "../pages/MissionDetail";
import MissionsAssign from "../pages/MissionsAssign";
import MissionsHistory from "../pages/MissionsHistory";
import WorkshopsList from "../pages/WorkshopsList";
import WorkshopsRegistrations from "../pages/WorkshopsRegistrations";
import ResumesList from "../pages/ResumesList";
import ProductsList from "../pages/ProductsList";
import ProductsCategories from "../pages/ProductsCategories";
import QrList from "../pages/QrList";
import QrDetail from "../pages/QrDetail";
import WarrantiesList from "../pages/WarrantiesList";
import ServicesList from "../pages/ServicesList";
import PagesList from "../pages/PagesList";
import ArticlesList from "../pages/ArticlesList";
import SiteNews from "../pages/SiteNews";
import SiteSlider from "../pages/SiteSlider";
import ContentForm from "../pages/ContentForm";
import InvoicesList from "../pages/InvoicesList";
import InvoiceForm from "../pages/InvoiceForm";
import ReportTechnicians from "../pages/ReportTechnicians";
import ReportFaults from "../pages/ReportFaults";
import ActivityLog from "../pages/ActivityLog";
import SettingsGeneral from "../pages/SettingsGeneral";
import NotificationsSettings from "../pages/NotificationsSettings";
import SettingsProfile from "../pages/SettingsProfile";

import usePermissions from "../hooks/usePermissions";
import { MENU_ITEMS, firstPath } from "../utils/menu";

function hasValidSession() {
  const user = getStoredUser();
  const ok = !!user && typeof user.token === "string" && user.token.trim() !== "";
  if (!ok && user) clearUser();
  return ok;
}

function RequireAuth({ children }) {
  const location = useLocation();
  if (!hasValidSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function PublicOnly({ children }) {
  if (hasValidSession()) return <Navigate to="/" replace />;
  return children;
}

// دسترسی بر اساس «بخش» و نقش (utils/permissions.js)؛ edit: نیاز به دسترسی کامل
function RequireModule({ module, edit: needsEdit, children }) {
  const { access, edit } = usePermissions();
  if (module && !access(module)) return <Navigate to="/" replace />;
  if (module && needsEdit && !edit(module)) return <Navigate to="/" replace />;
  return children;
}

function DashboardRoute() {
  const { stats, siteStats, range, chartLoading, error, actions } = useOutletContext();
  return (
    <DashboardHome
      stats={stats}
      siteStats={siteStats}
      range={range}
      chartLoading={chartLoading}
      error={error}
      onRangeChange={actions.setRange}
      onRetry={actions.refreshAll}
    />
  );
}

// صفحه‌های واقعی؛ module = بخش دسترسی، edit = فقط با دسترسی «کامل»
const STATIC_ROUTES = [
  // مشتریان
  { path: "customers", element: <CustomersList />, module: "customers" },
  { path: "customers/new", element: <CustomerForm />, module: "customers", edit: true },
  { path: "customers/:id", element: <CustomerForm />, module: "customers", edit: true },

  // کارکنان و نصابان
  { path: "staff", element: <StaffList />, module: "staff" },
  { path: "staff/installers", element: <StaffInstallers />, module: "installers" },
  { path: "staff/roles", element: <RolesAccess />, module: "roles" },

  // درخواست‌های خدمات (تیکت)
  { path: "missions", element: <MissionsList />, module: "missions" },
  { path: "missions/new", element: <MissionForm />, module: "missions", edit: true },
  { path: "missions/assign", element: <MissionsAssign />, module: "missions", edit: true },
  { path: "missions/history", element: <MissionsHistory />, module: "missions" },
  { path: "missions/:id", element: <MissionDetail />, module: "missions" },

  // محصولات، QR و گارانتی
  { path: "products", element: <ProductsList />, module: "products" },
  { path: "products/categories", element: <ProductsCategories />, module: "products" },
  { path: "products/qr", element: <QrList />, module: "qr" },
  { path: "products/qr/:id", element: <QrDetail />, module: "qr" },
  { path: "products/warranties", element: <WarrantiesList />, module: "warranty" },

  // خدمات
  { path: "services", element: <ServicesList />, module: "services" },

  // دوره‌ها و ورکشاپ‌ها
  { path: "registrations/workshops", element: <WorkshopsList />, module: "courses" },
  { path: "registrations/workshops/registrations", element: <WorkshopsRegistrations />, module: "courses" },
  { path: "registrations/resumes", element: <ResumesList />, module: "courses" },

  // محتوای وبسایت
  { path: "site-content/pages", element: <PagesList />, module: "content" },
  { path: "site-content/articles", element: <ArticlesList />, module: "content" },
  { path: "site-content/news", element: <SiteNews />, module: "content" },
  { path: "site-content/slider", element: <SiteSlider />, module: "content" },
  { path: "site-content/:type/:id", element: <ContentForm />, module: "content", edit: true },

  // فاکتور و پرداخت
  { path: "finance", element: <InvoicesList />, module: "invoices" },
  { path: "finance/new", element: <InvoiceForm />, module: "invoices", edit: true },
  { path: "finance/:id", element: <InvoiceForm />, module: "invoices", edit: true },

  // گزارش‌ها
  { path: "reports", element: <ReportTechnicians />, module: "reports" },
  { path: "reports/faults", element: <ReportFaults />, module: "reports" },
  { path: "reports/activity", element: <ActivityLog />, module: "activity" },

  // تنظیمات
  { path: "settings", element: <SettingsGeneral />, module: "settings" },
  { path: "settings/notifications", element: <NotificationsSettings />, module: "notifications" },
  { path: "settings/profile", element: <SettingsProfile />, module: "profile" },
];

const implementedPaths = new Set(STATIC_ROUTES.map((r) => r.path));
const moduleRoutes = [];
for (const item of MENU_ITEMS) {
  if (item.key === "dashboard") continue;
  // مسیر پایه‌ی گروه (مثلاً /registrations) اگر صفحه‌ی خودش را ندارد، به اولین زیرمنو برود
  if (item.children?.length && !implementedPaths.has(item.path.slice(1))) {
    moduleRoutes.push({ path: item.path.slice(1), element: <Navigate to={firstPath(item)} replace /> });
  }
  const leaves = item.children?.length ? item.children : [item];
  for (const leaf of leaves) {
    const p = leaf.path.slice(1);
    if (implementedPaths.has(p)) continue;
    moduleRoutes.push({
      path: p,
      element: (
        <RequireModule module={leaf.module ?? item.module}>
          <ModulePage itemKey={leaf.key} />
        </RequireModule>
      ),
    });
  }
}

const Routers = createBrowserRouter([
  {
    path: "/login",
    element: <PublicOnly><Login /></PublicOnly>,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <RequireAuth><Maindashboard /></RequireAuth>,
        children: [
          { path: "", element: <DashboardRoute /> },
          ...STATIC_ROUTES.map((r) => ({
            path: r.path,
            element: <RequireModule module={r.module} edit={r.edit}>{r.element}</RequireModule>,
          })),
          ...moduleRoutes,
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default Routers;

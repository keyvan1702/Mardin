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
import StaffList from "../pages/StaffList";
import StaffInstallers from "../pages/StaffInstallers";
import MissionsList from "../pages/MissionsList";
import MissionsAssign from "../pages/MissionsAssign";
import MissionsHistory from "../pages/MissionsHistory";
import WorkshopsList from "../pages/WorkshopsList";
import WorkshopsRegistrations from "../pages/WorkshopsRegistrations";
import ResumesList from "../pages/ResumesList";
import ProductsList from "../pages/ProductsList";
import ProductsCategories from "../pages/ProductsCategories";
import SiteSlider from "../pages/SiteSlider";
import SiteNews from "../pages/SiteNews";
import ServicesList from "../pages/ServicesList";
import SettingsGeneral from "../pages/SettingsGeneral";
import SettingsAccess from "../pages/SettingsAccess";
import SettingsProfile from "../pages/SettingsProfile";

import usePermissions from "../hooks/usePermissions";
import { can } from "../utils/permissions";
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

function RequirePermission({ permission, children }) {
  const { role } = usePermissions();
  if (permission && !can(role, permission)) return <Navigate to="/" replace />;
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

// صفحه‌های واقعی استاتیک
const STATIC_ROUTES = [
  // مشتریان
  { path: "customers", element: <CustomersList />, perm: "manageUsers" },
  { path: "customers/new", element: <CustomerForm />, perm: "manageUsers" },

  // کارکنان
  { path: "staff", element: <StaffList />, perm: "manageUsers" },
  { path: "staff/installers", element: <StaffInstallers />, perm: "manageUsers" },

  // ماموریت‌ها
  { path: "missions", element: <MissionsList /> },
  { path: "missions/assign", element: <MissionsAssign /> },
  { path: "missions/history", element: <MissionsHistory /> },

  // ثبت‌نام‌ها
  { path: "registrations/workshops", element: <WorkshopsList /> },
  { path: "registrations/workshops/registrations", element: <WorkshopsRegistrations /> },
  { path: "registrations/resumes", element: <ResumesList /> },

  // محصولات
  { path: "products", element: <ProductsList /> },
  { path: "products/categories", element: <ProductsCategories /> },

  // بخش عمومی سایت
  { path: "site-content/slider", element: <SiteSlider /> },
  { path: "site-content/news", element: <SiteNews /> },

  // خدمات
  { path: "services", element: <ServicesList /> },

  // تنظیمات
  { path: "settings", element: <SettingsGeneral />, perm: "write" },
  { path: "settings/access", element: <SettingsAccess />, perm: "manageUsers" },
  { path: "settings/profile", element: <SettingsProfile /> },
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
        <RequirePermission permission={leaf.perm || item.perm}>
          <ModulePage itemKey={leaf.key} />
        </RequirePermission>
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
            element: <RequirePermission permission={r.perm}>{r.element}</RequirePermission>,
          })),
          ...moduleRoutes,
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default Routers;
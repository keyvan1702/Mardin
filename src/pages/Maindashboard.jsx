import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Rightmenu from "../component/Rightmenu";
import Topbar from "../component/Topbar";
import { useData } from "../component/Context";

const Maindashboard = () => {
  const location = useLocation();
  const { stats, siteStats, range, loading, chartLoading, error, setRange, refreshAll, resetData } =
    useData();
  const [menuOpen, setMenuOpen] = useState(false);

  // داده‌ها فقط بعد از ورود (وقتی داشبورد باز می‌شود) دریافت می‌شوند
  useEffect(() => {
    refreshAll();
    return () => resetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // با تغییر مسیر، منوی موبایل بسته شود
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="shell">
      <Rightmenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="shellmain">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="shellcontent">
          <Outlet
            context={{
              stats,
              siteStats,
              range,
              loading,
              chartLoading,
              error,
              actions: { setRange, refreshAll },
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Maindashboard;

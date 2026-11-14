import React from "react";
import { LuUsers, LuPackage, LuGraduationCap, LuHeadphones } from "react-icons/lu";
import StatCard from "./StatCard";
import SiteStatsChart from "./SiteStatsChart";
import QuickLinks from "./QuickLinks";

const STAT_CARDS = [
  { key: "customers", label: "مشتریان", icon: LuUsers, tone: "gold" },
  { key: "products", label: "محصولات", icon: LuPackage, tone: "slate" },
  { key: "workshops", label: "ورکشاپ‌ها", icon: LuGraduationCap, tone: "gold" },
  { key: "services", label: "خدمات", icon: LuHeadphones, tone: "slate" },
];

const DashboardHome = ({ stats, siteStats, range, chartLoading, error, onRangeChange, onRetry }) => (
  <div className="dashboardhome">
    <h1 className="pagetitle">
      <span>داشبورد مدیریت</span>
    </h1>

    {error && (
      <div className="errorbanner" role="alert">
        <span>{error}</span>
        <button type="button" className="btnghost" onClick={onRetry}>
          تلاش دوباره
        </button>
      </div>
    )}

    <section className="statgrid" aria-label="شمارنده‌ها">
      {STAT_CARDS.map((c) => (
        <StatCard
          key={c.key}
          icon={c.icon}
          label={c.label}
          tone={c.tone}
          value={stats ? stats[c.key] : null}
        />
      ))}
    </section>

    <SiteStatsChart
      data={siteStats}
      range={range}
      loading={chartLoading}
      onRangeChange={onRangeChange}
    />

    <QuickLinks />
  </div>
);

export default DashboardHome;

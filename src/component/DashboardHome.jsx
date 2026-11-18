import React from "react";
import { Link } from "react-router-dom";
import { LuInbox, LuClipboardList, LuUsers, LuWrench, LuArrowLeft } from "react-icons/lu";
import StatCard from "./StatCard";
import SiteStatsChart from "./SiteStatsChart";
import QuickLinks from "./QuickLinks";
import PageHeader from "./ui/PageHeader";
import Panel from "./ui/Panel";
import Badge from "./table/Badge";
import usePermissions from "../hooks/usePermissions";
import { useStore } from "../services/store";
import { PRIORITY } from "../services/constants";
import { dashboardStats, requestSeries } from "../services/stats";
import { warrantyInfo } from "../utils/warranty";
import { todayFa, toFaDigits, tofa } from "../utils/format";

// آمار درخواست‌ها، تکنسین‌ها و مشتریان (پیوست قرارداد، داشبورد آماری)
const STAT_CARDS = [
  { key: "openRequests", label: "درخواست‌های باز", icon: LuInbox, tone: "gold" },
  { key: "requests", label: "کل درخواست‌ها", icon: LuClipboardList, tone: "slate" },
  { key: "customers", label: "مشتریان", icon: LuUsers, tone: "gold" },
  { key: "technicians", label: "تکنسین‌ها", icon: LuWrench, tone: "slate" },
];

const RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

const DashboardHome = ({ range, error, onRangeChange, onRetry }) => {
  const { access, edit } = usePermissions();
  // همه‌ی آمار از داده‌ی زنده‌ی پنل محاسبه می‌شود؛ با هر تغییر خودکار به‌روز می‌شود
  const missions = useStore((s) => s.missions);
  const customers = useStore((s) => s.customers);
  const installers = useStore((s) => s.installers);
  const qrs = useStore((s) => s.qr);
  const stats = dashboardStats({ missions, customers, installers });
  const siteStats = requestSeries(missions, range);

  // درخواست‌هایی که هنوز تکنسین ندارند یا رد شده‌اند
  const attention = missions.filter((m) => !m.installerId && m.stage !== "closed" && m.status !== "cancelled")
    .sort((a, b) => RANK[a.priority] - RANK[b.priority])
    .slice(0, 4);

  // گارانتی‌هایی که در ۳۰ روز آینده تمام می‌شوند
  const expiring = qrs.map((q) => ({ ...q, w: warrantyInfo(q.installedAt, q.warrantyMonths) }))
    .filter((q) => q.active && q.w.status === "expiring")
    .sort((a, b) => a.w.days - b.w.days)
    .slice(0, 4);

  return (
    <div className="dashboardhome">
      <PageHeader title="داشبورد مدیریت" subtitle={todayFa()} />

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
          <StatCard key={c.key} icon={c.icon} label={c.label} tone={c.tone} value={stats[c.key]} />
        ))}
      </section>

      <SiteStatsChart data={siteStats} range={range} loading={false} onRangeChange={onRangeChange} />

      {(access("missions") || access("warranty")) && (
        <div className="twocol">
          {access("missions") && (
            <Panel
              title="نیازمند اقدام"
              hint="درخواست‌های بدون تکنسین؛ فوری‌ها اول"
              actions={
                <Link to="/missions" className="textlink">
                  همه‌ی درخواست‌ها
                </Link>
              }
            >
              {attention.length === 0 ? (
                <p className="muted">درخواستی منتظر اقدام نیست.</p>
              ) : (
                <ul className="worklist">
                  {attention.map((m) => (
                    <li key={m.id}>
                      <div className="worklisttext">
                        <strong>{m.service}</strong>
                        <span className="muted">
                          {m.customer} • <span dir="ltr">{toFaDigits(m.tracking)}</span>
                        </span>
                      </div>
                      <Badge tone={PRIORITY[m.priority].tone}>{PRIORITY[m.priority].label}</Badge>
                      <Link
                        to={edit("missions") ? "/missions/assign" : `/missions/${m.id}`}
                        className="btnicon"
                        aria-label={edit("missions") ? "اختصاص تکنسین" : "مشاهده"}
                        title={edit("missions") ? "اختصاص تکنسین" : "مشاهده"}
                      >
                        <LuArrowLeft />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {access("warranty") && (
            <Panel
              title="گارانتی‌های رو به پایان"
              hint="تا ۳۰ روز آینده"
              actions={
                <Link to="/products/warranties" className="textlink">
                  همه‌ی گارانتی‌ها
                </Link>
              }
            >
              {expiring.length === 0 ? (
                <p className="muted">گارانتی‌ای در آستانه‌ی پایان نیست.</p>
              ) : (
                <ul className="worklist">
                  {expiring.map((q) => (
                    <li key={q.id}>
                      <div className="worklisttext">
                        <strong>{q.product}</strong>
                        <span className="muted">{q.customer}</span>
                      </div>
                      <Badge tone="gold">{tofa(q.w.days)} روز</Badge>
                      <Link to={`/products/qr/${q.id}`} className="btnicon" aria-label="پرونده محصول" title="پرونده محصول">
                        <LuArrowLeft />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      )}

      <QuickLinks />
    </div>
  );
};

export default DashboardHome;

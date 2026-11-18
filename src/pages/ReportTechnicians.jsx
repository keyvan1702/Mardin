import React, { useMemo } from "react";
import { LuCircleCheck, LuStar, LuTimer, LuCircleX } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import Panel from "../component/ui/Panel";
import BarList from "../component/ui/BarList";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import { useCollection } from "../services/store";
import { REPORT_BASE } from "../services/constants";
import { toFaDigits, tofa } from "../utils/format";

// گزارش عملکرد تکنسین‌ها از روی نصابان و درخواست‌های واقعی
const ReportTechnicians = () => {
  const installers = useCollection("installers");
  const missions = useCollection("missions");

  const rows = useMemo(
    () =>
      installers.map((i) => ({
        id: i.id,
        name: i.name,
        done: i.doneJobs,
        rating: i.rating,
        active: missions.filter((m) => m.installerId === i.id && ["assigned", "inprogress"].includes(m.stage)).length,
        rejected: missions.reduce((s, m) => s + (m.rejections || []).filter((r) => r.installerId === i.id).length, 0),
        avgHours: REPORT_BASE.avgHours[i.name] ?? null,
      })),
    [installers, missions],
  );

  const rated = rows.filter((r) => r.rating > 0);
  const avgRating = rated.reduce((s, r) => s + r.rating, 0) / (rated.length || 1);
  const withHours = rows.filter((r) => r.avgHours);
  const avgHours = withHours.reduce((s, r) => s + r.avgHours, 0) / (withHours.length || 1);

  const columns = [
    { key: "name", header: "تکنسین", render: (r) => <Person name={r.name} /> },
    { key: "done", header: "ماموریت انجام‌شده", render: (r) => tofa(r.done) },
    { key: "active", header: "در جریان", render: (r) => tofa(r.active) },
    { key: "avgHours", header: "میانگین زمان انجام", render: (r) => (r.avgHours ? `${toFaDigits(r.avgHours.toFixed(1))} ساعت` : "—") },
    { key: "rating", header: "امتیاز مشتریان", render: (r) => (r.rating > 0 ? <span className="rating"><LuStar /> {toFaDigits(r.rating.toFixed(1))}</span> : "—") },
    { key: "rejected", header: "رد ماموریت", render: (r) => tofa(r.rejected) },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="عملکرد تکنسین‌ها" subtitle="بر اساس ماموریت‌های بسته‌شده و امتیاز مشتریان" />
      <StatStrip
        items={[
          { label: "ماموریت انجام‌شده", value: rows.reduce((s, r) => s + r.done, 0), icon: LuCircleCheck, tone: "success" },
          { label: "میانگین امتیاز", value: rated.length ? toFaDigits(avgRating.toFixed(1)) : "—", icon: LuStar, tone: "gold" },
          { label: "میانگین زمان انجام", value: withHours.length ? `${toFaDigits(avgHours.toFixed(1))} ساعت` : "—", icon: LuTimer, tone: "info" },
          { label: "ماموریت ردشده", value: rows.reduce((s, r) => s + r.rejected, 0), icon: LuCircleX, tone: "danger" },
        ]}
      />
      <div className="twocol">
        <Panel title="تعداد ماموریت انجام‌شده" hint="تکنسین‌ها به ترتیب بیشترین کار">
          <BarList items={[...rows].sort((a, b) => b.done - a.done).map((r) => ({ label: r.name, value: r.done }))} unit="ماموریت" />
        </Panel>
        <Panel title="میانگین امتیاز" hint="امتیاز ثبت‌شده‌ی مشتریان پس از پایان کار">
          <BarList items={[...rated].sort((a, b) => b.rating - a.rating).map((r) => ({ label: r.name, value: r.rating }))} />
        </Panel>
      </div>
      <DataTable columns={columns} rows={rows} empty="تکنسینی ثبت نشده است." footer={`${tofa(rows.length)} تکنسین`} />
    </div>
  );
};

export default ReportTechnicians;

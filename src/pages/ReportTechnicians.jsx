import React from "react";
import { LuCircleCheck, LuStar, LuTimer, LuCircleX } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import Panel from "../component/ui/Panel";
import BarList from "../component/ui/BarList";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import { MOCK_TECH_REPORT } from "../services/mockData";
import { toFaDigits, tofa } from "../utils/format";

const avg = (k) => MOCK_TECH_REPORT.reduce((s, r) => s + r[k], 0) / MOCK_TECH_REPORT.length;

// گزارش عملکرد تکنسین‌ها (۳۰ روز اخیر)
const ReportTechnicians = () => {
  const columns = [
    { key: "name", header: "تکنسین", render: (r) => <Person name={r.name} /> },
    { key: "done", header: "ماموریت انجام‌شده", render: (r) => tofa(r.done) },
    { key: "avgHours", header: "میانگین زمان انجام", render: (r) => `${toFaDigits(r.avgHours.toFixed(1))} ساعت` },
    {
      key: "rating",
      header: "امتیاز مشتریان",
      render: (r) => (
        <span className="rating">
          <LuStar /> {toFaDigits(r.rating.toFixed(1))}
        </span>
      ),
    },
    { key: "onTime", header: "به‌موقع", render: (r) => `${tofa(r.onTime)}٪` },
    { key: "rejectRate", header: "نرخ رد ماموریت", render: (r) => `${tofa(r.rejectRate)}٪` },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="عملکرد تکنسین‌ها" subtitle="خلاصه‌ی ۳۰ روز اخیر بر اساس ماموریت‌های بسته‌شده" />
      <StatStrip
        items={[
          { label: "ماموریت انجام‌شده", value: MOCK_TECH_REPORT.reduce((s, r) => s + r.done, 0), icon: LuCircleCheck, tone: "success" },
          { label: "میانگین امتیاز", value: toFaDigits(avg("rating").toFixed(1)), icon: LuStar, tone: "gold" },
          { label: "میانگین زمان انجام", value: `${toFaDigits(avg("avgHours").toFixed(1))} ساعت`, icon: LuTimer, tone: "info" },
          { label: "نرخ رد ماموریت", value: `${tofa(Math.round(avg("rejectRate")))}٪`, icon: LuCircleX, tone: "danger" },
        ]}
      />
      <div className="twocol">
        <Panel title="تعداد ماموریت انجام‌شده" hint="تکنسین‌ها به ترتیب بیشترین کار">
          <BarList
            items={[...MOCK_TECH_REPORT].sort((a, b) => b.done - a.done).map((r) => ({ label: r.name, value: r.done }))}
            unit="ماموریت"
          />
        </Panel>
        <Panel title="میانگین امتیاز" hint="امتیاز ثبت‌شده‌ی مشتریان پس از پایان کار">
          <BarList
            items={[...MOCK_TECH_REPORT].sort((a, b) => b.rating - a.rating).map((r) => ({ label: r.name, value: r.rating }))}
          />
        </Panel>
      </div>
      <DataTable columns={columns} rows={MOCK_TECH_REPORT} footer={`${tofa(MOCK_TECH_REPORT.length)} تکنسین`} />
    </div>
  );
};

export default ReportTechnicians;

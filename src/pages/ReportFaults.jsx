import React, { useMemo } from "react";
import { LuTriangleAlert, LuWrench } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import Panel from "../component/ui/Panel";
import BarList from "../component/ui/BarList";
import { useCollection } from "../services/store";
import { FAULTS, REPORT_BASE } from "../services/constants";

// پرتکرارترین خرابی‌ها و خدمات: سابقه‌ی نمایشی + درخواست‌های ثبت‌شده در پنل
const ReportFaults = () => {
  const missions = useCollection("missions");

  const faults = useMemo(() => {
    const counts = { ...REPORT_BASE.faults };
    missions.forEach((m) => { if (m.fault && m.fault !== "other") counts[m.fault] = (counts[m.fault] || 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({ label: FAULTS[k], value: v })).sort((a, b) => b.value - a.value);
  }, [missions]);

  const services = useMemo(() => {
    const counts = { ...REPORT_BASE.services };
    missions.forEach((m) => { counts[m.service] = (counts[m.service] || 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [missions]);

  return (
    <div className="modulepage">
      <PageHeader title="خرابی‌ها و خدمات پرتکرار" subtitle="از روی درخواست‌های ثبت‌شده؛ با ثبت درخواست جدید این آمار هم به‌روز می‌شود" />
      <StatStrip
        items={[
          { label: "پرتکرارترین خرابی", value: faults[0]?.label ?? "—", icon: LuTriangleAlert, tone: "danger" },
          { label: "پرتکرارترین خدمت", value: services[0]?.label ?? "—", icon: LuWrench, tone: "gold" },
        ]}
      />
      <div className="twocol">
        <Panel title="پرتکرارترین خرابی‌ها" hint="بر اساس «نوع خرابی» ثبت‌شده در درخواست‌ها">
          <BarList items={faults.slice(0, 6)} unit="مورد" />
        </Panel>
        <Panel title="پرتکرارترین خدمات" hint="خدماتی که بیشتر درخواست شده‌اند">
          <BarList items={services} unit="درخواست" />
        </Panel>
      </div>
    </div>
  );
};

export default ReportFaults;

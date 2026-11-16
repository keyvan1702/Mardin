import React from "react";
import { LuTriangleAlert, LuWrench } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import Panel from "../component/ui/Panel";
import BarList from "../component/ui/BarList";
import { MOCK_FAULTS, MOCK_TOP_SERVICES } from "../services/mockData";

// پرتکرارترین خرابی‌ها و خدمات
const ReportFaults = () => (
  <div className="modulepage">
    <PageHeader title="خرابی‌ها و خدمات پرتکرار" subtitle="از روی درخواست‌های ثبت‌شده در ۳۰ روز اخیر" />
    <StatStrip
      items={[
        { label: "پرتکرارترین خرابی", value: MOCK_FAULTS[0].title, icon: LuTriangleAlert, tone: "danger" },
        { label: "پرتکرارترین خدمت", value: MOCK_TOP_SERVICES[0].title, icon: LuWrench, tone: "gold" },
      ]}
    />
    <div className="twocol">
      <Panel title="پرتکرارترین خرابی‌ها" hint="بر اساس توضیح مشتری و گزارش تکنسین">
        <BarList items={MOCK_FAULTS.map((f) => ({ label: f.title, value: f.count }))} unit="مورد" />
      </Panel>
      <Panel title="پرتکرارترین خدمات" hint="خدماتی که بیشتر درخواست شده‌اند">
        <BarList items={MOCK_TOP_SERVICES.map((f) => ({ label: f.title, value: f.count }))} unit="درخواست" />
      </Panel>
    </div>
  </div>
);

export default ReportFaults;

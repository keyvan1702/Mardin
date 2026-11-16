import React, { useMemo, useState } from "react";
import { LuWrench, LuWifi, LuStar, LuActivity } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_INSTALLERS } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const StaffInstallers = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_INSTALLERS.filter(
      (i) =>
        (tab === "all" || (tab === "online") === i.online) &&
        (!q || norm(i.name).includes(q) || norm(i.city).includes(q)),
    );
  }, [query, tab]);

  const online = MOCK_INSTALLERS.filter((i) => i.online).length;
  const avg = MOCK_INSTALLERS.reduce((s, i) => s + i.rating, 0) / (MOCK_INSTALLERS.length || 1);
  const activeJobs = MOCK_INSTALLERS.reduce((s, i) => s + i.activeMissions, 0);

  const columns = [
    { key: "name", header: "نصاب", render: (r) => <Person name={r.name} sub={toFaDigits(r.phone)} subLtr /> },
    { key: "city", header: "شهر" },
    {
      key: "rating",
      header: "امتیاز",
      render: (r) => (
        <span className="rating">
          <LuStar /> {toFaDigits(r.rating.toFixed(1))}
        </span>
      ),
    },
    { key: "doneJobs", header: "ماموریت انجام‌شده", render: (r) => tofa(r.doneJobs) },
    { key: "activeMissions", header: "در حال انجام", render: (r) => tofa(r.activeMissions) },
    {
      key: "online",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.online ? "success" : "slate"}>{r.online ? "آنلاین" : "آفلاین"}</Badge>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="نصاب‌ها" subtitle="نصاب‌های فعال، امتیاز و بار کاری آن‌ها" />
      <StatStrip
        items={[
          { label: "همه‌ی نصاب‌ها", value: MOCK_INSTALLERS.length, icon: LuWrench, tone: "gold" },
          { label: "آنلاین", value: online, icon: LuWifi, tone: "success" },
          { label: "میانگین امتیاز", value: toFaDigits(avg.toFixed(1)), icon: LuStar, tone: "gold" },
          { label: "ماموریت در جریان", value: activeJobs, icon: LuActivity, tone: "info" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["online", "آنلاین"],
            ["offline", "آفلاین"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام یا شهر..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="نصابی پیدا نشد." footer={`${tofa(rows.length)} نصاب`} />
    </div>
  );
};

export default StaffInstallers;

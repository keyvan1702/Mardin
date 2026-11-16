import React, { useMemo, useState } from "react";
import PageHeader from "../component/ui/PageHeader";
import FilterTabs from "../component/ui/FilterTabs";
import SearchBox from "../component/ui/SearchBox";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_REGISTRATIONS } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const STATUS = {
  confirmed: { label: "تأییدشده", tone: "success" },
  prereg: { label: "پیش‌ثبت‌نام", tone: "info" },
  pending: { label: "در انتظار", tone: "gold" },
  canceled: { label: "لغوشده", tone: "danger" },
};

const WorkshopsRegistrations = () => {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_REGISTRATIONS.filter(
      (r) =>
        (tab === "all" || r.status === tab) &&
        (!q || norm(r.customer).includes(q) || norm(r.workshop).includes(q) || norm(r.phone).includes(q)),
    );
  }, [tab, query]);

  const n = (s) => MOCK_REGISTRATIONS.filter((r) => r.status === s).length;

  const columns = [
    {
      key: "customer",
      header: "ثبت‌نام‌کننده",
      render: (r) => <Person name={r.customer} sub={toFaDigits(r.phone)} subLtr />,
    },
    { key: "workshop", header: "ورکشاپ" },
    { key: "date", header: "تاریخ ثبت‌نام", render: (r) => <span dir="ltr">{toFaDigits(r.date)}</span> },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="ثبت‌نام و پیش‌ثبت‌نام" subtitle="ثبت‌نام‌شدگان و پیش‌ثبت‌نام‌کنندگان ورکشاپ‌ها" />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه", MOCK_REGISTRATIONS.length],
            ["confirmed", "تأییدشده", n("confirmed")],
            ["prereg", "پیش‌ثبت‌نام", n("prereg")],
            ["pending", "در انتظار", n("pending")],
            ["canceled", "لغوشده", n("canceled")],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، تلفن یا ورکشاپ..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="ثبت‌نامی پیدا نشد." footer={`${tofa(rows.length)} ثبت‌نام`} />
    </div>
  );
};

export default WorkshopsRegistrations;

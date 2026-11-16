import React, { useMemo, useState } from "react";
import { LuUsers, LuUserCheck, LuUserMinus, LuUserX } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import RowActions from "../component/ui/RowActions";
import AddAction from "../component/ui/AddAction";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_CUSTOMERS } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const STATUS = {
  active: { label: "فعال", tone: "success" },
  inactive: { label: "غیرفعال", tone: "slate" },
  blocked: { label: "مسدود", tone: "danger" },
};

const count = (s) => MOCK_CUSTOMERS.filter((c) => c.status === s).length;

const CustomersList = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_CUSTOMERS.filter(
      (c) =>
        (tab === "all" || c.status === tab) &&
        (!q || norm(c.name).includes(q) || norm(c.phone).includes(q) || norm(c.city).includes(q)),
    );
  }, [query, tab]);

  const columns = [
    {
      key: "name",
      header: "مشتری",
      render: (r) => <Person name={r.name} sub={toFaDigits(r.phone)} subLtr />,
    },
    { key: "city", header: "شهر" },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    {
      key: "joinedAt",
      header: "تاریخ عضویت",
      render: (r) => <span dir="ltr">{toFaDigits(r.joinedAt)}</span>,
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="customers" label={r.name} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="مدیریت مشتریان"
        subtitle="مشتریان ثبت‌شده، وضعیت و اطلاعات تماس آن‌ها"
        actions={<AddAction module="customers" to="/customers/new">افزودن مشتری</AddAction>}
      />

      <StatStrip
        items={[
          { label: "همه‌ی مشتریان", value: MOCK_CUSTOMERS.length, icon: LuUsers, tone: "gold" },
          { label: "فعال", value: count("active"), icon: LuUserCheck, tone: "success" },
          { label: "غیرفعال", value: count("inactive"), icon: LuUserMinus, tone: "slate" },
          { label: "مسدود", value: count("blocked"), icon: LuUserX, tone: "danger" },
        ]}
      />

      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["active", "فعال"],
            ["inactive", "غیرفعال"],
            ["blocked", "مسدود"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، تلفن یا شهر..." />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        empty="مشتری‌ای با این مشخصات پیدا نشد."
        footer={`${tofa(rows.length)} مشتری`}
      />
    </div>
  );
};

export default CustomersList;

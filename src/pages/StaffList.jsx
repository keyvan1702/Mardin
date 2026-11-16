import React, { useMemo, useState } from "react";
import { LuBriefcase, LuUserCheck, LuUserMinus } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_STAFF } from "../services/mockData";
import { ROLE_LABELS } from "../utils/permissions";
import { norm, toFaDigits, tofa } from "../utils/format";

const ROLE_TONE = { manager: "gold", operator: "info", accountant: "success", technician: "slate" };

const StaffList = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_STAFF.filter(
      (s) =>
        (tab === "all" || s.roleKey === tab) &&
        (!q || norm(s.name).includes(q) || norm(s.title).includes(q) || norm(s.city).includes(q)),
    );
  }, [query, tab]);

  const columns = [
    { key: "name", header: "کارمند", render: (r) => <Person name={r.name} sub={r.title} /> },
    {
      key: "roleKey",
      header: "نقش",
      render: (r) => <Badge tone={ROLE_TONE[r.roleKey]}>{ROLE_LABELS[r.roleKey]}</Badge>,
    },
    { key: "phone", header: "تلفن", render: (r) => <span dir="ltr">{toFaDigits(r.phone)}</span> },
    { key: "city", header: "شهر" },
    {
      key: "active",
      header: "وضعیت",
      render: (r) => <Badge tone={r.active ? "success" : "slate"}>{r.active ? "فعال" : "غیرفعال"}</Badge>,
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="staff" label={r.name} /> },
  ];

  const active = MOCK_STAFF.filter((s) => s.active).length;

  return (
    <div className="modulepage">
      <PageHeader
        title="فهرست کارکنان"
        subtitle="کارکنان با نقش مدیر، اپراتور، حسابدار و تکنسین"
        actions={<AddAction module="staff">کارمند جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی کارکنان", value: MOCK_STAFF.length, icon: LuBriefcase, tone: "gold" },
          { label: "فعال", value: active, icon: LuUserCheck, tone: "success" },
          { label: "غیرفعال", value: MOCK_STAFF.length - active, icon: LuUserMinus, tone: "slate" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["manager", "مدیر"],
            ["operator", "اپراتور"],
            ["accountant", "حسابدار"],
            ["technician", "تکنسین"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، سمت یا شهر..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="کارمندی پیدا نشد." footer={`${tofa(rows.length)} کارمند`} />
    </div>
  );
};

export default StaffList;

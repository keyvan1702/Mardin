import React, { useMemo, useState } from "react";
import PageHeader from "../component/ui/PageHeader";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_ACTIVITY } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const TYPE = {
  auth: { label: "ورود", tone: "slate" },
  create: { label: "ثبت", tone: "success" },
  update: { label: "ویرایش", tone: "info" },
  delete: { label: "حذف", tone: "danger" },
  assign: { label: "ارجاع", tone: "gold" },
};

// لاگ فعالیت‌ها: چه کسی، چه زمانی، چه کاری کرد
const ActivityLog = () => {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_ACTIVITY.filter(
      (a) =>
        (tab === "all" || a.type === tab) &&
        (!q || norm(a.user).includes(q) || norm(a.action).includes(q) || norm(a.target).includes(q)),
    );
  }, [tab, query]);

  const columns = [
    { key: "at", header: "زمان", render: (r) => <span dir="ltr">{toFaDigits(r.at)}</span> },
    { key: "user", header: "کاربر", render: (r) => <Person name={r.user} /> },
    { key: "type", header: "نوع", render: (r) => <Badge tone={TYPE[r.type].tone}>{TYPE[r.type].label}</Badge> },
    { key: "action", header: "فعالیت", render: (r) => <strong>{r.action}</strong> },
    { key: "target", header: "مورد", render: (r) => <span className="muted">{toFaDigits(r.target)}</span> },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="لاگ فعالیت‌ها" subtitle="سابقه‌ی کارهایی که کاربران پنل انجام داده‌اند" />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["create", "ثبت"],
            ["update", "ویرایش"],
            ["assign", "ارجاع"],
            ["delete", "حذف"],
            ["auth", "ورود"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی کاربر یا فعالیت..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="فعالیتی پیدا نشد." footer={`${tofa(rows.length)} رویداد`} />
    </div>
  );
};

export default ActivityLog;

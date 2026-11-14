import React from "react";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_INSTALLERS } from "../services/mockData";
import { tofa } from "../utils/format";

const StaffInstallers = () => {
  const columns = [
    { key: "name", header: "نام نصاب", render: (r) => <strong>{r.name}</strong> },
    { key: "phone", header: "تلفن", render: (r) => <span dir="ltr">{r.phone}</span> },
    { key: "city", header: "شهر" },
    { key: "rating", header: "امتیاز", render: (r) => r.rating.toFixed(1) },
    { key: "doneJobs", header: "ماموریت‌های انجام‌شده", render: (r) => tofa(r.doneJobs) },
    {
      key: "online",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.online ? "success" : "slate"}>
          {r.online ? "آنلاین" : "آفلاین"}
        </Badge>
      ),
    },
    {
      key: "activeMissions",
      header: "در حال انجام",
      render: (r) => tofa(r.activeMissions),
    },
  ];

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>نصاب‌ها</span></h1>
      <DataTable columns={columns} rows={MOCK_INSTALLERS} />
    </div>
  );
};

export default StaffInstallers;
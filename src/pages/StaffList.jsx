import React from "react";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_STAFF } from "../services/mockData";

const StaffList = () => {
  const columns = [
    { key: "name", header: "نام", render: (r) => <strong>{r.name}</strong> },
    { key: "role", header: "نقش" },
    { key: "phone", header: "تلفن", render: (r) => <span dir="ltr">{r.phone}</span> },
    { key: "city", header: "شهر" },
    {
      key: "active",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.active ? "success" : "slate"}>
          {r.active ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>فهرست کارکنان</span></h1>
      <DataTable columns={columns} rows={MOCK_STAFF} />
    </div>
  );
};

export default StaffList;
import React from "react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_SERVICES } from "../services/mockData";
import { tofa } from "../utils/format";

const ServicesList = () => {
  const columns = [
    { key: "name", header: "نام خدمت", render: (r) => <strong>{r.name}</strong> },
    { key: "basePrice", header: "قیمت پایه", render: (r) => tofa(r.basePrice) + " تومان" },
    {
      key: "active",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.active ? "success" : "slate"}>
          {r.active ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "عملیات",
      render: () => (
        <div className="table-actions">
          <button type="button" className="btnicon"><LuPencil /></button>
          <button type="button" className="btnicon btnicon-danger"><LuTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <div className="pagehead">
        <h1 className="pagetitle"><span>مدیریت خدمات</span></h1>
        <button type="button" className="btnprimary"><LuPlus /> خدمت جدید</button>
      </div>
      <DataTable columns={columns} rows={MOCK_SERVICES} />
    </div>
  );
};

export default ServicesList;
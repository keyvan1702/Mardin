import React from "react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_SLIDES } from "../services/mockData";

const SiteSlider = () => {
  const columns = [
    { key: "order", header: "ترتیب" },
    { key: "title", header: "عنوان اسلاید", render: (r) => <strong>{r.title}</strong> },
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
        <h1 className="pagetitle"><span>مدیریت اسلایدر</span></h1>
        <button type="button" className="btnprimary"><LuPlus /> اسلاید جدید</button>
      </div>
      <DataTable columns={columns} rows={MOCK_SLIDES} />
    </div>
  );
};

export default SiteSlider;
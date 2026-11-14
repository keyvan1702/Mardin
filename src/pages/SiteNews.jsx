import React from "react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_NEWS } from "../services/mockData";

const SiteNews = () => {
  const columns = [
    { key: "title", header: "عنوان خبر", render: (r) => <strong>{r.title}</strong> },
    { key: "date", header: "تاریخ", render: (r) => <span dir="ltr">{r.date}</span> },
    {
      key: "published",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.published ? "success" : "slate"}>
          {r.published ? "منتشرشده" : "پیش‌نویس"}
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
        <h1 className="pagetitle"><span>مدیریت اخبار</span></h1>
        <button type="button" className="btnprimary"><LuPlus /> خبر جدید</button>
      </div>
      <DataTable columns={columns} rows={MOCK_NEWS} />
    </div>
  );
};

export default SiteNews;
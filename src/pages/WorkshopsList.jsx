import React from "react";
import { LuPlus, LuPencil, LuTrash2, LuMapPin } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_WORKSHOPS } from "../services/mockData";
import { tofa } from "../utils/format";

const STATUS = {
  open: { label: "در حال ثبت‌نام", tone: "success" },
  full: { label: "تکمیل ظرفیت", tone: "gold" },
  done: { label: "برگزار شده", tone: "slate" },
};

const WorkshopsList = () => {
  const columns = [
    { key: "title", header: "عنوان ورکشاپ", render: (r) => <strong>{r.title}</strong> },
    { key: "instructor", header: "مدرس" },
    { key: "date", header: "تاریخ برگزاری", render: (r) => <span dir="ltr">{r.date}</span> },
    {
      key: "location",
      header: "محل",
      render: (r) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <LuMapPin /> {r.location}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "ظرفیت",
      render: (r) => `${tofa(r.enrolled)} از ${tofa(r.capacity)}`,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    {
      key: "actions",
      header: "عملیات",
      render: () => (
        <div className="table-actions">
          <button type="button" className="btnicon" aria-label="ویرایش"><LuPencil /></button>
          <button type="button" className="btnicon btnicon-danger" aria-label="حذف"><LuTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <div className="pagehead">
        <h1 className="pagetitle"><span>مدیریت ورکشاپ‌ها</span></h1>
        <button type="button" className="btnprimary"><LuPlus /> ورکشاپ جدید</button>
      </div>
      <DataTable columns={columns} rows={MOCK_WORKSHOPS} />
    </div>
  );
};

export default WorkshopsList;
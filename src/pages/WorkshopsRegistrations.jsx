import React from "react";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_REGISTRATIONS } from "../services/mockData";

const STATUS = {
  confirmed: { label: "تأییدشده", tone: "success" },
  pending: { label: "در انتظار", tone: "gold" },
  canceled: { label: "لغو‌شده", tone: "danger" },
};

const WorkshopsRegistrations = () => {
  const columns = [
    { key: "customer", header: "نام ثبت‌نام‌کننده", render: (r) => <strong>{r.customer}</strong> },
    { key: "phone", header: "تلفن", render: (r) => <span dir="ltr">{r.phone}</span> },
    { key: "workshop", header: "ورکشاپ" },
    { key: "date", header: "تاریخ ثبت‌نام", render: (r) => <span dir="ltr">{r.date}</span> },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
  ];

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>ثبت‌نام‌های ورکشاپ</span></h1>
      <DataTable columns={columns} rows={MOCK_REGISTRATIONS} />
    </div>
  );
};

export default WorkshopsRegistrations;
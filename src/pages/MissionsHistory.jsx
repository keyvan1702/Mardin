import React from "react";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_MISSIONS } from "../services/mockData";
import { tofa } from "../utils/format";

const STATUS = {
  accepted: { label: "پذیرفته‌شده", tone: "success" },
  rejected: { label: "رد‌شده", tone: "danger" },
  done: { label: "تمام‌شده", tone: "slate" },
};

const MissionsHistory = () => {
  const rows = MOCK_MISSIONS.filter((m) => m.status !== "pending");
  const columns = [
    { key: "id", header: "#", render: (r) => <span dir="ltr">#{r.id}</span> },
    { key: "customer", header: "مشتری", render: (r) => <strong>{r.customer}</strong> },
    { key: "service", header: "خدمت" },
    { key: "installer", header: "نصاب" },
    { key: "price", header: "هزینه", render: (r) => tofa(r.price) + " تومان" },
    {
      key: "status",
      header: "نتیجه",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    {
      key: "respondedAt",
      header: "زمان پاسخ",
      render: (r) => <span dir="ltr">{r.respondedAt || "—"}</span>,
    },
    {
      key: "rejectReason",
      header: "توضیح",
      render: (r) => r.rejectReason || "—",
    },
  ];

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>تاریخچه ماموریت‌ها</span></h1>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default MissionsHistory;
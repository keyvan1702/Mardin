import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../component/ui/PageHeader";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_MISSIONS } from "../services/mockData";
import { toFaDigits, tofa } from "../utils/format";

const STATUS = {
  accepted: { label: "پذیرفته‌شده", tone: "success" },
  rejected: { label: "ردشده", tone: "danger" },
  done: { label: "تمام‌شده", tone: "slate" },
};

const ALL = MOCK_MISSIONS.filter((m) => m.status !== "pending");

const MissionsHistory = () => {
  const [tab, setTab] = useState("all");
  const rows = tab === "all" ? ALL : ALL.filter((m) => m.status === tab);
  const n = (s) => ALL.filter((m) => m.status === s).length;

  const columns = [
    {
      key: "tracking",
      header: "شماره پیگیری",
      render: (r) => (
        <Link to={`/missions/${r.id}`} className="textlink" dir="ltr">
          {toFaDigits(r.tracking)}
        </Link>
      ),
    },
    { key: "customer", header: "مشتری", render: (r) => <Person name={r.customer} sub={r.service} /> },
    { key: "installer", header: "تکنسین", render: (r) => r.installer || "—" },
    { key: "price", header: "هزینه", render: (r) => `${tofa(r.price)} تومان` },
    {
      key: "status",
      header: "نتیجه",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    {
      key: "respondedAt",
      header: "زمان پاسخ",
      render: (r) => <span dir="ltr">{r.respondedAt ? toFaDigits(r.respondedAt) : "—"}</span>,
    },
    { key: "rejectReason", header: "توضیح", render: (r) => r.rejectReason || "—" },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="تاریخچه درخواست‌ها" subtitle="درخواست‌هایی که تکنسین به آن‌ها پاسخ داده یا تمام شده‌اند" />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه", ALL.length],
            ["accepted", "پذیرفته‌شده", n("accepted")],
            ["done", "تمام‌شده", n("done")],
            ["rejected", "ردشده", n("rejected")],
          ]}
        />
      </div>
      <DataTable columns={columns} rows={rows} empty="موردی در این دسته نیست." footer={`${tofa(rows.length)} مورد`} />
    </div>
  );
};

export default MissionsHistory;

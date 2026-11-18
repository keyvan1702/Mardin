import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../component/ui/PageHeader";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useCollection } from "../services/store";
import { MISSION_STATUS } from "../services/constants";
import { fmtDateTime, toFaDigits, tofa } from "../utils/format";

// درخواست‌های بسته‌شده، لغوشده یا ردشده توسط تکنسین
const MissionsHistory = () => {
  const missions = useCollection("missions");
  const [tab, setTab] = useState("all");

  const all = missions.filter((m) => m.stage === "closed" || m.status === "cancelled" || m.status === "rejected" || (m.rejections || []).length > 0);
  const match = {
    closed: (m) => m.stage === "closed",
    rejected: (m) => m.status === "rejected" || (m.rejections || []).length > 0,
    cancelled: (m) => m.status === "cancelled",
  };
  const rows = (tab === "all" ? all : all.filter(match[tab])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const columns = [
    { key: "tracking", header: "شماره پیگیری", render: (r) => <Link to={`/missions/${r.id}`} className="textlink" dir="ltr">{toFaDigits(r.tracking)}</Link> },
    { key: "customer", header: "مشتری", render: (r) => <Person name={r.customer} sub={r.service} /> },
    { key: "installer", header: "تکنسین", render: (r) => r.installer || "—" },
    { key: "price", header: "هزینه", render: (r) => `${tofa(r.price)} تومان` },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={MISSION_STATUS[r.status].tone}>{MISSION_STATUS[r.status].label}</Badge> },
    { key: "createdAt", header: "زمان ثبت", render: (r) => fmtDateTime(r.createdAt) },
    { key: "note", header: "توضیح", render: (r) => r.rejectReason || (r.feedback ? `«${r.feedback}»` : "—") },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="تاریخچه درخواست‌ها" subtitle="درخواست‌های بسته‌شده، لغوشده و آن‌هایی که تکنسین رد کرده است" />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["all", "همه", all.length], ["closed", "بسته‌شده", all.filter(match.closed).length], ["rejected", "رد تکنسین", all.filter(match.rejected).length], ["cancelled", "لغوشده", all.filter(match.cancelled).length]]} />
      </div>
      <DataTable columns={columns} rows={rows} empty="موردی در این دسته نیست." footer={`${tofa(rows.length)} مورد`} />
    </div>
  );
};

export default MissionsHistory;

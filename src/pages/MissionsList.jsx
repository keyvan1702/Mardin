import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuClipboardList, LuHourglass, LuTriangleAlert, LuCircleCheck } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import Badge from "../component/table/Badge";
import DataTable from "../component/table/DataTable";
import { useCollection } from "../services/store";
import { MISSION_STAGES, MISSION_STATUS, PRIORITY } from "../services/constants";
import { fmtDateTime, norm, toFaDigits, tofa } from "../utils/format";

const STAGE_TONE = { registered: "info", review: "gold", assigned: "info", inprogress: "gold", finished: "success", closed: "slate" };
const stageLabel = (k) => MISSION_STAGES.find((s) => s.key === k)?.label ?? k;

const FILTERS = {
  open: (m) => m.stage !== "closed" && m.status !== "cancelled",
  closed: (m) => m.stage === "closed",
  cancelled: (m) => m.status === "cancelled",
};
const RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

const MissionsList = () => {
  const missions = useCollection("missions");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("open");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return missions
      .filter(FILTERS[tab])
      .filter((m) => !q || norm(m.customer).includes(q) || norm(m.service).includes(q) || norm(m.tracking).includes(q) || norm(m.city).includes(q))
      .sort((a, b) => (tab === "open" ? RANK[a.priority] - RANK[b.priority] : 0) || b.createdAt.localeCompare(a.createdAt));
  }, [missions, query, tab]);

  const count = (k) => missions.filter(FILTERS[k]).length;
  const waiting = missions.filter((m) => !m.installerId && FILTERS.open(m)).length;
  const urgent = missions.filter((m) => m.priority === "urgent" && FILTERS.open(m)).length;

  const columns = [
    { key: "tracking", header: "شماره پیگیری", render: (r) => <Link to={`/missions/${r.id}`} className="textlink" dir="ltr">{toFaDigits(r.tracking)}</Link> },
    { key: "customer", header: "مشتری", render: (r) => <Person name={r.customer} sub={r.service} /> },
    { key: "city", header: "شهر" },
    { key: "priority", header: "اولویت", render: (r) => <Badge tone={PRIORITY[r.priority].tone}>{PRIORITY[r.priority].label}</Badge> },
    { key: "stage", header: "مرحله", render: (r) => <Badge tone={STAGE_TONE[r.stage]}>{stageLabel(r.stage)}</Badge> },
    { key: "installer", header: "تکنسین", render: (r) => r.installer || <Badge tone={MISSION_STATUS[r.status].tone}>{r.status === "rejected" ? "ردشده؛ نیازمند ارجاع" : "تخصیص نیافته"}</Badge> },
    { key: "createdAt", header: "زمان ثبت", render: (r) => fmtDateTime(r.createdAt) },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="فهرست درخواست‌ها"
        subtitle="هر درخواست شماره پیگیری، اولویت و وضعیت چندمرحله‌ای دارد؛ برای دیدن جزئیات و پیشبرد کار روی شماره بزنید"
        actions={<AddAction module="missions" to="/missions/new">ثبت درخواست</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی درخواست‌ها", value: missions.length, icon: LuClipboardList, tone: "gold" },
          { label: "منتظر تکنسین", value: waiting, icon: LuHourglass, tone: "info" },
          { label: "فوری و باز", value: urgent, icon: LuTriangleAlert, tone: "danger" },
          { label: "بسته‌شده", value: count("closed"), icon: LuCircleCheck, tone: "success" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["open", "باز", count("open")], ["closed", "بسته‌شده", count("closed")], ["cancelled", "لغوشده", count("cancelled")]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی شماره پیگیری، مشتری یا خدمت..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="درخواستی در این دسته وجود ندارد." footer={`${tofa(rows.length)} درخواست`} />
    </div>
  );
};

export default MissionsList;

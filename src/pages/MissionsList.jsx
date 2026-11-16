import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuClipboardList, LuHourglass, LuTriangleAlert, LuCircleCheck } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import Badge from "../component/table/Badge";
import DataTable from "../component/table/DataTable";
import { MISSION_STAGES, MOCK_MISSIONS, PRIORITY } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const STAGE_TONE = {
  registered: "info", review: "gold", assigned: "info", inprogress: "gold", finished: "success", closed: "slate",
};
const stageLabel = (k) => MISSION_STAGES.find((s) => s.key === k)?.label ?? k;

const FILTERS = {
  active: (m) => m.stage !== "closed" && m.status !== "rejected" || m.stage === "review",
  done: (m) => m.stage === "closed",
  rejected: (m) => m.status === "rejected",
};

const MissionsList = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("active");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_MISSIONS.filter(FILTERS[tab]).filter(
      (m) =>
        !q ||
        norm(m.customer).includes(q) ||
        norm(m.service).includes(q) ||
        norm(m.tracking).includes(q) ||
        norm(m.city).includes(q),
    );
  }, [query, tab]);

  const count = (k) => MOCK_MISSIONS.filter(FILTERS[k]).length;
  const urgent = MOCK_MISSIONS.filter((m) => m.priority === "urgent" && m.stage !== "closed").length;

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
    { key: "city", header: "شهر" },
    {
      key: "priority",
      header: "اولویت",
      render: (r) => <Badge tone={PRIORITY[r.priority].tone}>{PRIORITY[r.priority].label}</Badge>,
    },
    {
      key: "stage",
      header: "مرحله",
      render: (r) => <Badge tone={STAGE_TONE[r.stage]}>{stageLabel(r.stage)}</Badge>,
    },
    { key: "installer", header: "تکنسین", render: (r) => r.installer || <span className="muted">تخصیص نیافته</span> },
    { key: "createdAt", header: "زمان ثبت", render: (r) => <span dir="ltr">{toFaDigits(r.createdAt)}</span> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="فهرست درخواست‌ها"
        subtitle="هر درخواست شماره پیگیری، اولویت و وضعیت چندمرحله‌ای دارد؛ برای دیدن جزئیات روی شماره بزنید"
      />

      <StatStrip
        items={[
          { label: "همه‌ی درخواست‌ها", value: MOCK_MISSIONS.length, icon: LuClipboardList, tone: "gold" },
          { label: "منتظر تکنسین", value: MOCK_MISSIONS.filter((m) => m.status === "pending").length, icon: LuHourglass, tone: "info" },
          { label: "فوری و باز", value: urgent, icon: LuTriangleAlert, tone: "danger" },
          { label: "بسته‌شده", value: count("done"), icon: LuCircleCheck, tone: "success" },
        ]}
      />

      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["active", "باز", count("active")],
            ["done", "بسته‌شده", count("done")],
            ["rejected", "ردشده توسط تکنسین", count("rejected")],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی شماره پیگیری، مشتری یا خدمت..." />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        empty="درخواستی در این دسته وجود ندارد."
        footer={`${tofa(rows.length)} درخواست`}
      />
    </div>
  );
};

export default MissionsList;

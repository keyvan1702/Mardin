import React, { useMemo, useState } from "react";
import { LuMapPin, LuGraduationCap, LuCalendarCheck, LuUsers, LuCircleCheck } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import FilterTabs from "../component/ui/FilterTabs";
import SearchBox from "../component/ui/SearchBox";
import RowActions from "../component/ui/RowActions";
import AddAction from "../component/ui/AddAction";
import Meter from "../component/ui/Meter";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_WORKSHOPS } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const STATUS = {
  open: { label: "در حال ثبت‌نام", tone: "success" },
  full: { label: "تکمیل ظرفیت", tone: "gold" },
  done: { label: "برگزار شده", tone: "slate" },
};

const WorkshopsList = () => {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_WORKSHOPS.filter(
      (w) =>
        (tab === "all" || w.status === tab) &&
        (!q || norm(w.title).includes(q) || norm(w.instructor).includes(q) || norm(w.location).includes(q)),
    );
  }, [tab, query]);

  const n = (s) => MOCK_WORKSHOPS.filter((w) => w.status === s).length;
  const enrolled = MOCK_WORKSHOPS.reduce((s, w) => s + w.enrolled, 0);

  const columns = [
    {
      key: "title",
      header: "ورکشاپ",
      render: (r) => (
        <div className="stackcell">
          <strong>{r.title}</strong>
          <span className="stackcellsub">{r.instructor}</span>
        </div>
      ),
    },
    { key: "date", header: "تاریخ برگزاری", render: (r) => <span dir="ltr">{toFaDigits(r.date)}</span> },
    {
      key: "location",
      header: "محل",
      render: (r) => (
        <span className="iconlabel">
          <LuMapPin /> {r.location}
        </span>
      ),
    },
    { key: "capacity", header: "ظرفیت", render: (r) => <Meter value={r.enrolled} max={r.capacity} /> },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="courses" label={r.title} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="مدیریت ورکشاپ‌ها"
        subtitle="برنامه‌ی ورکشاپ‌ها، ظرفیت و وضعیت ثبت‌نام"
        actions={<AddAction module="courses">ورکشاپ جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی ورکشاپ‌ها", value: MOCK_WORKSHOPS.length, icon: LuGraduationCap, tone: "gold" },
          { label: "در حال ثبت‌نام", value: n("open"), icon: LuCalendarCheck, tone: "success" },
          { label: "ثبت‌نام‌شده‌ها", value: enrolled, icon: LuUsers, tone: "info" },
          { label: "برگزارشده", value: n("done"), icon: LuCircleCheck, tone: "slate" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["open", "در حال ثبت‌نام"],
            ["full", "تکمیل"],
            ["done", "برگزارشده"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی عنوان، مدرس یا محل..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="ورکشاپی پیدا نشد." footer={`${tofa(rows.length)} ورکشاپ`} />
    </div>
  );
};

export default WorkshopsList;

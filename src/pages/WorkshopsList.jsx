import React, { useMemo, useState } from "react";
import { LuMapPin, LuGraduationCap, LuCalendarCheck, LuUsers, LuCircleCheck } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import FilterTabs from "../component/ui/FilterTabs";
import SearchBox from "../component/ui/SearchBox";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import Meter from "../component/ui/Meter";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import useCrudPage from "../component/crud/useCrudPage";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useCollection } from "../services/store";
import { workshopsApi } from "../services/actions";
import { fmtDate, norm, tofa } from "../utils/format";

const STATUS = {
  open: { label: "در حال ثبت‌نام", tone: "success" },
  full: { label: "تکمیل ظرفیت", tone: "gold" },
  done: { label: "برگزار شده", tone: "slate" },
};

const FIELDS = [
  { key: "title", label: "عنوان ورکشاپ", type: "text", required: true, span: 2 },
  { key: "instructor", label: "مدرس", type: "text", required: true },
  { key: "date", label: "تاریخ برگزاری", type: "date", required: true, default: "today" },
  { key: "location", label: "محل برگزاری", type: "text", hint: "مثلاً «آنلاین» یا نام شهر و سالن" },
  { key: "capacity", label: "ظرفیت", type: "number", required: true, min: 1 },
  {
    key: "status", label: "وضعیت", type: "select", required: true, default: "open",
    options: [{ value: "open", label: "در حال ثبت‌نام" }, { value: "done", label: "برگزار شده" }],
    hint: "تکمیل ظرفیت خودکار تعیین می‌شود",
  },
];

const WorkshopsList = () => {
  const workshops = useCollection("workshops");
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(workshopsApi, "ورکشاپ");
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return workshops.filter(
      (w) => (tab === "all" || w.status === tab) && (!q || norm(w.title).includes(q) || norm(w.instructor).includes(q) || norm(w.location).includes(q)),
    );
  }, [workshops, tab, query]);

  const n = (s) => workshops.filter((w) => w.status === s).length;
  const enrolled = workshops.reduce((s, w) => s + w.enrolled, 0);

  const columns = [
    { key: "title", header: "ورکشاپ", render: (r) => <div className="stackcell"><strong>{r.title}</strong><span className="stackcellsub">{r.instructor}</span></div> },
    { key: "date", header: "تاریخ برگزاری", render: (r) => fmtDate(r.date) },
    { key: "location", header: "محل", render: (r) => <span className="iconlabel"><LuMapPin /> {r.location || "—"}</span> },
    { key: "capacity", header: "ظرفیت", render: (r) => <Meter value={r.enrolled} max={r.capacity} /> },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge> },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="courses" label={r.title} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="مدیریت ورکشاپ‌ها"
        subtitle="برنامه‌ی ورکشاپ‌ها، ظرفیت و وضعیت ثبت‌نام"
        actions={<AddAction module="courses" onClick={() => setEditing({})}>ورکشاپ جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی ورکشاپ‌ها", value: workshops.length, icon: LuGraduationCap, tone: "gold" },
          { label: "در حال ثبت‌نام", value: n("open"), icon: LuCalendarCheck, tone: "success" },
          { label: "ثبت‌نام‌شده‌ها", value: enrolled, icon: LuUsers, tone: "info" },
          { label: "برگزارشده", value: n("done"), icon: LuCircleCheck, tone: "slate" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["all", "همه"], ["open", "در حال ثبت‌نام"], ["full", "تکمیل"], ["done", "برگزارشده"]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی عنوان، مدرس یا محل..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="ورکشاپی پیدا نشد." footer={`${tofa(rows.length)} ورکشاپ`} />

      {editing && (
        <FormDialog
          title={editing.id ? "ویرایش ورکشاپ" : "ورکشاپ جدید"}
          fields={FIELDS}
          row={editing.id ? { ...editing, status: editing.status === "full" ? "open" : editing.status } : null}
          onSubmit={save}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && <ConfirmDialog title="حذف ورکشاپ" message={`«${deleting.title}» حذف شود؟`} onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
};

export default WorkshopsList;

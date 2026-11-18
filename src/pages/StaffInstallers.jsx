import React, { useMemo, useState } from "react";
import { LuWrench, LuWifi, LuStar, LuActivity } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import Switch from "../component/ui/Switch";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import useCrudPage from "../component/crud/useCrudPage";
import DataTable from "../component/table/DataTable";
import usePermissions from "../hooks/usePermissions";
import { useCollection, db } from "../services/store";
import { installersApi } from "../services/actions";
import { norm, toFaDigits, tofa } from "../utils/format";

const FIELDS = [
  { key: "name", label: "نام و نام خانوادگی", type: "text", required: true },
  { key: "phone", label: "تلفن همراه", type: "tel", required: true },
  { key: "city", label: "شهر", type: "text" },
  { key: "online", label: "آنلاین (آماده‌ی دریافت ماموریت)", type: "switch", default: false },
];

// نصابان ثبت‌شده در پلتفرم؛ با تأیید رزومه‌ی «نصاب» هم به این فهرست اضافه می‌شوند
const StaffInstallers = () => {
  const installers = useCollection("installers");
  const missions = useCollection("missions");
  const { edit } = usePermissions();
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(installersApi, "نصاب");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const active = (id) => missions.filter((m) => m.installerId === id && ["assigned", "inprogress"].includes(m.stage)).length;

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return installers.filter(
      (i) => (tab === "all" || (tab === "online") === i.online) && (!q || norm(i.name).includes(q) || norm(i.city).includes(q)),
    );
  }, [installers, query, tab]);

  const online = installers.filter((i) => i.online).length;
  const rated = installers.filter((i) => i.rating > 0);
  const avg = rated.reduce((s, i) => s + i.rating, 0) / (rated.length || 1);
  const activeJobs = installers.reduce((s, i) => s + active(i.id), 0);

  const columns = [
    { key: "name", header: "نصاب", render: (r) => <Person name={r.name} sub={toFaDigits(r.phone)} subLtr /> },
    { key: "city", header: "شهر" },
    {
      key: "rating", header: "امتیاز",
      render: (r) => (r.rating > 0 ? <span className="rating"><LuStar /> {toFaDigits(r.rating.toFixed(1))}</span> : <span className="muted">بدون امتیاز</span>),
    },
    { key: "doneJobs", header: "ماموریت انجام‌شده", render: (r) => tofa(r.doneJobs) },
    { key: "active", header: "در حال انجام", render: (r) => tofa(active(r.id)) },
    {
      key: "online", header: "وضعیت",
      render: (r) => (
        <Switch
          checked={r.online}
          disabled={!edit("installers")}
          onChange={(v) => installersApi.update(r.id, { online: v })}
          label={r.online ? "آنلاین" : "آفلاین"}
        />
      ),
    },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="installers" label={r.name} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  const submit = (v) => save(editing?.id ? v : { ...v, rating: 0, doneJobs: 0 });

  return (
    <div className="modulepage">
      <PageHeader
        title="نصاب‌ها"
        subtitle="نصابان فعال، امتیاز و بار کاری آن‌ها"
        actions={<AddAction module="installers" onClick={() => setEditing({})}>نصاب جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی نصاب‌ها", value: installers.length, icon: LuWrench, tone: "gold" },
          { label: "آنلاین", value: online, icon: LuWifi, tone: "success" },
          { label: "میانگین امتیاز", value: rated.length ? toFaDigits(avg.toFixed(1)) : "—", icon: LuStar, tone: "gold" },
          { label: "ماموریت در جریان", value: activeJobs, icon: LuActivity, tone: "info" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["all", "همه"], ["online", "آنلاین"], ["offline", "آفلاین"]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام یا شهر..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="نصابی پیدا نشد." footer={`${tofa(rows.length)} نصاب`} />

      {editing && (
        <FormDialog
          title={editing.id ? "ویرایش نصاب" : "نصاب جدید"}
          fields={FIELDS}
          row={editing.id ? editing : { online: false }}
          onSubmit={submit}
          onClose={() => setEditing(null)}
          size="md"
        />
      )}
      {deleting && (
        <ConfirmDialog title="حذف نصاب" message={`«${deleting.name}» از فهرست نصابان حذف شود؟`} onConfirm={remove} onClose={() => setDeleting(null)} />
      )}
    </div>
  );
};

export default StaffInstallers;

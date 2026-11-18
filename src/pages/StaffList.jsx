import React, { useMemo, useState } from "react";
import { LuBriefcase, LuUserCheck, LuUserMinus } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import useCrudPage from "../component/crud/useCrudPage";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useCollection } from "../services/store";
import { staffApi } from "../services/actions";
import { ROLE_LABELS } from "../utils/permissions";
import { norm, toFaDigits, tofa } from "../utils/format";

const ROLE_TONE = { manager: "gold", operator: "info", accountant: "success", technician: "slate" };
const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

const StaffList = () => {
  const staff = useCollection("staff");
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(staffApi, "کارمند");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  // رمز در ویرایش اختیاری است؛ خالی بماند تغییر نمی‌کند
  const fields = [
    { key: "name", label: "نام و نام خانوادگی", type: "text", required: true },
    { key: "title", label: "سمت", type: "text" },
    { key: "roleKey", label: "نقش", type: "select", options: ROLE_OPTIONS, required: true, hint: "سطح دسترسی هر نقش در «نقش‌ها و دسترسی‌ها» تعریف می‌شود" },
    { key: "phone", label: "تلفن همراه", type: "tel", required: true },
    { key: "city", label: "شهر", type: "text" },
    { key: "username", label: "نام کاربری ورود", type: "text", required: true, dir: "ltr" },
    { key: "password", label: editing?.id ? "رمز عبور جدید (اختیاری)" : "رمز عبور", type: "password", required: !editing?.id, min: 4 },
    { key: "active", label: "حساب فعال است", type: "switch", default: true },
  ];

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return staff.filter(
      (s) => (tab === "all" || s.roleKey === tab) && (!q || norm(s.name).includes(q) || norm(s.title).includes(q) || norm(s.city).includes(q)),
    );
  }, [staff, query, tab]);

  const columns = [
    { key: "name", header: "کارمند", render: (r) => <Person name={r.name} sub={r.title} /> },
    { key: "roleKey", header: "نقش", render: (r) => <Badge tone={ROLE_TONE[r.roleKey]}>{ROLE_LABELS[r.roleKey]}</Badge> },
    { key: "phone", header: "تلفن", render: (r) => <span dir="ltr">{toFaDigits(r.phone)}</span> },
    { key: "username", header: "نام کاربری", render: (r) => <span dir="ltr" className="muted">{r.username}</span> },
    { key: "active", header: "وضعیت", render: (r) => <Badge tone={r.active ? "success" : "slate"}>{r.active ? "فعال" : "غیرفعال"}</Badge> },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="staff" label={r.name} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  const active = staff.filter((s) => s.active).length;

  const submit = (values) => {
    const data = { ...values };
    if (editing?.id && !data.password) delete data.password;
    save(data);
  };

  return (
    <div className="modulepage">
      <PageHeader
        title="فهرست کارکنان"
        subtitle="کارکنان پنل با نقش مدیر، اپراتور، حسابدار و تکنسین"
        actions={<AddAction module="staff" onClick={() => setEditing({})}>کارمند جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی کارکنان", value: staff.length, icon: LuBriefcase, tone: "gold" },
          { label: "فعال", value: active, icon: LuUserCheck, tone: "success" },
          { label: "غیرفعال", value: staff.length - active, icon: LuUserMinus, tone: "slate" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[["all", "همه"], ["manager", "مدیر"], ["operator", "اپراتور"], ["accountant", "حسابدار"], ["technician", "تکنسین"]]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، سمت یا شهر..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="کارمندی پیدا نشد." footer={`${tofa(rows.length)} کارمند`} />

      {editing && (
        <FormDialog
          title={editing.id ? "ویرایش کارمند" : "کارمند جدید"}
          fields={fields}
          row={editing.id ? { ...editing, password: "" } : { roleKey: "operator", active: true }}
          onSubmit={submit}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="حذف کارمند"
          message={`حساب «${deleting.name}» حذف شود؟ دیگر نمی‌تواند وارد پنل شود.`}
          onConfirm={remove}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
};

export default StaffList;

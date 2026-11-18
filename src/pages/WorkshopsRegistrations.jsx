import React, { useMemo, useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FilterTabs from "../component/ui/FilterTabs";
import SearchBox from "../component/ui/SearchBox";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useCollection } from "../services/store";
import { registrationsApi } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { fmtDate, norm, toFaDigits, tofa } from "../utils/format";

const STATUS = {
  confirmed: { label: "تأییدشده", tone: "success" },
  prereg: { label: "پیش‌ثبت‌نام", tone: "info" },
  pending: { label: "در انتظار", tone: "gold" },
  canceled: { label: "لغوشده", tone: "danger" },
};

// ثبت‌نام و پیش‌ثبت‌نام ورکشاپ‌ها؛ تأیید یا لغو، ظرفیت ورکشاپ را به‌روز می‌کند
const WorkshopsRegistrations = () => {
  const regs = useCollection("registrations");
  const workshops = useCollection("workshops");
  const toast = useToast();
  const { edit } = usePermissions();
  const canEdit = edit("courses");
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const titleOf = (id) => workshops.find((w) => w.id === id)?.title ?? "—";

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return regs.filter(
      (r) => (tab === "all" || r.status === tab) && (!q || norm(r.name).includes(q) || norm(r.phone).includes(q) || norm(titleOf(r.workshopId)).includes(q)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regs, workshops, tab, query]);

  const n = (s) => regs.filter((r) => r.status === s).length;

  const setStatus = (r, status) => {
    try {
      registrationsApi.setStatus(r.id, status);
      toast.success(status === "confirmed" ? "ثبت‌نام تأیید شد" : "ثبت‌نام لغو شد");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const fields = [
    { key: "name", label: "نام ثبت‌نام‌کننده", type: "text", required: true },
    { key: "phone", label: "تلفن همراه", type: "tel", required: true },
    { key: "workshopId", label: "ورکشاپ", type: "select", required: true, span: 2, options: workshops.filter((w) => w.status !== "done").map((w) => ({ value: w.id, label: w.title })) },
    {
      key: "status", label: "وضعیت", type: "select", required: true, default: "prereg",
      options: [{ value: "prereg", label: "پیش‌ثبت‌نام" }, { value: "pending", label: "در انتظار" }, { value: "confirmed", label: "تأییدشده" }],
    },
  ];

  const columns = [
    { key: "name", header: "ثبت‌نام‌کننده", render: (r) => <Person name={r.name} sub={toFaDigits(r.phone)} subLtr /> },
    { key: "workshop", header: "ورکشاپ", render: (r) => titleOf(r.workshopId) },
    { key: "createdAt", header: "تاریخ", render: (r) => fmtDate(r.createdAt) },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge> },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) =>
        canEdit && (
          <div className="table-actions">
            {r.status !== "confirmed" && r.status !== "canceled" && (
              <button type="button" className="btnicon" title="تأیید ثبت‌نام" aria-label={`تأیید ${r.name}`} onClick={() => setStatus(r, "confirmed")}><LuCheck /></button>
            )}
            {r.status !== "canceled" && (
              <button type="button" className="btnicon" title="لغو ثبت‌نام" aria-label={`لغو ${r.name}`} onClick={() => setStatus(r, "canceled")}><LuX /></button>
            )}
            <RowActions label={r.name} onDelete={() => setDeleting(r)} />
          </div>
        ),
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="ثبت‌نام و پیش‌ثبت‌نام"
        subtitle="ثبت‌نام‌شدگان و پیش‌ثبت‌نام‌کنندگان ورکشاپ‌ها"
        actions={<AddAction module="courses" onClick={() => setAdding(true)}>ثبت‌نام جدید</AddAction>}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[["all", "همه", regs.length], ["confirmed", "تأییدشده", n("confirmed")], ["prereg", "پیش‌ثبت‌نام", n("prereg")], ["pending", "در انتظار", n("pending")], ["canceled", "لغوشده", n("canceled")]]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، تلفن یا ورکشاپ..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="ثبت‌نامی پیدا نشد." footer={`${tofa(rows.length)} ثبت‌نام`} />

      {adding && (
        <FormDialog
          title="ثبت‌نام جدید"
          fields={fields}
          row={null}
          onSubmit={(v) => {
            registrationsApi.create({ ...v, workshopId: Number(v.workshopId) });
            toast.success("ثبت‌نام اضافه شد");
            setAdding(false);
          }}
          onClose={() => setAdding(false)}
          size="md"
        />
      )}
      {deleting && (
        <ConfirmDialog title="حذف ثبت‌نام" message={`ثبت‌نام «${deleting.name}» حذف شود؟`} onConfirm={() => { registrationsApi.remove(deleting.id); toast.success("ثبت‌نام حذف شد"); }} onClose={() => setDeleting(null)} />
      )}
    </div>
  );
};

export default WorkshopsRegistrations;

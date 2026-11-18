import React from "react";
import PageHeader from "../component/ui/PageHeader";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import Switch from "../component/ui/Switch";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import useCrudPage from "../component/crud/useCrudPage";
import DataTable from "../component/table/DataTable";
import usePermissions from "../hooks/usePermissions";
import { useCollection } from "../services/store";
import { slidesApi } from "../services/actions";
import { tofa } from "../utils/format";

const FIELDS = [
  { key: "title", label: "عنوان اسلاید", type: "text", required: true, span: 2 },
  { key: "order", label: "ترتیب نمایش", type: "number", default: "1", min: 1 },
  { key: "active", label: "نمایش در سایت", type: "switch", default: true },
];

const SiteSlider = () => {
  const slides = useCollection("slides");
  const { edit } = usePermissions();
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(slidesApi, "اسلاید");
  const rows = [...slides].sort((a, b) => a.order - b.order);

  const columns = [
    { key: "order", header: "ترتیب", render: (r) => <span className="ordernum">{tofa(r.order)}</span> },
    { key: "title", header: "عنوان اسلاید", render: (r) => <strong>{r.title}</strong> },
    {
      key: "active", header: "وضعیت",
      render: (r) => <Switch checked={r.active} disabled={!edit("content")} onChange={(v) => slidesApi.update(r.id, { active: v })} label={r.active ? "نمایش" : "پنهان"} />,
    },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="content" label={r.title} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="اسلایدر" subtitle="اسلایدهای صفحه‌ی اصلی و ترتیب نمایش آن‌ها" actions={<AddAction module="content" onClick={() => setEditing({})}>اسلاید جدید</AddAction>} />
      <DataTable columns={columns} rows={rows} empty="اسلایدی ثبت نشده است." footer={`${tofa(rows.length)} اسلاید`} />
      {editing && <FormDialog title={editing.id ? "ویرایش اسلاید" : "اسلاید جدید"} fields={FIELDS} row={editing.id ? editing : { order: slides.length + 1, active: true }} onSubmit={save} onClose={() => setEditing(null)} size="md" />}
      {deleting && <ConfirmDialog title="حذف اسلاید" message={`«${deleting.title}» حذف شود؟`} onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
};

export default SiteSlider;

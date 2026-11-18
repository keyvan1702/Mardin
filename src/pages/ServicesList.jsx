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
import { servicesApi } from "../services/actions";
import { tofa } from "../utils/format";

const FIELDS = [
  { key: "name", label: "نام خدمت", type: "text", required: true },
  { key: "basePrice", label: "قیمت پایه", type: "money", required: true },
  { key: "active", label: "فعال (قابل درخواست توسط مشتری)", type: "switch", default: true },
];

const ServicesList = () => {
  const services = useCollection("services");
  const { edit } = usePermissions();
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(servicesApi, "خدمت");

  const columns = [
    { key: "name", header: "نام خدمت", render: (r) => <strong>{r.name}</strong> },
    { key: "basePrice", header: "قیمت پایه", render: (r) => `${tofa(r.basePrice)} تومان` },
    {
      key: "active", header: "وضعیت",
      render: (r) => (
        <Switch checked={r.active} disabled={!edit("services")} onChange={(v) => servicesApi.update(r.id, { active: v })} label={r.active ? "فعال" : "غیرفعال"} />
      ),
    },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="services" label={r.name} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="مدیریت خدمات"
        subtitle="خدماتی که مشتریان می‌توانند درخواست کنند"
        actions={<AddAction module="services" onClick={() => setEditing({})}>خدمت جدید</AddAction>}
      />
      <DataTable columns={columns} rows={services} empty="خدمتی ثبت نشده است." footer={`${tofa(services.length)} خدمت`} />
      {editing && (
        <FormDialog title={editing.id ? "ویرایش خدمت" : "خدمت جدید"} fields={FIELDS} row={editing.id ? editing : { active: true }} onSubmit={save} onClose={() => setEditing(null)} size="md" />
      )}
      {deleting && <ConfirmDialog title="حذف خدمت" message={`«${deleting.name}» حذف شود؟`} onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
};

export default ServicesList;

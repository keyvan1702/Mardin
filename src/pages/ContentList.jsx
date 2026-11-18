import React from "react";
import PageHeader from "../component/ui/PageHeader";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import { useState } from "react";
import { useCollection } from "../services/store";
import { contentApis } from "../services/actions";
import { fmtDate, tofa } from "../utils/format";

// فهرست عمومی صفحات، مقالات و اخبار وبسایت؛ type: pages | articles | news
const ContentList = ({ type, title, subtitle, addLabel, label, extra }) => {
  const rows = useCollection(type);
  const toast = useToast();
  const [deleting, setDeleting] = useState(null);

  const columns = [
    {
      key: "title", header: "عنوان",
      render: (r) => (
        <div className="stackcell">
          <strong>{r.title}</strong>
          {r.summary && <span className="stackcellsub">{r.summary}</span>}
        </div>
      ),
    },
    ...(extra ? [extra] : []),
    { key: "date", header: type === "pages" ? "آخرین ویرایش" : "تاریخ", render: (r) => fmtDate(r.updatedAt || r.date) },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={r.status === "published" ? "success" : "slate"}>{r.status === "published" ? "منتشرشده" : "پیش‌نویس"}</Badge> },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="content" label={r.title} editTo={`/site-content/${type}/${r.id}`} onDelete={() => setDeleting(r)} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader title={title} subtitle={subtitle} actions={<AddAction module="content" to={`/site-content/${type}/new`}>{addLabel}</AddAction>} />
      <DataTable columns={columns} rows={rows} empty="موردی ثبت نشده است." footer={`${tofa(rows.length)} مورد`} />
      {deleting && (
        <ConfirmDialog
          title={`حذف ${label}`}
          message={`«${deleting.title}» حذف شود؟`}
          onConfirm={() => { contentApis[type].remove(deleting.id); toast.success(`${label} حذف شد`); }}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
};

export default ContentList;

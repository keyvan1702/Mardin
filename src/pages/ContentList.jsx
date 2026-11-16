import React from "react";
import PageHeader from "../component/ui/PageHeader";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { tofa, toFaDigits } from "../utils/format";

// فهرست عمومی صفحات، مقالات و اخبار وبسایت
// type: pages | articles | news
const ContentList = ({ type, title, subtitle, addLabel, rows, extra }) => {
  const columns = [
    {
      key: "title",
      header: "عنوان",
      render: (r) => (
        <div className="stackcell">
          <strong>{r.title}</strong>
          {r.summary && <span className="stackcellsub">{r.summary}</span>}
        </div>
      ),
    },
    ...(extra ? [extra] : []),
    {
      key: "date",
      header: type === "pages" ? "آخرین ویرایش" : "تاریخ",
      render: (r) => <span dir="ltr">{toFaDigits(r.updatedAt || r.date)}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.status === "published" ? "success" : "slate"}>
          {r.status === "published" ? "منتشرشده" : "پیش‌نویس"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "colactions",
      render: (r) => <RowActions module="content" label={r.title} editTo={`/site-content/${type}/${r.id}`} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={<AddAction module="content" to={`/site-content/${type}/new`}>{addLabel}</AddAction>}
      />
      <DataTable columns={columns} rows={rows} footer={`${tofa(rows.length)} مورد`} />
    </div>
  );
};

export default ContentList;

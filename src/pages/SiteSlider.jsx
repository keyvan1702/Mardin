import React from "react";
import PageHeader from "../component/ui/PageHeader";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_SLIDES } from "../services/mockData";
import { tofa } from "../utils/format";

const SiteSlider = () => {
  const columns = [
    { key: "order", header: "ترتیب", render: (r) => <span className="ordernum">{tofa(r.order)}</span> },
    { key: "title", header: "عنوان اسلاید", render: (r) => <strong>{r.title}</strong> },
    {
      key: "active",
      header: "وضعیت",
      render: (r) => <Badge tone={r.active ? "success" : "slate"}>{r.active ? "نمایش" : "پنهان"}</Badge>,
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="content" label={r.title} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="اسلایدر"
        subtitle="اسلایدهای صفحه‌ی اصلی و ترتیب نمایش آن‌ها"
        actions={<AddAction module="content">اسلاید جدید</AddAction>}
      />
      <DataTable columns={columns} rows={MOCK_SLIDES} footer={`${tofa(MOCK_SLIDES.length)} اسلاید`} />
    </div>
  );
};

export default SiteSlider;

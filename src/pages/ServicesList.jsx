import React from "react";
import PageHeader from "../component/ui/PageHeader";
import RowActions from "../component/ui/RowActions";
import AddAction from "../component/ui/AddAction";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_SERVICES } from "../services/mockData";
import { tofa } from "../utils/format";

const ServicesList = () => {
  const columns = [
    { key: "name", header: "نام خدمت", render: (r) => <strong>{r.name}</strong> },
    { key: "basePrice", header: "قیمت پایه", render: (r) => `${tofa(r.basePrice)} تومان` },
    {
      key: "active",
      header: "وضعیت",
      render: (r) => <Badge tone={r.active ? "success" : "slate"}>{r.active ? "فعال" : "غیرفعال"}</Badge>,
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="services" label={r.name} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="مدیریت خدمات"
        subtitle="خدماتی که مشتریان می‌توانند درخواست کنند"
        actions={<AddAction module="services">خدمت جدید</AddAction>}
      />
      <DataTable columns={columns} rows={MOCK_SERVICES} footer={`${tofa(MOCK_SERVICES.length)} خدمت`} />
    </div>
  );
};

export default ServicesList;

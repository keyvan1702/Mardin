import React from "react";
import PageHeader from "../component/ui/PageHeader";
import RowActions from "../component/ui/RowActions";
import AddAction from "../component/ui/AddAction";
import DataTable from "../component/table/DataTable";
import { MOCK_CATEGORIES } from "../services/mockData";
import { tofa } from "../utils/format";

const ProductsCategories = () => {
  const columns = [
    { key: "name", header: "نام دسته", render: (r) => <strong>{r.name}</strong> },
    { key: "count", header: "تعداد محصول", render: (r) => tofa(r.count) },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="products" label={r.name} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="دسته‌بندی محصولات"
        subtitle="محصولات را در دسته‌ها سازمان‌دهی کنید"
        actions={<AddAction module="products">دسته جدید</AddAction>}
      />
      <DataTable columns={columns} rows={MOCK_CATEGORIES} footer={`${tofa(MOCK_CATEGORIES.length)} دسته`} />
    </div>
  );
};

export default ProductsCategories;

import React from "react";
import PageHeader from "../component/ui/PageHeader";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import useCrudPage from "../component/crud/useCrudPage";
import DataTable from "../component/table/DataTable";
import { useCollection } from "../services/store";
import { categoriesApi } from "../services/actions";
import { tofa } from "../utils/format";

const FIELDS = [{ key: "name", label: "نام دسته‌بندی", type: "text", required: true }];

const ProductsCategories = () => {
  const categories = useCollection("categories");
  const products = useCollection("products");
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(categoriesApi, "دسته‌بندی");

  const columns = [
    { key: "name", header: "نام دسته", render: (r) => <strong>{r.name}</strong> },
    { key: "count", header: "تعداد محصول", render: (r) => tofa(products.filter((p) => p.category === r.name).length) },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="products" label={r.name} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="دسته‌بندی محصولات"
        subtitle="محصولات را در دسته‌ها سازمان‌دهی کنید"
        actions={<AddAction module="products" onClick={() => setEditing({})}>دسته جدید</AddAction>}
      />
      <DataTable columns={columns} rows={categories} empty="دسته‌ای ثبت نشده است." footer={`${tofa(categories.length)} دسته`} />
      {editing && (
        <FormDialog title={editing.id ? "ویرایش دسته‌بندی" : "دسته‌ی جدید"} fields={FIELDS} row={editing.id ? editing : null} onSubmit={save} onClose={() => setEditing(null)} size="sm" />
      )}
      {deleting && <ConfirmDialog title="حذف دسته‌بندی" message={`دسته‌ی «${deleting.name}» حذف شود؟`} onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
};

export default ProductsCategories;

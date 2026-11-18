import React, { useMemo, useState } from "react";
import { LuPackage, LuPackageCheck, LuTriangleAlert, LuPackageX } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import useCrudPage from "../component/crud/useCrudPage";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useCollection } from "../services/store";
import { productsApi } from "../services/actions";
import { norm, tofa } from "../utils/format";

const LOW = 5; // موجودی کمتر یا مساوی این «کم‌موجود» حساب می‌شود
const stateOf = (p) => (p.stock === 0 ? "out" : p.stock <= LOW ? "low" : "ok");
const STATE = {
  ok: { label: "موجود", tone: "success" },
  low: { label: "کم‌موجود", tone: "gold" },
  out: { label: "ناموجود", tone: "danger" },
};

const ProductsList = () => {
  const products = useCollection("products");
  const categories = useCollection("categories");
  const { editing, setEditing, deleting, setDeleting, save, remove } = useCrudPage(productsApi, "محصول");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const fields = [
    { key: "name", label: "نام محصول", type: "text", required: true, span: 2 },
    { key: "category", label: "دسته‌بندی", type: "select", required: true, options: categories.map((c) => c.name) },
    { key: "stock", label: "موجودی انبار", type: "number", default: "0" },
    { key: "price", label: "قیمت", type: "money", required: true, span: 2 },
  ];

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return products.filter((p) => (tab === "all" || stateOf(p) === tab) && (!q || norm(p.name).includes(q) || norm(p.category).includes(q)));
  }, [products, query, tab]);

  const n = (s) => products.filter((p) => stateOf(p) === s).length;

  const columns = [
    { key: "name", header: "نام محصول", render: (r) => <strong>{r.name}</strong> },
    { key: "category", header: "دسته" },
    { key: "price", header: "قیمت", render: (r) => `${tofa(r.price)} تومان` },
    { key: "stock", header: "موجودی", render: (r) => tofa(r.stock) },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={STATE[stateOf(r)].tone}>{STATE[stateOf(r)].label}</Badge> },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) => <RowActions module="products" label={r.name} onEdit={() => setEditing(r)} onDelete={() => setDeleting(r)} />,
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="فهرست محصولات"
        subtitle="قیمت و موجودی محصولات؛ وضعیت از روی موجودی انبار تعیین می‌شود"
        actions={<AddAction module="products" onClick={() => setEditing({})}>محصول جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی محصولات", value: products.length, icon: LuPackage, tone: "gold" },
          { label: "موجود", value: n("ok"), icon: LuPackageCheck, tone: "success" },
          { label: "کم‌موجود", value: n("low"), icon: LuTriangleAlert, tone: "gold" },
          { label: "ناموجود", value: n("out"), icon: LuPackageX, tone: "danger" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["all", "همه"], ["ok", "موجود"], ["low", "کم‌موجود"], ["out", "ناموجود"]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام یا دسته..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="محصولی پیدا نشد." footer={`${tofa(rows.length)} محصول`} />

      {editing && (
        <FormDialog
          title={editing.id ? "ویرایش محصول" : "محصول جدید"}
          fields={fields}
          row={editing.id ? editing : null}
          onSubmit={save}
          onClose={() => setEditing(null)}
          size="md"
        />
      )}
      {deleting && <ConfirmDialog title="حذف محصول" message={`«${deleting.name}» حذف شود؟`} onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
};

export default ProductsList;

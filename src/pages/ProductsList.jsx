import React, { useMemo, useState } from "react";
import { LuPackage, LuPackageCheck, LuTriangleAlert, LuPackageX } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import RowActions from "../component/ui/RowActions";
import AddAction from "../component/ui/AddAction";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_PRODUCTS } from "../services/mockData";
import { norm, tofa } from "../utils/format";

const LOW = 5; // موجودی کمتر از این «کم‌موجود» حساب می‌شود

const stateOf = (p) => (p.stock === 0 ? "out" : p.stock <= LOW ? "low" : "ok");
const STATE = {
  ok: { label: "موجود", tone: "success" },
  low: { label: "کم‌موجود", tone: "gold" },
  out: { label: "ناموجود", tone: "danger" },
};

const ProductsList = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_PRODUCTS.filter(
      (p) =>
        (tab === "all" || stateOf(p) === tab) &&
        (!q || norm(p.name).includes(q) || norm(p.category).includes(q)),
    );
  }, [query, tab]);

  const n = (s) => MOCK_PRODUCTS.filter((p) => stateOf(p) === s).length;

  const columns = [
    { key: "name", header: "نام محصول", render: (r) => <strong>{r.name}</strong> },
    { key: "category", header: "دسته" },
    { key: "price", header: "قیمت", render: (r) => `${tofa(r.price)} تومان` },
    { key: "stock", header: "موجودی", render: (r) => tofa(r.stock) },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATE[stateOf(r)].tone}>{STATE[stateOf(r)].label}</Badge>,
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="products" label={r.name} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="فهرست محصولات"
        subtitle="قیمت و موجودی محصولات فروشگاه"
        actions={<AddAction module="products">محصول جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی محصولات", value: MOCK_PRODUCTS.length, icon: LuPackage, tone: "gold" },
          { label: "موجود", value: n("ok"), icon: LuPackageCheck, tone: "success" },
          { label: "کم‌موجود", value: n("low"), icon: LuTriangleAlert, tone: "gold" },
          { label: "ناموجود", value: n("out"), icon: LuPackageX, tone: "danger" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["ok", "موجود"],
            ["low", "کم‌موجود"],
            ["out", "ناموجود"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام یا دسته..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="محصولی پیدا نشد." footer={`${tofa(rows.length)} محصول`} />
    </div>
  );
};

export default ProductsList;

import React from "react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_PRODUCTS } from "../services/mockData";
import { tofa } from "../utils/format";

const ProductsList = () => {
  const columns = [
    { key: "name", header: "نام محصول", render: (r) => <strong>{r.name}</strong> },
    { key: "category", header: "دسته" },
    { key: "price", header: "قیمت", render: (r) => tofa(r.price) + " تومان" },
    { key: "stock", header: "موجودی", render: (r) => tofa(r.stock) },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.stock === 0 ? "danger" : "success"}>
          {r.stock === 0 ? "ناموجود" : "موجود"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "عملیات",
      render: () => (
        <div className="table-actions">
          <button type="button" className="btnicon"><LuPencil /></button>
          <button type="button" className="btnicon btnicon-danger"><LuTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <div className="pagehead">
        <h1 className="pagetitle"><span>فهرست محصولات</span></h1>
        <button type="button" className="btnprimary"><LuPlus /> محصول جدید</button>
      </div>
      <DataTable columns={columns} rows={MOCK_PRODUCTS} />
    </div>
  );
};

export default ProductsList;
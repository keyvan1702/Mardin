import React from "react";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import { MOCK_CATEGORIES } from "../services/mockData";
import { tofa } from "../utils/format";

const ProductsCategories = () => {
  const columns = [
    { key: "name", header: "نام دسته", render: (r) => <strong>{r.name}</strong> },
    { key: "count", header: "تعداد محصول", render: (r) => tofa(r.count) },
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
        <h1 className="pagetitle"><span>دسته‌بندی محصولات</span></h1>
        <button type="button" className="btnprimary"><LuPlus /> دسته جدید</button>
      </div>
      <DataTable columns={columns} rows={MOCK_CATEGORIES} />
    </div>
  );
};

export default ProductsCategories;
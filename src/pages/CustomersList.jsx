import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuPlus, LuPencil, LuTrash2, LuSearch } from "react-icons/lu";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_CUSTOMERS } from "../services/mockData";

const STATUS = {
  active: { label: "فعال", tone: "success" },
  inactive: { label: "غیرفعال", tone: "slate" },
  blocked: { label: "مسدود", tone: "danger" },
};

const CustomersList = () => {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim();
    if (!q) return MOCK_CUSTOMERS;
    return MOCK_CUSTOMERS.filter(
      (c) => c.name.includes(q) || c.phone.includes(q) || c.city.includes(q),
    );
  }, [query]);

  const columns = [
    { key: "name", header: "نام مشتری", render: (r) => <strong>{r.name}</strong> },
    { key: "phone", header: "تلفن", render: (r) => <span dir="ltr">{r.phone}</span> },
    { key: "city", header: "شهر" },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    { key: "joinedAt", header: "تاریخ عضویت", render: (r) => <span dir="ltr">{r.joinedAt}</span> },
    {
      key: "actions",
      header: "عملیات",
      render: () => (
        <div className="table-actions">
          <button type="button" className="btnicon" aria-label="ویرایش">
            <LuPencil />
          </button>
          <button type="button" className="btnicon btnicon-danger" aria-label="حذف">
            <LuTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <div className="pagehead">
        <h1 className="pagetitle">
          <span>مدیریت مشتریان</span>
        </h1>
        <Link to="/customers/new" className="btnprimary">
          <LuPlus /> افزودن مشتری
        </Link>
      </div>

      <div className="toolbar">
        <label className="fieldbox" style={{ height: 46, flex: "0 1 320px" }}>
          <LuSearch className="fieldicon" />
          <input
            type="search"
            placeholder="جستجو بر اساس نام، تلفن یا شهر..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {rows.length} مشتری
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        empty="مشتری‌ای با این مشخصات پیدا نشد."
      />
    </div>
  );
};

export default CustomersList;
import React, { useMemo, useState } from "react";
import { LuSearch, LuMapPin, LuPhone, LuClock, LuCircleCheck, LuCircleX } from "react-icons/lu";
import Badge from "../component/table/Badge";
import DataTable from "../component/table/DataTable";
import { MOCK_MISSIONS } from "../services/mockData";
import { tofa } from "../utils/format";

const STATUS = {
  pending: { label: "جستجوی نصاب", tone: "gold" },
  accepted: { label: "پذیرفته‌شده", tone: "success" },
  rejected: { label: "رد‌شده", tone: "danger" },
  done: { label: "تمام‌شده", tone: "slate" },
};

const MissionsList = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("active");

  const rows = useMemo(() => {
    let list = MOCK_MISSIONS;
    if (tab === "active") list = list.filter((m) => m.status === "pending" || m.status === "accepted");
    if (tab === "done") list = list.filter((m) => m.status === "done");
    if (tab === "rejected") list = list.filter((m) => m.status === "rejected");
    const q = query.trim();
    if (q) {
      list = list.filter(
        (m) => m.customer.includes(q) || m.service.includes(q) || m.city.includes(q),
      );
    }
    return list;
  }, [query, tab]);

  const columns = [
    { key: "id", header: "#", render: (r) => <span dir="ltr">#{r.id}</span> },
    { key: "customer", header: "مشتری", render: (r) => <strong>{r.customer}</strong> },
    { key: "service", header: "خدمت" },
    {
      key: "address",
      header: "آدرس",
      render: (r) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <LuMapPin /> {r.city} - {r.address}
        </span>
      ),
    },
    { key: "price", header: "هزینه", render: (r) => tofa(r.price) + " تومان" },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>,
    },
    {
      key: "installer",
      header: "نصاب",
      render: (r) => (r.installer ? r.installer : "—"),
    },
    {
      key: "createdAt",
      header: "زمان ثبت",
      render: (r) => <span dir="ltr">{r.createdAt}</span>,
    },
  ];

  return (
    <div className="modulepage">
      <div className="pagehead">
        <h1 className="pagetitle"><span>درخواست‌های تعمیر</span></h1>
      </div>

      <div className="toolbar">
        <div className="tabbar">
          {[
            ["active", "فعال"],
            ["done", "تمام‌شده"],
            ["rejected", "رد‌شده"],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`tab ${tab === k ? "tabactive" : ""}`}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="fieldbox" style={{ height: 46, flex: "0 1 320px", marginInlineStart: "auto" }}>
          <LuSearch className="fieldicon" />
          <input
            type="search"
            placeholder="جستجوی مشتری، خدمت یا شهر..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        empty="درخواستی در این دسته وجود ندارد."
      />
    </div>
  );
};

export default MissionsList;
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuBadgeCheck, LuTriangleAlert, LuShieldOff } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useCollection } from "../services/store";
import { WARRANTY_STATUS, nextService, warrantyInfo } from "../utils/warranty";
import { fmtDate, norm, tofa } from "../utils/format";

// وضعیت گارانتی همه‌ی محصولات؛ به‌صورت خودکار از تاریخ نصب محاسبه می‌شود
const WarrantiesList = () => {
  const qrs = useCollection("qr");
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const items = useMemo(
    () => qrs.map((q) => ({ ...q, w: warrantyInfo(q.installedAt, q.warrantyMonths), next: nextService(q.installedAt, q.serviceEvery) })).sort((a, b) => a.w.days - b.w.days),
    [qrs],
  );

  const q = norm(query.trim());
  const rows = items.filter((i) => (tab === "all" || i.w.status === tab) && (!q || norm(i.product).includes(q) || norm(i.customer).includes(q)));
  const n = (s) => items.filter((i) => i.w.status === s).length;

  const columns = [
    { key: "customer", header: "مشتری و محصول", render: (r) => <Person name={r.customer} sub={r.product} /> },
    { key: "installedAt", header: "تاریخ نصب", render: (r) => fmtDate(r.installedAt) },
    { key: "end", header: "پایان گارانتی", render: (r) => fmtDate(r.w.end) },
    { key: "days", header: "باقی‌مانده", render: (r) => (r.w.days >= 0 ? `${tofa(r.w.days)} روز` : <span className="muted">پایان‌یافته</span>) },
    { key: "next", header: "سرویس بعدی", render: (r) => fmtDate(r.next) },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={WARRANTY_STATUS[r.w.status].tone}>{WARRANTY_STATUS[r.w.status].label}</Badge> },
    { key: "open", header: "", className: "colactions", render: (r) => <Link to={`/products/qr/${r.id}`} className="btnsecondary btnxs">پرونده</Link> },
  ];

  return (
    <div className="modulepage">
      <PageHeader title="گارانتی و سرویس دوره‌ای" subtitle="تشخیص خودکار وضعیت گارانتی و زمان سرویس بعدی هر محصول" />
      <StatStrip
        items={[
          { label: "گارانتی فعال", value: n("active"), icon: LuBadgeCheck, tone: "success" },
          { label: "رو به پایان (۳۰ روز)", value: n("expiring"), icon: LuTriangleAlert, tone: "gold" },
          { label: "پایان‌یافته", value: n("expired"), icon: LuShieldOff, tone: "danger" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["all", "همه", items.length], ["active", "فعال", n("active")], ["expiring", "رو به پایان", n("expiring")], ["expired", "پایان‌یافته", n("expired")]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی مشتری یا محصول..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="موردی پیدا نشد." footer={`${tofa(rows.length)} محصول`} />
    </div>
  );
};

export default WarrantiesList;

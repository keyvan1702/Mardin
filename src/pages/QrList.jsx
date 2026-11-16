import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuQrCode, LuCircleCheck, LuCircleOff, LuTriangleAlert } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import AddAction from "../component/ui/AddAction";
import QrPreview from "../component/ui/QrPreview";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_QR } from "../services/mockData";
import { WARRANTY_STATUS, warrantyInfo } from "../utils/warranty";
import { fmtDate, norm, tofa } from "../utils/format";

const QrList = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const items = useMemo(
    () => MOCK_QR.map((q) => ({ ...q, warranty: warrantyInfo(q.installedAt, q.warrantyMonths) })),
    [],
  );

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return items.filter(
      (i) =>
        (tab === "all" || (tab === "active" ? i.active : !i.active)) &&
        (!q || norm(i.code).includes(q) || norm(i.product).includes(q) || norm(i.customer).includes(q)),
    );
  }, [items, query, tab]);

  const columns = [
    {
      key: "code",
      header: "QR و محصول",
      render: (r) => (
        <div className="qrcell">
          <QrPreview code={r.code} size={44} inactive={!r.active} />
          <div className="stackcell">
            <Link to={`/products/qr/${r.id}`} className="textlink">
              <strong>{r.product}</strong>
            </Link>
            <span className="stackcellsub" dir="ltr">
              {r.code}
            </span>
          </div>
        </div>
      ),
    },
    { key: "customer", header: "مشتری" },
    { key: "installer", header: "نصاب" },
    { key: "installedAt", header: "تاریخ نصب", render: (r) => fmtDate(r.installedAt) },
    {
      key: "warranty",
      header: "گارانتی",
      render: (r) => (
        <Badge tone={WARRANTY_STATUS[r.warranty.status].tone}>{WARRANTY_STATUS[r.warranty.status].label}</Badge>
      ),
    },
    {
      key: "active",
      header: "QR",
      render: (r) => <Badge tone={r.active ? "success" : "slate"}>{r.active ? "فعال" : "غیرفعال"}</Badge>,
    },
    {
      key: "open",
      header: "",
      className: "colactions",
      render: (r) => (
        <Link to={`/products/qr/${r.id}`} className="btnsecondary btnxs">
          پرونده
        </Link>
      ),
    },
  ];

  const n = (f) => items.filter(f).length;

  return (
    <div className="modulepage">
      <PageHeader
        title="QR کد و پرونده محصول"
        subtitle="برای هر کرکره یک QR اختصاصی و یک پرونده شامل مدل، موتور، نصاب، گارانتی و سوابق تعمیر"
        actions={<AddAction module="qr">تولید QR جدید</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی QRها", value: items.length, icon: LuQrCode, tone: "gold" },
          { label: "فعال", value: n((i) => i.active), icon: LuCircleCheck, tone: "success" },
          { label: "غیرفعال", value: n((i) => !i.active), icon: LuCircleOff, tone: "slate" },
          { label: "گارانتی رو به پایان", value: n((i) => i.warranty.status === "expiring"), icon: LuTriangleAlert, tone: "danger" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه"],
            ["active", "فعال"],
            ["inactive", "غیرفعال"],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی کد، محصول یا مشتری..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="QRی پیدا نشد." footer={`${tofa(rows.length)} مورد`} />
    </div>
  );
};

export default QrList;

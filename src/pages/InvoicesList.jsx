import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuReceipt, LuCircleCheck, LuClock, LuFileText, LuSend, LuCheck } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { MOCK_INVOICES, invoiceTotal } from "../services/mockData";
import { norm, toFaDigits, tofa } from "../utils/format";

const PAY = {
  paid: { label: "پرداخت‌شده", tone: "success" },
  pending: { label: "در انتظار پرداخت", tone: "gold" },
  cancelled: { label: "لغوشده", tone: "danger" },
};

const InvoicesList = () => {
  const toast = useToast();
  const { edit } = usePermissions();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState(() => new Set(MOCK_INVOICES.filter((i) => i.linkSent).map((i) => i.id)));

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return MOCK_INVOICES.filter(
      (i) =>
        (tab === "all" || i.payment === tab) &&
        (!q || norm(i.number).includes(q) || norm(i.customer).includes(q)),
    );
  }, [tab, query]);

  const sum = (f) => MOCK_INVOICES.filter(f).reduce((s, i) => s + invoiceTotal(i), 0);
  const n = (p) => MOCK_INVOICES.filter((i) => i.payment === p).length;

  const sendLink = (inv) => {
    setSent((s) => new Set(s).add(inv.id));
    toast.success(`لینک فاکتور ${toFaDigits(inv.number)} برای مشتری ارسال شد`);
  };

  const columns = [
    { key: "number", header: "شماره", render: (r) => <strong dir="ltr">{toFaDigits(r.number)}</strong> },
    { key: "customer", header: "مشتری", render: (r) => <Person name={r.customer} sub={r.type === "invoice" ? "فاکتور" : "پیش‌فاکتور"} /> },
    { key: "date", header: "تاریخ", render: (r) => <span dir="ltr">{toFaDigits(r.date)}</span> },
    { key: "total", header: "مبلغ", render: (r) => `${tofa(invoiceTotal(r))} تومان` },
    {
      key: "payment",
      header: "پرداخت",
      render: (r) => <Badge tone={PAY[r.payment].tone}>{PAY[r.payment].label}</Badge>,
    },
    {
      key: "link",
      header: "لینک فاکتور",
      render: (r) =>
        sent.has(r.id) ? (
          <span className="sentmark">
            <LuCheck /> ارسال شد
          </span>
        ) : edit("invoices") ? (
          <button type="button" className="btnsecondary btnxs" onClick={() => sendLink(r)}>
            <LuSend /> ارسال لینک
          </button>
        ) : (
          <span className="muted">—</span>
        ),
    },
    { key: "actions", header: "", className: "colactions", render: (r) => <RowActions module="invoices" label={r.number} /> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="فاکتورها"
        subtitle="فاکتور و پیش‌فاکتور خدمات و قطعات؛ مشتری آن‌ها را در پنل خودش می‌بیند"
        actions={<AddAction module="invoices" to="/finance/new">ثبت فاکتور</AddAction>}
      />
      <StatStrip
        items={[
          { label: "همه‌ی فاکتورها", value: MOCK_INVOICES.length, icon: LuReceipt, tone: "gold" },
          { label: "دریافت‌شده (تومان)", value: tofa(sum((i) => i.payment === "paid")), icon: LuCircleCheck, tone: "success" },
          { label: "در انتظار پرداخت (تومان)", value: tofa(sum((i) => i.payment === "pending")), icon: LuClock, tone: "info" },
          { label: "پیش‌فاکتور", value: MOCK_INVOICES.filter((i) => i.type === "proforma").length, icon: LuFileText, tone: "slate" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs
          value={tab}
          onChange={setTab}
          options={[
            ["all", "همه", MOCK_INVOICES.length],
            ["paid", "پرداخت‌شده", n("paid")],
            ["pending", "در انتظار", n("pending")],
            ["cancelled", "لغوشده", n("cancelled")],
          ]}
        />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی شماره یا مشتری..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="فاکتوری پیدا نشد." footer={`${tofa(rows.length)} فاکتور`} />
    </div>
  );
};

export default InvoicesList;

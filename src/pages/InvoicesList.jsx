import React, { useMemo, useState } from "react";
import { LuReceipt, LuCircleCheck, LuClock, LuFileText, LuSend, LuCheck, LuBanknote } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import StatStrip from "../component/ui/StatStrip";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import Person from "../component/ui/Person";
import AddAction from "../component/ui/AddAction";
import RowActions from "../component/ui/RowActions";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useCollection } from "../services/store";
import { invoicesApi } from "../services/actions";
import { fmtDate, norm, toFaDigits, tofa } from "../utils/format";

export const invoiceTotal = (inv) => inv.items.reduce((s, it) => s + it.qty * it.price, 0);

const PAY = {
  paid: { label: "پرداخت‌شده", tone: "success" },
  pending: { label: "در انتظار پرداخت", tone: "gold" },
  cancelled: { label: "لغوشده", tone: "danger" },
};

const InvoicesList = () => {
  const invoices = useCollection("invoices");
  const toast = useToast();
  const { edit } = usePermissions();
  const canEdit = edit("invoices");
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return invoices.filter((i) => (tab === "all" || i.payment === tab) && (!q || norm(i.number).includes(q) || norm(i.customer).includes(q)));
  }, [invoices, tab, query]);

  const sum = (f) => invoices.filter(f).reduce((s, i) => s + invoiceTotal(i), 0);
  const n = (p) => invoices.filter((i) => i.payment === p).length;

  const columns = [
    { key: "number", header: "شماره", render: (r) => <strong dir="ltr">{toFaDigits(r.number)}</strong> },
    { key: "customer", header: "مشتری", render: (r) => <Person name={r.customer} sub={r.type === "invoice" ? "فاکتور" : "پیش‌فاکتور"} /> },
    { key: "date", header: "تاریخ", render: (r) => fmtDate(r.date) },
    { key: "total", header: "مبلغ", render: (r) => `${tofa(invoiceTotal(r))} تومان` },
    { key: "payment", header: "پرداخت", render: (r) => <Badge tone={PAY[r.payment].tone}>{PAY[r.payment].label}</Badge> },
    {
      key: "link", header: "لینک فاکتور",
      render: (r) =>
        r.linkSent ? (
          <span className="sentmark"><LuCheck /> ارسال شد</span>
        ) : canEdit && r.payment !== "cancelled" ? (
          <button type="button" className="btnsecondary btnxs" onClick={() => { invoicesApi.sendLink(r.id); toast.success(`لینک فاکتور ${toFaDigits(r.number)} برای ${r.customer} ارسال شد`); }}>
            <LuSend /> ارسال لینک
          </button>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: "actions", header: "", className: "colactions",
      render: (r) =>
        canEdit && (
          <div className="table-actions">
            {r.payment === "pending" && (
              <button type="button" className="btnicon" title="ثبت پرداخت" aria-label={`ثبت پرداخت ${r.number}`} onClick={() => { invoicesApi.setPayment(r.id, "paid"); toast.success("پرداخت ثبت شد"); }}>
                <LuBanknote />
              </button>
            )}
            <RowActions label={r.number} editTo={`/finance/${r.id}`} onDelete={() => setDeleting(r)} />
          </div>
        ),
    },
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
          { label: "همه‌ی فاکتورها", value: invoices.length, icon: LuReceipt, tone: "gold" },
          { label: "دریافت‌شده (تومان)", value: tofa(sum((i) => i.payment === "paid")), icon: LuCircleCheck, tone: "success" },
          { label: "در انتظار پرداخت (تومان)", value: tofa(sum((i) => i.payment === "pending")), icon: LuClock, tone: "info" },
          { label: "پیش‌فاکتور", value: invoices.filter((i) => i.type === "proforma").length, icon: LuFileText, tone: "slate" },
        ]}
      />
      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["all", "همه", invoices.length], ["paid", "پرداخت‌شده", n("paid")], ["pending", "در انتظار", n("pending")], ["cancelled", "لغوشده", n("cancelled")]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی شماره یا مشتری..." />
      </div>
      <DataTable columns={columns} rows={rows} empty="فاکتوری پیدا نشد." footer={`${tofa(rows.length)} فاکتور`} />
      {deleting && <ConfirmDialog title="حذف فاکتور" message={`فاکتور ${deleting.number} حذف شود؟`} onConfirm={() => { invoicesApi.remove(deleting.id); toast.success("فاکتور حذف شد"); }} onClose={() => setDeleting(null)} />}
    </div>
  );
};

export default InvoicesList;

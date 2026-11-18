import React, { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LuArrowRight, LuPlus, LuTrash2, LuSave, LuSend } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import { FormFields, initialValues, validateFields } from "../component/crud/FormFields";
import { useToast } from "../component/ToastContext";
import { db, useCollection } from "../services/store";
import { invoicesApi } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { toLatinDigits, tofa } from "../utils/format";

const newRow = () => ({ id: Math.random().toString(36).slice(2), kind: "service", title: "", qty: "1", price: "" });
const num = (v) => Number(toLatinDigits(v).replace(/[^0-9]/g, "")) || 0;

// ثبت و ویرایش فاکتور خدمات و قطعات (/finance/new و /finance/:id)
const InvoiceForm = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const customers = useCollection("customers");
  const services = useCollection("services");
  const products = useCollection("products");
  const missions = useCollection("missions");
  const existing = id ? db.get("invoices", id) : null;

  // اگر از صفحه‌ی یک درخواست آمده باشیم، مشتری و خدمت آن از قبل پر می‌شود
  const fromMission = !existing && params.get("request") ? db.get("missions", params.get("request")) : null;

  const FIELDS = [
    { key: "customer", label: "مشتری", type: "select", required: true, options: customers.map((c) => c.name) },
    { key: "request", label: "درخواست مرتبط (اختیاری)", type: "select", options: missions.map((m) => ({ value: m.tracking, label: `${m.tracking} — ${m.service}` })), placeholder: "بدون درخواست" },
    { key: "type", label: "نوع سند", type: "select", required: true, default: "invoice", options: [{ value: "invoice", label: "فاکتور" }, { value: "proforma", label: "پیش‌فاکتور" }] },
    { key: "payment", label: "وضعیت پرداخت", type: "select", required: true, default: "pending", options: [{ value: "pending", label: "در انتظار پرداخت" }, { value: "paid", label: "پرداخت‌شده" }, { value: "cancelled", label: "لغوشده" }] },
  ];

  const [values, setValues] = useState(() =>
    initialValues(FIELDS, existing || (fromMission ? { customer: fromMission.customer, request: fromMission.tracking } : null)),
  );
  const [rows, setRows] = useState(() =>
    existing
      ? existing.items.map((it) => ({ id: Math.random().toString(36).slice(2), kind: it.kind, title: it.title, qty: String(it.qty), price: String(it.price) }))
      : fromMission
        ? [{ ...newRow(), title: fromMission.service, price: String(fromMission.price) }]
        : [newRow()],
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (id && !existing) {
    return (
      <div className="modulepage">
        <PageHeader title="فاکتور پیدا نشد" subtitle="این فاکتور وجود ندارد یا حذف شده است" />
        <Link to="/finance" className="btnsecondary"><LuArrowRight /> بازگشت به فهرست</Link>
      </div>
    );
  }

  const change = (k, v) => { setValues((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const setRow = (rid, patch) => setRows((rs) => rs.map((r) => (r.id === rid ? { ...r, ...patch } : r)));

  // با انتخاب خدمت یا قطعه از فهرست، قیمت خودکار پر می‌شود
  const pick = (row, title) => {
    const found = (row.kind === "service" ? services : products).find((x) => x.name === title);
    setRow(row.id, { title, price: found ? String(found.basePrice ?? found.price) : row.price });
  };

  const total = rows.reduce((s, r) => s + num(r.qty) * num(r.price), 0);

  const submit = (send) => (e) => {
    e.preventDefault();
    const errs = validateFields(FIELDS, values);
    const items = rows.filter((r) => r.title.trim()).map((r) => ({ kind: r.kind, title: r.title.trim(), qty: num(r.qty) || 1, price: num(r.price) }));
    if (!items.length) errs.items = "حداقل یک ردیف را کامل کنید.";
    setErrors(errs);
    if (Object.keys(errs).length) { if (errs.items) setFormError(errs.items); return; }
    try {
      const data = { customer: values.customer, request: values.request, type: values.type, payment: values.payment, items };
      const row = existing ? invoicesApi.update(existing.id, { ...data, linkSent: existing.linkSent }) : invoicesApi.create(data);
      if (send) invoicesApi.sendLink(row.id);
      toast.success(send ? "فاکتور ذخیره و لینک آن برای مشتری ارسال شد" : "فاکتور ذخیره شد");
      navigate("/finance");
    } catch (err) {
      setFormError(apiErrorMessage(err));
    }
  };

  return (
    <div className="modulepage">
      <PageHeader
        title={existing ? `ویرایش ${existing.number}` : "ثبت فاکتور"}
        subtitle="خدمات و قطعات را اضافه کنید؛ جمع کل خودکار محاسبه می‌شود"
        actions={<button type="button" className="btnsecondary" onClick={() => navigate("/finance")}><LuArrowRight /> بازگشت</button>}
      />
      <form className="formcard formcard-flush" onSubmit={submit(false)} noValidate>
        {formError && <p className="formerror formerror-inline" role="alert">{formError}</p>}
        <FormSection title="اطلاعات فاکتور" hint="مشتری، نوع سند و وضعیت پرداخت">
          <FormFields fields={FIELDS} values={values} errors={errors} onChange={change} />
        </FormSection>

        <FormSection title="اقلام" hint="خدمات و قطعات این فاکتور">
          <div className="itemrows">
            <div className="itemrow itemrow-head" aria-hidden="true">
              <span>نوع</span><span>شرح</span><span>تعداد</span><span>قیمت واحد (تومان)</span><span>جمع</span><span />
            </div>
            {rows.map((r) => (
              <div key={r.id} className="itemrow">
                <span className="fieldbox">
                  <select value={r.kind} onChange={(e) => setRow(r.id, { kind: e.target.value, title: "", price: "" })} aria-label="نوع">
                    <option value="service">خدمت</option>
                    <option value="part">قطعه</option>
                  </select>
                </span>
                <span className="fieldbox">
                  <input list={`opts-${r.id}`} value={r.title} onChange={(e) => pick(r, e.target.value)} placeholder="انتخاب یا تایپ کنید" aria-label="شرح" />
                  <datalist id={`opts-${r.id}`}>
                    {(r.kind === "service" ? services : products).map((x) => <option key={x.id} value={x.name} />)}
                  </datalist>
                </span>
                <span className="fieldbox"><input inputMode="numeric" dir="ltr" value={r.qty} onChange={(e) => setRow(r.id, { qty: e.target.value })} aria-label="تعداد" /></span>
                <span className="fieldbox"><input inputMode="numeric" dir="ltr" value={r.price} onChange={(e) => setRow(r.id, { price: e.target.value })} aria-label="قیمت واحد" /></span>
                <strong className="itemsum">{tofa(num(r.qty) * num(r.price))}</strong>
                <button type="button" className="btnicon btnicon-danger" onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.id !== r.id) : rs))} aria-label="حذف ردیف"><LuTrash2 /></button>
              </div>
            ))}
            <button type="button" className="btnsecondary btnxs addrow" onClick={() => setRows((rs) => [...rs, newRow()])}><LuPlus /> افزودن ردیف</button>
          </div>
          <div className="invoicetotal"><span>جمع کل</span><strong>{tofa(total)} تومان</strong></div>
        </FormSection>

        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate("/finance")}>انصراف</button>
          <button type="button" className="btnsecondary" onClick={submit(true)}><LuSend /> ذخیره و ارسال لینک</button>
          <button type="submit" className="btnprimary"><LuSave /> ذخیره فاکتور</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;

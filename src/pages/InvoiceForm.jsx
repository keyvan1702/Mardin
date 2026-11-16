import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuPlus, LuTrash2, LuSave, LuSend } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import { useToast } from "../component/ToastContext";
import { MOCK_CUSTOMERS, MOCK_MISSIONS, MOCK_PRODUCTS, MOCK_SERVICES } from "../services/mockData";
import { toLatinDigits, tofa } from "../utils/format";

const emptyRow = () => ({ id: Math.random().toString(36).slice(2), kind: "service", title: "", qty: "1", price: "" });
const num = (v) => Number(toLatinDigits(v).replace(/[^0-9]/g, "")) || 0;

// ثبت فاکتور خدمات و قطعات برای مشتری (فعلاً استاتیک)
const InvoiceForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ customer: "", type: "invoice", payment: "pending", request: "" });
  const [rows, setRows] = useState([emptyRow()]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setRow = (id, patch) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // با انتخاب خدمت یا قطعه از فهرست، قیمت پایه خودکار پر می‌شود
  const pick = (row, title) => {
    const list = row.kind === "service" ? MOCK_SERVICES : MOCK_PRODUCTS;
    const found = list.find((x) => x.name === title);
    setRow(row.id, { title, price: found ? String(found.basePrice ?? found.price) : row.price });
  };

  const total = rows.reduce((s, r) => s + num(r.qty) * num(r.price), 0);

  const submit = (send) => (e) => {
    e.preventDefault();
    if (!form.customer || rows.every((r) => !r.title)) {
      toast.error("مشتری و حداقل یک ردیف را وارد کنید");
      return;
    }
    toast.success(send ? "فاکتور ثبت و لینک آن برای مشتری ارسال شد" : "فاکتور ثبت شد");
    navigate("/finance");
  };

  return (
    <div className="modulepage">
      <PageHeader
        title="ثبت فاکتور"
        subtitle="خدمات و قطعات را اضافه کنید؛ جمع کل خودکار محاسبه می‌شود"
        actions={
          <button type="button" className="btnsecondary" onClick={() => navigate("/finance")}>
            <LuArrowRight /> بازگشت
          </button>
        }
      />

      <form className="formcard formcard-flush" onSubmit={submit(false)}>
        <FormSection title="اطلاعات فاکتور" hint="مشتری، نوع سند و وضعیت پرداخت">
          <div className="formgrid">
            <label className="field">
              <span className="fieldlabel">مشتری</span>
              <span className="fieldbox">
                <select value={form.customer} onChange={set("customer")} required>
                  <option value="">انتخاب کنید</option>
                  {MOCK_CUSTOMERS.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">درخواست مرتبط (اختیاری)</span>
              <span className="fieldbox">
                <select value={form.request} onChange={set("request")}>
                  <option value="">بدون درخواست</option>
                  {MOCK_MISSIONS.map((m) => (
                    <option key={m.id} value={m.tracking}>
                      {m.tracking} — {m.service}
                    </option>
                  ))}
                </select>
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">نوع سند</span>
              <span className="fieldbox">
                <select value={form.type} onChange={set("type")}>
                  <option value="invoice">فاکتور</option>
                  <option value="proforma">پیش‌فاکتور</option>
                </select>
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">وضعیت پرداخت</span>
              <span className="fieldbox">
                <select value={form.payment} onChange={set("payment")}>
                  <option value="pending">در انتظار پرداخت</option>
                  <option value="paid">پرداخت‌شده</option>
                  <option value="cancelled">لغوشده</option>
                </select>
              </span>
            </label>
          </div>
        </FormSection>

        <FormSection title="اقلام" hint="خدمات و قطعات این فاکتور">
          <div className="itemrows">
            <div className="itemrow itemrow-head" aria-hidden="true">
              <span>نوع</span>
              <span>شرح</span>
              <span>تعداد</span>
              <span>قیمت واحد (تومان)</span>
              <span>جمع</span>
              <span />
            </div>
            {rows.map((r) => (
              <div key={r.id} className="itemrow">
                <span className="fieldbox">
                  <select
                    value={r.kind}
                    onChange={(e) => setRow(r.id, { kind: e.target.value, title: "", price: "" })}
                    aria-label="نوع"
                  >
                    <option value="service">خدمت</option>
                    <option value="part">قطعه</option>
                  </select>
                </span>
                <span className="fieldbox">
                  <input
                    list={`opts-${r.id}`}
                    value={r.title}
                    onChange={(e) => pick(r, e.target.value)}
                    placeholder="انتخاب یا تایپ کنید"
                    aria-label="شرح"
                  />
                  <datalist id={`opts-${r.id}`}>
                    {(r.kind === "service" ? MOCK_SERVICES : MOCK_PRODUCTS).map((x) => (
                      <option key={x.id} value={x.name} />
                    ))}
                  </datalist>
                </span>
                <span className="fieldbox">
                  <input
                    inputMode="numeric"
                    dir="ltr"
                    value={r.qty}
                    onChange={(e) => setRow(r.id, { qty: e.target.value })}
                    aria-label="تعداد"
                  />
                </span>
                <span className="fieldbox">
                  <input
                    inputMode="numeric"
                    dir="ltr"
                    value={r.price}
                    onChange={(e) => setRow(r.id, { price: e.target.value })}
                    aria-label="قیمت واحد"
                  />
                </span>
                <strong className="itemsum">{tofa(num(r.qty) * num(r.price))}</strong>
                <button
                  type="button"
                  className="btnicon btnicon-danger"
                  onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.id !== r.id) : rs))}
                  aria-label="حذف ردیف"
                >
                  <LuTrash2 />
                </button>
              </div>
            ))}
            <button type="button" className="btnsecondary btnxs addrow" onClick={() => setRows((rs) => [...rs, emptyRow()])}>
              <LuPlus /> افزودن ردیف
            </button>
          </div>

          <div className="invoicetotal">
            <span>جمع کل</span>
            <strong>{tofa(total)} تومان</strong>
          </div>
        </FormSection>

        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate("/finance")}>
            انصراف
          </button>
          <button type="button" className="btnsecondary" onClick={submit(true)}>
            <LuSend /> ذخیره و ارسال لینک
          </button>
          <button type="submit" className="btnprimary">
            <LuSave /> ذخیره فاکتور
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;

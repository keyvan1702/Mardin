import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuArrowRight, LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import { FormFields, castValues, initialValues, validateFields } from "../component/crud/FormFields";
import { useToast } from "../component/ToastContext";
import { db, useCollection } from "../services/store";
import { missionsApi } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { FAULTS, PRIORITY } from "../services/constants";

// ثبت درخواست خدمات توسط اپراتور (مثلاً وقتی مشتری تلفنی درخواست می‌دهد)
const MissionForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const customers = useCollection("customers");
  const services = useCollection("services");

  const FIELDS_A = [
    { key: "customerId", label: "مشتری", type: "select", required: true, options: customers.filter((c) => c.status !== "blocked").map((c) => ({ value: c.id, label: `${c.name} — ${c.phone}` })), span: 2 },
    { key: "service", label: "خدمت", type: "select", required: true, options: services.filter((s) => s.active).map((s) => s.name) },
    { key: "priority", label: "اولویت", type: "select", required: true, default: "normal", options: Object.entries(PRIORITY).map(([value, p]) => ({ value, label: p.label })) },
    { key: "fault", label: "نوع خرابی (برای گزارش‌ها)", type: "select", options: Object.entries(FAULTS).map(([value, label]) => ({ value, label })) },
    { key: "price", label: "هزینه‌ی برآوردی", type: "money" },
  ];
  const FIELDS_B = [
    { key: "city", label: "شهر", type: "text", required: true },
    { key: "address", label: "آدرس", type: "text", required: true },
    { key: "description", label: "توضیح مشکل", type: "textarea", span: 2, required: true },
  ];

  const [values, setValues] = useState(() => initialValues([...FIELDS_A, ...FIELDS_B], { customerId: params.get("customer") || "" }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  // با انتخاب مشتری و خدمت، شهر/آدرس و قیمت پایه خودکار پر می‌شود
  const change = (k, v) => {
    setValues((s) => {
      const next = { ...s, [k]: v };
      if (k === "customerId") {
        const c = db.get("customers", v);
        if (c) { next.city = c.city || ""; next.address = c.address || ""; }
      }
      if (k === "service") {
        const sv = services.find((x) => x.name === v);
        if (sv) next.price = String(sv.basePrice);
      }
      return next;
    });
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const all = [...FIELDS_A, ...FIELDS_B];
    const errs = validateFields(all, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const data = castValues(all, values);
      const row = missionsApi.create({ ...data, customerId: Number(data.customerId) });
      toast.success(`درخواست ${row.tracking} ثبت شد`);
      navigate(`/missions/${row.id}`);
    } catch (err) {
      setFormError(apiErrorMessage(err));
    }
  };

  return (
    <div className="modulepage">
      <PageHeader
        title="ثبت درخواست خدمات"
        subtitle="شماره پیگیری به‌صورت خودکار ساخته و اعلان ثبت درخواست ارسال می‌شود"
        actions={<button type="button" className="btnsecondary" onClick={() => navigate("/missions")}><LuArrowRight /> بازگشت</button>}
      />
      <form className="formcard formcard-flush" onSubmit={submit} noValidate>
        {formError && <p className="formerror formerror-inline" role="alert">{formError}</p>}
        <FormSection title="مشتری و خدمت" hint="چه کسی چه خدمتی می‌خواهد">
          <FormFields fields={FIELDS_A} values={values} errors={errors} onChange={change} />
        </FormSection>
        <FormSection title="محل و توضیح" hint="تکنسین برای رفتن به محل به این اطلاعات نیاز دارد">
          <FormFields fields={FIELDS_B} values={values} errors={errors} onChange={change} autoFocusFirst={false} />
        </FormSection>
        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate("/missions")}>انصراف</button>
          <button type="submit" className="btnprimary"><LuSave /> ثبت درخواست</button>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;

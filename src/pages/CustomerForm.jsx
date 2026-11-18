import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import { FormFields, castValues, initialValues, validateFields } from "../component/crud/FormFields";
import { useToast } from "../component/ToastContext";
import { db } from "../services/store";
import { customersApi, } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";

const MAIN = [
  { key: "name", label: "نام و نام خانوادگی", type: "text", required: true },
  { key: "phone", label: "شماره موبایل", type: "tel", required: true, strictPhone: true, hint: "مشتری با همین شماره وارد پنل می‌شود" },
  { key: "email", label: "ایمیل", type: "email" },
  { key: "city", label: "شهر", type: "text" },
  { key: "address", label: "آدرس", type: "text", span: 2 },
];
const STATE = [
  {
    key: "status", label: "وضعیت", type: "select", required: true, default: "active",
    options: [{ value: "active", label: "فعال" }, { value: "inactive", label: "غیرفعال" }, { value: "blocked", label: "مسدود" }],
  },
  { key: "note", label: "یادداشت", type: "textarea", span: 2 },
];

// افزودن مشتری جدید (/customers/new) و ویرایش (/customers/:id)
const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const existing = id ? db.get("customers", id) : null;

  const [values, setValues] = useState(() => initialValues([...MAIN, ...STATE], existing));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (id && !existing) {
    return (
      <div className="modulepage">
        <PageHeader title="مشتری پیدا نشد" subtitle="این مشتری وجود ندارد یا حذف شده است" />
        <Link to="/customers" className="btnsecondary"><LuArrowRight /> بازگشت به فهرست</Link>
      </div>
    );
  }

  const change = (k, v) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const all = [...MAIN, ...STATE];
    const errs = validateFields(all, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const data = castValues(all, values);
      if (existing) {
        customersApi.update(existing.id, data);
        toast.success("اطلاعات مشتری ذخیره شد");
      } else {
        customersApi.create(data);
        toast.success("مشتری اضافه شد");
      }
      navigate("/customers");
    } catch (err) {
      setFormError(apiErrorMessage(err));
    }
  };

  return (
    <div className="modulepage">
      <PageHeader
        title={existing ? "ویرایش مشتری" : "افزودن مشتری"}
        subtitle={existing ? existing.name : "اطلاعات مشتری جدید را وارد کنید"}
        actions={<button type="button" className="btnsecondary" onClick={() => navigate("/customers")}><LuArrowRight /> بازگشت</button>}
      />
      <form className="formcard formcard-flush" onSubmit={submit} noValidate>
        {formError && <p className="formerror formerror-inline" role="alert">{formError}</p>}
        <FormSection title="اطلاعات اصلی" hint="نام و راه‌های ارتباط با مشتری">
          <FormFields fields={MAIN} values={values} errors={errors} onChange={change} />
        </FormSection>
        <FormSection title="وضعیت و یادداشت" hint="وضعیت حساب و نکته‌هایی که تیم باید بداند">
          <FormFields fields={STATE} values={values} errors={errors} onChange={change} autoFocusFirst={false} />
        </FormSection>
        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate("/customers")}>انصراف</button>
          <button type="submit" className="btnprimary"><LuSave /> ذخیره مشتری</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;

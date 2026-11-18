import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import { FormFields, castValues, initialValues, validateFields } from "../component/crud/FormFields";
import { useToast } from "../component/ToastContext";
import { db } from "../services/store";
import { contentApis, currentUser } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { daysFromNow } from "../utils/warranty";

const TYPES = {
  pages: { one: "صفحه", list: "/site-content/pages", slug: true, author: false, dateKey: "updatedAt" },
  articles: { one: "مقاله", list: "/site-content/articles", slug: false, author: true, dateKey: "date" },
  news: { one: "خبر", list: "/site-content/news", slug: false, author: false, dateKey: "date" },
};

// ثبت و ویرایش صفحه، مقاله و خبر (مدیریت محتوای ساده)
const ContentForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cfg = TYPES[type];
  const isNew = id === "new";
  const existing = cfg && !isNew ? db.get(type, id) : null;

  const MAIN = [
    { key: "title", label: "عنوان", type: "text", required: true, span: 2 },
    ...(cfg?.slug ? [{ key: "slug", label: "آدرس صفحه", type: "text", required: true, dir: "ltr", placeholder: "/about" }] : []),
    ...(cfg?.author ? [{ key: "author", label: "نویسنده", type: "text" }] : []),
    {
      key: "status", label: "وضعیت", type: "select", required: true, default: "draft",
      options: [{ value: "draft", label: "پیش‌نویس" }, { value: "published", label: "منتشرشده" }],
    },
  ];
  const BODY = [
    { key: "summary", label: "خلاصه", type: "text", span: 2 },
    { key: "body", label: "متن کامل", type: "textarea", rows: 10, span: 2 },
  ];

  const [values, setValues] = useState(() => initialValues([...MAIN, ...BODY], existing));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (!cfg || (!isNew && !existing)) {
    return (
      <div className="modulepage">
        <PageHeader title="مورد پیدا نشد" subtitle="این محتوا وجود ندارد یا حذف شده است" />
        <Link to="/site-content/pages" className="btnsecondary"><LuArrowRight /> بازگشت</Link>
      </div>
    );
  }

  const change = (k, v) => { setValues((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const submit = (e) => {
    e.preventDefault();
    const all = [...MAIN, ...BODY];
    const errs = validateFields(all, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const data = { ...castValues(all, values), [cfg.dateKey]: daysFromNow(0) };
      if (cfg.author && !data.author) data.author = currentUser()?.name || "";
      if (existing) contentApis[type].update(existing.id, data);
      else contentApis[type].create(data);
      toast.success(`${cfg.one} ذخیره شد`);
      navigate(cfg.list);
    } catch (err) {
      setFormError(apiErrorMessage(err));
    }
  };

  return (
    <div className="modulepage">
      <PageHeader
        title={existing ? `ویرایش ${cfg.one}` : `${cfg.one} جدید`}
        subtitle="متن را بر اساس محتوایی که کارفرما ارائه می‌دهد وارد کنید"
        actions={<button type="button" className="btnsecondary" onClick={() => navigate(cfg.list)}><LuArrowRight /> بازگشت</button>}
      />
      <form className="formcard formcard-flush" onSubmit={submit} noValidate>
        {formError && <p className="formerror formerror-inline" role="alert">{formError}</p>}
        <FormSection title="اطلاعات اصلی" hint="عنوان و وضعیت انتشار">
          <FormFields fields={MAIN} values={values} errors={errors} onChange={change} />
        </FormSection>
        <FormSection title="متن" hint="خلاصه در فهرست‌ها و متن کامل در صفحه نمایش داده می‌شود">
          <FormFields fields={BODY} values={values} errors={errors} onChange={change} autoFocusFirst={false} />
        </FormSection>
        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate(cfg.list)}>انصراف</button>
          <button type="submit" className="btnprimary"><LuSave /> ذخیره</button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;

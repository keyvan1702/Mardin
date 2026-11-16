import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import { useToast } from "../component/ToastContext";
import { MOCK_ARTICLES, MOCK_NEWS, MOCK_PAGES } from "../services/mockData";

const TYPES = {
  pages: { one: "صفحه", list: "/site-content/pages", rows: MOCK_PAGES, slug: true, summary: true },
  articles: { one: "مقاله", list: "/site-content/articles", rows: MOCK_ARTICLES, slug: false, summary: true },
  news: { one: "خبر", list: "/site-content/news", rows: MOCK_NEWS, slug: false, summary: true },
};

// فرم ساده‌ی ثبت و ویرایش صفحه، مقاله و خبر (مدیریت محتوای ساده)
const ContentForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cfg = TYPES[type];
  const existing = id !== "new" ? cfg?.rows.find((r) => String(r.id) === id) : null;

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    slug: existing?.slug ?? "",
    status: existing?.status ?? "draft",
    summary: existing?.summary ?? "",
    body: existing?.body ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (!cfg || (id !== "new" && !existing)) {
    return (
      <div className="modulepage">
        <PageHeader title="مورد پیدا نشد" subtitle="این محتوا وجود ندارد یا حذف شده است" />
        <Link to="/site-content/pages" className="btnsecondary">
          <LuArrowRight /> بازگشت
        </Link>
      </div>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    // فعلاً فقط بازگشت؛ بعداً api
    toast.success(`${cfg.one} ذخیره شد`);
    navigate(cfg.list);
  };

  return (
    <div className="modulepage">
      <PageHeader
        title={existing ? `ویرایش ${cfg.one}` : `${cfg.one} جدید`}
        subtitle="متن را بر اساس محتوایی که کارفرما ارائه می‌دهد وارد کنید"
        actions={
          <button type="button" className="btnsecondary" onClick={() => navigate(cfg.list)}>
            <LuArrowRight /> بازگشت
          </button>
        }
      />

      <form className="formcard formcard-flush" onSubmit={onSubmit}>
        <FormSection title="اطلاعات اصلی" hint="عنوان و وضعیت انتشار">
          <div className="formgrid">
            <label className="field full">
              <span className="fieldlabel">عنوان</span>
              <span className="fieldbox">
                <input value={form.title} onChange={set("title")} required />
              </span>
            </label>
            {cfg.slug && (
              <label className="field">
                <span className="fieldlabel">آدرس صفحه</span>
                <span className="fieldbox">
                  <input value={form.slug} onChange={set("slug")} dir="ltr" placeholder="/about" />
                </span>
              </label>
            )}
            <label className="field">
              <span className="fieldlabel">وضعیت</span>
              <span className="fieldbox">
                <select value={form.status} onChange={set("status")}>
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشرشده</option>
                </select>
              </span>
            </label>
          </div>
        </FormSection>

        <FormSection title="متن" hint="خلاصه در فهرست‌ها و متن کامل در صفحه نمایش داده می‌شود">
          <div className="formgrid">
            <label className="field full">
              <span className="fieldlabel">خلاصه</span>
              <span className="fieldbox">
                <input value={form.summary} onChange={set("summary")} />
              </span>
            </label>
            <label className="field full">
              <span className="fieldlabel">متن کامل</span>
              <span className="fieldbox fieldbox-textarea">
                <textarea value={form.body} onChange={set("body")} rows={10} />
              </span>
            </label>
          </div>
        </FormSection>

        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate(cfg.list)}>
            انصراف
          </button>
          <button type="submit" className="btnprimary">
            <LuSave /> ذخیره
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;

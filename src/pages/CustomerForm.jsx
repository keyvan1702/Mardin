import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";

const CustomerForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    status: "active",
    note: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // فعلاً فقط بازگشت؛ بعداً api.createCustomer
    navigate("/customers");
  };

  return (
    <div className="modulepage">
      <PageHeader
        title="افزودن مشتری"
        subtitle="اطلاعات مشتری جدید را وارد کنید"
        actions={
          <button type="button" className="btnsecondary" onClick={() => navigate("/customers")}>
            <LuArrowRight /> بازگشت
          </button>
        }
      />

      <form className="formcard formcard-flush" onSubmit={onSubmit}>
        <FormSection title="اطلاعات اصلی" hint="نام و راه‌های ارتباط با مشتری">
          <div className="formgrid">
            <label className="field">
              <span className="fieldlabel">نام و نام خانوادگی</span>
              <span className="fieldbox">
                <input value={form.name} onChange={set("name")} required />
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">شماره تلفن</span>
              <span className="fieldbox">
                <input value={form.phone} onChange={set("phone")} dir="ltr" inputMode="tel" />
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">ایمیل</span>
              <span className="fieldbox">
                <input type="email" value={form.email} onChange={set("email")} dir="ltr" />
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">شهر</span>
              <span className="fieldbox">
                <input value={form.city} onChange={set("city")} />
              </span>
            </label>
          </div>
        </FormSection>

        <FormSection title="وضعیت و یادداشت" hint="وضعیت حساب و نکته‌هایی که تیم باید بداند">
          <div className="formgrid">
            <label className="field">
              <span className="fieldlabel">وضعیت</span>
              <span className="fieldbox">
                <select value={form.status} onChange={set("status")}>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                  <option value="blocked">مسدود</option>
                </select>
              </span>
            </label>
            <label className="field full">
              <span className="fieldlabel">یادداشت</span>
              <span className="fieldbox fieldbox-textarea">
                <textarea value={form.note} onChange={set("note")} rows={4} />
              </span>
            </label>
          </div>
        </FormSection>

        <div className="formbar">
          <button type="button" className="btnsecondary" onClick={() => navigate("/customers")}>
            انصراف
          </button>
          <button type="submit" className="btnprimary">
            <LuSave /> ذخیره مشتری
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;

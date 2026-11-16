import React, { useState } from "react";
import { LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";

const SettingsGeneral = () => {
  const [form, setForm] = useState({
    siteName: "ماردین",
    phone: "02112345678",
    email: "info@mardin.ir",
    address: "تهران، خیابان ولیعصر",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="modulepage">
      <PageHeader title="تنظیمات عمومی" subtitle="اطلاعاتی که در سایت و پیام‌ها نمایش داده می‌شود" />
      <form className="formcard formcard-flush" onSubmit={(e) => e.preventDefault()}>
        <FormSection title="اطلاعات سایت" hint="نامی که مشتریان می‌بینند">
          <div className="formgrid">
            <label className="field full">
              <span className="fieldlabel">نام سایت</span>
              <span className="fieldbox">
                <input value={form.siteName} onChange={set("siteName")} />
              </span>
            </label>
          </div>
        </FormSection>

        <FormSection title="راه‌های ارتباطی" hint="مشتریان برای پشتیبانی با این موارد تماس می‌گیرند">
          <div className="formgrid">
            <label className="field">
              <span className="fieldlabel">تلفن پشتیبانی</span>
              <span className="fieldbox">
                <input value={form.phone} onChange={set("phone")} dir="ltr" inputMode="tel" />
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">ایمیل</span>
              <span className="fieldbox">
                <input value={form.email} onChange={set("email")} dir="ltr" />
              </span>
            </label>
            <label className="field full">
              <span className="fieldlabel">آدرس</span>
              <span className="fieldbox">
                <input value={form.address} onChange={set("address")} />
              </span>
            </label>
          </div>
        </FormSection>

        <div className="formbar">
          <button type="submit" className="btnprimary">
            <LuSave /> ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsGeneral;

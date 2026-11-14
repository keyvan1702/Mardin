import React, { useState } from "react";
import { LuSave } from "react-icons/lu";

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
      <h1 className="pagetitle"><span>تنظیمات عمومی</span></h1>
      <form className="formcard" onSubmit={(e) => e.preventDefault()}>
        <div className="formgrid">
          <label className="field">
            <span className="fieldlabel">نام سایت</span>
            <span className="fieldbox"><input value={form.siteName} onChange={set("siteName")} /></span>
          </label>
          <label className="field">
            <span className="fieldlabel">تلفن پشتیبانی</span>
            <span className="fieldbox"><input value={form.phone} onChange={set("phone")} dir="ltr" /></span>
          </label>
          <label className="field">
            <span className="fieldlabel">ایمیل</span>
            <span className="fieldbox"><input value={form.email} onChange={set("email")} dir="ltr" /></span>
          </label>
          <label className="field full">
            <span className="fieldlabel">آدرس</span>
            <span className="fieldbox"><input value={form.address} onChange={set("address")} /></span>
          </label>
        </div>
        <div style={{ marginTop: 22 }}>
          <button type="submit" className="btnprimary"><LuSave /> ذخیره</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsGeneral;
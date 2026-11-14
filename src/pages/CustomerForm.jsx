import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuSave } from "react-icons/lu";

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
      <div className="pagehead">
        <h1 className="pagetitle">
          <span>افزودن مشتری</span>
        </h1>
        <button
          type="button"
          className="btnsecondary"
          onClick={() => navigate("/customers")}
        >
          <LuArrowRight /> بازگشت
        </button>
      </div>

      <form className="formcard" onSubmit={onSubmit}>
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
              <input value={form.phone} onChange={set("phone")} dir="ltr" />
            </span>
          </label>

          <label className="field">
            <span className="fieldlabel">ایمیل</span>
            <span className="fieldbox">
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                dir="ltr"
              />
            </span>
          </label>

          <label className="field">
            <span className="fieldlabel">شهر</span>
            <span className="fieldbox">
              <input value={form.city} onChange={set("city")} />
            </span>
          </label>

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
              <textarea rows={4} value={form.note} onChange={set("note")} />
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button type="submit" className="btnprimary">
            <LuSave /> ذخیره
          </button>
          <button
            type="button"
            className="btnsecondary"
            onClick={() => navigate("/customers")}
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
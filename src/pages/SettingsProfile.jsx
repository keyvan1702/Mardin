import React from "react";
import { LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import Badge from "../component/table/Badge";
import { getStoredUser } from "../component/Login";
import { ROLE_LABELS, normalizeRole } from "../utils/permissions";
import { initials } from "../utils/format";

const SettingsProfile = () => {
  const user = getStoredUser();
  const role = normalizeRole(user?.role);

  return (
    <div className="modulepage">
      <PageHeader title="پروفایل من" subtitle="اطلاعات حساب و رمز عبور" />

      <section className="profilecard">
        <span className="profilecardavatar">{initials(user?.name) || "؟"}</span>
        <div>
          <h2>{user?.name || "کاربر"}</h2>
          <Badge tone={role === "super-admin" ? "gold" : "slate"}>{ROLE_LABELS[role]}</Badge>
        </div>
      </section>

      <form className="formcard formcard-flush" onSubmit={(e) => e.preventDefault()}>
        <FormSection title="اطلاعات حساب" hint="نقش شما را فقط مدیر کل تغییر می‌دهد">
          <div className="formgrid">
            <label className="field">
              <span className="fieldlabel">نام</span>
              <span className="fieldbox">
                <input defaultValue={user?.name || ""} />
              </span>
            </label>
            <label className="field">
              <span className="fieldlabel">نقش</span>
              <span className="fieldbox">
                <input value={ROLE_LABELS[role]} readOnly />
              </span>
            </label>
          </div>
        </FormSection>

        <FormSection title="رمز عبور" hint="برای تغییر رمز، رمز جدید را وارد کنید">
          <div className="formgrid">
            <label className="field full">
              <span className="fieldlabel">رمز عبور جدید</span>
              <span className="fieldbox">
                <input type="password" dir="ltr" autoComplete="new-password" />
              </span>
            </label>
          </div>
        </FormSection>

        <div className="formbar">
          <button type="submit" className="btnprimary">
            <LuSave /> ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsProfile;

import React from "react";
import { LuSave } from "react-icons/lu";
import { getStoredUser } from "../component/Login";
import { ROLE_LABELS, normalizeRole } from "../utils/permissions";

const SettingsProfile = () => {
  const user = getStoredUser();
  const role = normalizeRole(user?.role);

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>پروفایل من</span></h1>
      <div className="formcard">
        <div className="formgrid">
          <label className="field">
            <span className="fieldlabel">نام</span>
            <span className="fieldbox"><input defaultValue={user?.name || ""} /></span>
          </label>
          <label className="field">
            <span className="fieldlabel">نقش</span>
            <span className="fieldbox"><input value={ROLE_LABELS[role]} readOnly /></span>
          </label>
          <label className="field full">
            <span className="fieldlabel">رمز عبور جدید</span>
            <span className="fieldbox"><input type="password" dir="ltr" /></span>
          </label>
        </div>
        <div style={{ marginTop: 22 }}>
          <button type="button" className="btnprimary"><LuSave /> ذخیره تغییرات</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;
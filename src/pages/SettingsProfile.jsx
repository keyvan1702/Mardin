import React, { useState } from "react";
import { LuSave } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import Badge from "../component/table/Badge";
import { FormFields, initialValues, validateFields } from "../component/crud/FormFields";
import { useToast } from "../component/ToastContext";
import { getStoredUser } from "../component/Login";
import { profileApi } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { ROLE_LABELS, normalizeRole } from "../utils/permissions";
import { initials } from "../utils/format";

const SettingsProfile = () => {
  const user = getStoredUser();
  const role = normalizeRole(user?.role);
  const toast = useToast();
  const [name, setName] = useState(user?.name || "");

  const FIELDS_A = [
    { key: "name", label: "نام", type: "text", required: true },
    { key: "role", label: "نقش", type: "text", readOnly: true, hint: "نقش شما را فقط مدیر تغییر می‌دهد" },
  ];
  const FIELDS_B = [
    { key: "password", label: "رمز عبور جدید", type: "password", min: 4, span: 2, hint: "خالی بگذارید تا رمز تغییر نکند" },
    { key: "repeat", label: "تکرار رمز جدید", type: "password", span: 2 },
  ];
  const [values, setValues] = useState(() => initialValues([...FIELDS_A, ...FIELDS_B], { name: user?.name, role: ROLE_LABELS[role] }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const change = (k, v) => { setValues((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateFields([...FIELDS_A, ...FIELDS_B], values);
    if (values.password && values.password !== values.repeat) errs.repeat = "تکرار رمز با رمز جدید یکی نیست.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      profileApi.update({ name: values.name.trim(), password: values.password });
      setName(values.name.trim());
      setValues((s) => ({ ...s, password: "", repeat: "" }));
      setFormError("");
      toast.success("پروفایل ذخیره شد");
    } catch (err) {
      setFormError(apiErrorMessage(err));
    }
  };

  return (
    <div className="modulepage">
      <PageHeader title="پروفایل من" subtitle="اطلاعات حساب و رمز عبور" />
      <section className="profilecard">
        <span className="profilecardavatar">{initials(name) || "؟"}</span>
        <div>
          <h2>{name || "کاربر"}</h2>
          <Badge tone={role === "manager" ? "gold" : "slate"}>{ROLE_LABELS[role]}</Badge>
        </div>
      </section>
      <form className="formcard formcard-flush" onSubmit={submit} noValidate>
        {formError && <p className="formerror formerror-inline" role="alert">{formError}</p>}
        <FormSection title="اطلاعات حساب" hint="نام شما در لاگ فعالیت‌ها و بالای صفحه دیده می‌شود">
          <FormFields fields={FIELDS_A} values={values} errors={errors} onChange={change} />
        </FormSection>
        <FormSection title="رمز عبور" hint="برای تغییر رمز، رمز جدید را دوبار وارد کنید">
          <FormFields fields={FIELDS_B} values={values} errors={errors} onChange={change} autoFocusFirst={false} />
        </FormSection>
        <div className="formbar">
          <button type="submit" className="btnprimary"><LuSave /> ذخیره تغییرات</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsProfile;

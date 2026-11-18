import React, { useState } from "react";
import { LuSave, LuRotateCcw } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import FormSection from "../component/ui/FormSection";
import Panel from "../component/ui/Panel";
import { FormFields, castValues, initialValues, validateFields } from "../component/crud/FormFields";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import { useToast } from "../component/ToastContext";
import { useStore } from "../services/store";
import { settingsApi } from "../services/actions";

const SITE = [{ key: "siteName", label: "نام سایت", type: "text", required: true, span: 2 }, { key: "maintenance", label: "حالت تعمیر سایت (سایت برای بازدیدکنندگان بسته می‌شود)", type: "switch", span: 2 }];
const CONTACT = [
  { key: "phone", label: "تلفن پشتیبانی", type: "tel" },
  { key: "email", label: "ایمیل", type: "email" },
  { key: "city", label: "شهر", type: "text" },
  { key: "address", label: "آدرس", type: "text", span: 2 },
  { key: "workshopSignup", label: "ثبت‌نام ورکشاپ‌ها فعال باشد", type: "switch", span: 2 },
];

const SettingsGeneral = () => {
  const settings = useStore((s) => s.settings);
  const toast = useToast();
  const [values, setValues] = useState(() => initialValues([...SITE, ...CONTACT], settings));
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);

  const change = (k, v) => { setValues((s) => ({ ...s, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const submit = (e) => {
    e.preventDefault();
    const all = [...SITE, ...CONTACT];
    const errs = validateFields(all, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    settingsApi.save(castValues(all, values));
    toast.success("تنظیمات ذخیره شد");
  };

  return (
    <div className="modulepage">
      <PageHeader title="تنظیمات عمومی" subtitle="اطلاعاتی که در سایت و پیام‌ها نمایش داده می‌شود" />
      <form className="formcard formcard-flush" onSubmit={submit} noValidate>
        <FormSection title="اطلاعات سایت" hint="نامی که مشتریان می‌بینند">
          <FormFields fields={SITE} values={values} errors={errors} onChange={change} />
        </FormSection>
        <FormSection title="راه‌های ارتباطی" hint="مشتریان برای پشتیبانی با این موارد تماس می‌گیرند">
          <FormFields fields={CONTACT} values={values} errors={errors} onChange={change} autoFocusFirst={false} />
        </FormSection>
        <div className="formbar">
          <button type="submit" className="btnprimary"><LuSave /> ذخیره تنظیمات</button>
        </div>
      </form>

      <Panel title="داده‌های نمایشی" hint="همه‌ی اطلاعات این نسخه در مرورگر شما ذخیره می‌شود؛ با اتصال API به سرور می‌رود">
        <button type="button" className="btnsecondary" onClick={() => setConfirmReset(true)}><LuRotateCcw /> بازگردانی داده‌های اولیه</button>
      </Panel>

      {confirmReset && (
        <ConfirmDialog title="بازگردانی داده‌های اولیه" message="همه‌ی تغییراتی که در این مرورگر داده‌اید پاک و داده‌های نمایشی اولیه برگردانده می‌شود." confirmLabel="بازگردانی"
          onConfirm={() => { settingsApi.resetDemo(); toast.info("داده‌های اولیه بازگردانده شد"); }} onClose={() => setConfirmReset(false)} />
      )}
    </div>
  );
};

export default SettingsGeneral;

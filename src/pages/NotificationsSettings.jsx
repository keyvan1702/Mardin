import React, { useState } from "react";
import { LuSave, LuInfo } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import Switch from "../component/ui/Switch";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useStore } from "../services/store";
import { notifyApi } from "../services/actions";
import { fmtDateTime, toFaDigits, tofa } from "../utils/format";

// تنظیم اعلان‌های پیامکی و داخلی؛ رویدادهای واقعی پنل (ثبت درخواست، ارجاع، …) طبق همین تنظیمات اعلان می‌فرستند
const NotificationsSettings = () => {
  const toast = useToast();
  const { edit } = usePermissions();
  const canEdit = edit("notifications");
  const savedRules = useStore((s) => s.notifyRules);
  const settings = useStore((s) => s.settings);
  const log = useStore((s) => s.notifyLog);
  const [rules, setRules] = useState(savedRules);
  const [smsPanel, setSmsPanel] = useState(settings.smsPanel);
  const dirty = JSON.stringify(rules) !== JSON.stringify(savedRules) || smsPanel !== settings.smsPanel;

  const toggle = (key, field) => (v) => setRules((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: v } : r)));

  const logCols = [
    { key: "at", header: "زمان", render: (r) => fmtDateTime(r.at) },
    { key: "event", header: "رویداد", render: (r) => <strong>{r.event}</strong> },
    { key: "to", header: "گیرنده", render: (r) => <span dir="ltr">{toFaDigits(r.to)}</span> },
    { key: "channel", header: "کانال", render: (r) => (r.channel === "sms" ? "پیامک" : "اعلان داخلی") },
    { key: "text", header: "متن", render: (r) => <span className="cellclip">{r.text || "—"}</span> },
    { key: "status", header: "وضعیت", render: (r) => <Badge tone={r.status === "delivered" ? "success" : "danger"}>{r.status === "delivered" ? "ارسال شد" : "ناموفق"}</Badge> },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="اعلان‌ها و پیامک"
        subtitle="در هر رویداد مشخص کنید پیامک و اعلان داخلی ارسال شود یا نه"
        actions={canEdit && (
          <button type="button" className="btnprimary" disabled={!dirty} onClick={() => { notifyApi.save(rules, smsPanel); toast.success("تنظیمات اعلان‌ها ذخیره شد"); }}><LuSave /> ذخیره‌ی تنظیمات</button>
        )}
      />

      <div className="notice">
        <LuInfo />
        <p>ارسال پیامک فقط وقتی کار می‌کند که پنل پیامکی فعال باشد (ماده ششم قرارداد). تا آن زمان فقط اعلان داخلی ارسال می‌شود.</p>
        <Switch checked={smsPanel} onChange={setSmsPanel} label="پنل پیامکی فعال است" disabled={!canEdit} />
      </div>

      <Panel title="رویدادها" className="panel-flush">
        <ul className="rulelist">
          {rules.map((r) => (
            <li key={r.key} className="rule">
              <div className="ruletext">
                <strong>{r.label}</strong>
                <span className="muted">{r.desc}</span>
                <span className="rulesample">«{r.sample}»</span>
              </div>
              <div className="ruleswitches">
                <Switch checked={r.sms && smsPanel} onChange={toggle(r.key, "sms")} label="پیامک" disabled={!canEdit || !smsPanel} />
                <Switch checked={r.inApp} onChange={toggle(r.key, "inApp")} label="اعلان داخلی" disabled={!canEdit} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <h2 className="sectiontitle">گزارش ارسال‌ها</h2>
      <DataTable columns={logCols} rows={log} empty="هنوز اعلانی ارسال نشده است." footer={`${tofa(log.length)} ارسال`} />
    </div>
  );
};

export default NotificationsSettings;

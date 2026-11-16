import React, { useState } from "react";
import { LuSave, LuInfo } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import Switch from "../component/ui/Switch";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { MOCK_NOTIFY_LOG, MOCK_NOTIFY_RULES } from "../services/mockData";
import { toFaDigits, tofa } from "../utils/format";

// تنظیم اعلان‌های پیامکی و داخلی برای رویدادهای مهم
const NotificationsSettings = () => {
  const toast = useToast();
  const { edit } = usePermissions();
  const canEdit = edit("notifications");
  const [rules, setRules] = useState(MOCK_NOTIFY_RULES);
  const [smsPanel, setSmsPanel] = useState(false);

  const toggle = (key, field) => (v) =>
    setRules((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: v } : r)));

  const logCols = [
    { key: "at", header: "زمان", render: (r) => <span dir="ltr">{toFaDigits(r.at)}</span> },
    { key: "event", header: "رویداد", render: (r) => <strong>{r.event}</strong> },
    { key: "to", header: "گیرنده", render: (r) => <span dir="ltr">{toFaDigits(r.to)}</span> },
    { key: "channel", header: "کانال", render: (r) => (r.channel === "sms" ? "پیامک" : "اعلان داخلی") },
    {
      key: "status",
      header: "وضعیت",
      render: (r) => (
        <Badge tone={r.status === "delivered" ? "success" : "danger"}>
          {r.status === "delivered" ? "ارسال شد" : "ناموفق"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <PageHeader
        title="اعلان‌ها و پیامک"
        subtitle="در هر رویداد مشخص کنید پیامک و اعلان داخلی ارسال شود یا نه"
        actions={
          canEdit && (
            <button type="button" className="btnprimary" onClick={() => toast.success("تنظیمات اعلان‌ها ذخیره شد")}>
              <LuSave /> ذخیره‌ی تنظیمات
            </button>
          )
        }
      />

      <div className="notice">
        <LuInfo />
        <p>
          ارسال پیامک فقط وقتی کار می‌کند که پنل پیامکی فعال باشد (ماده ششم قرارداد). تا آن زمان فقط اعلان داخلی ارسال می‌شود.
        </p>
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
      <DataTable columns={logCols} rows={MOCK_NOTIFY_LOG} footer={`${tofa(MOCK_NOTIFY_LOG.length)} ارسال اخیر`} />
    </div>
  );
};

export default NotificationsSettings;

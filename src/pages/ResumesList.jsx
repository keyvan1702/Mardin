import React, { useMemo, useState } from "react";
import { LuCircleCheck, LuCircleX, LuFileUser, LuPhone, LuMapPin, LuCalendar } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import SearchBox from "../component/ui/SearchBox";
import FilterTabs from "../component/ui/FilterTabs";
import FormDialog from "../component/crud/FormDialog";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useCollection } from "../services/store";
import { resumesApi } from "../services/actions";
import { fmtDate, norm, toFaDigits } from "../utils/format";

const STATUS = {
  pending: { label: "در انتظار بررسی", tone: "gold" },
  approved: { label: "تأییدشده", tone: "success" },
  rejected: { label: "ردشده", tone: "danger" },
};

const ResumesList = () => {
  const resumes = useCollection("resumes");
  const toast = useToast();
  const { edit } = usePermissions();
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [rejecting, setRejecting] = useState(null);

  const rows = useMemo(() => {
    const q = norm(query.trim());
    return resumes.filter(
      (r) => (tab === "all" || r.status === tab) && (!q || norm(r.name).includes(q) || norm(r.position).includes(q) || norm(r.city).includes(q)),
    );
  }, [resumes, tab, query]);

  const n = (s) => resumes.filter((r) => r.status === s).length;

  const approve = (r) => {
    const { addedInstaller } = resumesApi.approve(r.id);
    toast.success(addedInstaller ? `رزومه تأیید شد و ${r.name} به نصاب‌ها اضافه شد` : "رزومه تأیید شد");
  };

  return (
    <div className="modulepage">
      <PageHeader title="بررسی رزومه‌ها" subtitle="درخواست‌های همکاری نصاب‌ها و کارکنان جدید؛ با تأیید رزومه‌ی نصاب، او به فهرست نصابان اضافه می‌شود" />

      <div className="toolbar">
        <FilterTabs value={tab} onChange={setTab} options={[["pending", "در انتظار", n("pending")], ["approved", "تأییدشده", n("approved")], ["rejected", "ردشده", n("rejected")], ["all", "همه", resumes.length]]} />
        <SearchBox value={query} onChange={setQuery} placeholder="جستجوی نام، موقعیت یا شهر..." />
      </div>

      {rows.length === 0 ? (
        <div className="emptystate">
          <span className="emptystateicon"><LuFileUser /></span>
          <h2>رزومه‌ای در این دسته نیست</h2>
          <p>درخواست‌های همکاری جدید اینجا نمایش داده می‌شوند.</p>
        </div>
      ) : (
        <div className="resumegrid">
          {rows.map((r) => (
            <article key={r.id} className="resumecard">
              <header className="resumehead">
                <span className="resumeavatar"><LuFileUser /></span>
                <div>
                  <strong>{r.name}</strong>
                  <p className="muted">{r.position}</p>
                </div>
                <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>
              </header>
              <ul className="resumemeta">
                <li><LuPhone /> <span dir="ltr">{toFaDigits(r.phone)}</span></li>
                <li><LuMapPin /> {r.city}</li>
                <li><LuCalendar /> {fmtDate(r.submittedAt)}</li>
              </ul>
              <p className="resumetext">{r.experience}</p>
              {r.note && <p className="resumenote">یادداشت: {r.note}</p>}
              {r.status === "pending" && edit("courses") && (
                <div className="resumeactions">
                  <button type="button" className="btnprimary" onClick={() => approve(r)}><LuCircleCheck /> تأیید</button>
                  <button type="button" className="btnsecondary" onClick={() => setRejecting(r)}><LuCircleX /> رد</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {rejecting && (
        <FormDialog
          title={`رد رزومه‌ی ${rejecting.name}`}
          fields={[{ key: "note", label: "دلیل رد (اختیاری)", type: "textarea", span: 2 }]}
          row={null}
          submitLabel="رد رزومه"
          onSubmit={(v) => { resumesApi.reject(rejecting.id, v.note); toast.info("رزومه رد شد"); setRejecting(null); }}
          onClose={() => setRejecting(null)}
          size="sm"
        />
      )}
    </div>
  );
};

export default ResumesList;

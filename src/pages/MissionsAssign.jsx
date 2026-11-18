import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuMapPin, LuSend, LuTriangleAlert } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import { useCollection } from "../services/store";
import { missionsApi } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { PRIORITY } from "../services/constants";
import { fmtDateTime, toFaDigits, tofa } from "../utils/format";

const RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

// اختصاص درخواست‌های بدون تکنسین به نصاب (کار اپراتور)
const MissionsAssign = () => {
  const toast = useToast();
  const missions = useCollection("missions");
  const installers = useCollection("installers");

  const pending = missions
    .filter((m) => !m.installerId && m.stage !== "closed" && m.status !== "cancelled")
    .sort((a, b) => RANK[a.priority] - RANK[b.priority] || a.createdAt.localeCompare(b.createdAt));

  const [selectedId, setSelectedId] = useState(null);
  const [installerId, setInstallerId] = useState(null);

  const mission = pending.find((m) => m.id === selectedId) ?? pending[0];
  const activeCount = (id) => missions.filter((m) => m.installerId === id && ["assigned", "inprogress"].includes(m.stage)).length;
  const rejectedBefore = (mission?.rejections || []).map((r) => r.installerId);

  const submit = () => {
    try {
      const inst = installers.find((i) => i.id === installerId);
      missionsApi.assign(mission.id, installerId);
      toast.success(`درخواست ${mission.tracking} به ${inst.name} ارجاع شد`);
      setInstallerId(null);
      setSelectedId(null);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <div className="modulepage">
      <PageHeader title="تخصیص ماموریت به نصاب" subtitle="برای هر درخواست، نصاب مناسب را انتخاب کنید؛ مشتری با پیامک و اعلان باخبر می‌شود" />

      {!mission ? (
        <div className="emptystate">
          <span className="emptystateicon"><LuSend /></span>
          <h2>همه‌ی درخواست‌ها تکنسین دارند</h2>
          <p>درخواست جدید که ثبت شود، اینجا برای تخصیص نمایش داده می‌شود.</p>
          <Link to="/missions" className="btnsecondary">فهرست درخواست‌ها</Link>
        </div>
      ) : (
        <div className="splitgrid">
          <aside className="sidecard">
            <h2 className="sectiontitle">در انتظار نصاب ({tofa(pending.length)})</h2>
            <ul className="missionlist">
              {pending.map((m) => (
                <li key={m.id}>
                  <button type="button" className={`missionitem ${m.id === mission.id ? "missionitemactive" : ""}`} onClick={() => { setSelectedId(m.id); setInstallerId(null); }}>
                    <span className="missiontop">
                      <strong>{m.customer}</strong>
                      <Badge tone={PRIORITY[m.priority].tone}>{PRIORITY[m.priority].label}</Badge>
                    </span>
                    <span className="missionmeta"><LuMapPin /> {m.city} · {m.service}</span>
                    <span className="missionmeta" dir="ltr">{toFaDigits(m.tracking)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="maincard">
            <div className="detailhead">
              <div>
                <Link to={`/missions/${mission.id}`} className="textlink"><h2 className="sectiontitle">{mission.service}</h2></Link>
                <p className="muted">مشتری: {mission.customer} · <span dir="ltr">{toFaDigits(mission.phone)}</span></p>
                <p className="muted">{mission.city} - {mission.address}</p>
                <p>{mission.description}</p>
                <p className="muted">ثبت‌شده: {fmtDateTime(mission.createdAt)}</p>
              </div>
              <strong>{tofa(mission.price)} تومان</strong>
            </div>

            {mission.status === "rejected" && (
              <p className="notice notice-warn"><LuTriangleAlert /> قبلاً رد شده: {mission.rejectReason}</p>
            )}

            <h3 className="subhead">انتخاب نصاب</h3>
            <div className="installerlist">
              {installers.map((ins) => (
                <label key={ins.id} className={`installercard ${installerId === ins.id ? "installercardactive" : ""}`}>
                  <input type="radio" name="installer" checked={installerId === ins.id} onChange={() => setInstallerId(ins.id)} />
                  <div className="installerinfo">
                    <strong>{ins.name}</strong>
                    <span className="muted">
                      {ins.city}{ins.rating > 0 ? ` · امتیاز ${toFaDigits(ins.rating.toFixed(1))}` : ""} · {tofa(ins.doneJobs)} ماموریت
                    </span>
                    <span className="installerphone" dir="ltr">{toFaDigits(ins.phone)}</span>
                    <span className="installerstatus">
                      <Badge tone={ins.online ? "success" : "slate"}>{ins.online ? "آنلاین" : "آفلاین"}</Badge>
                      <Badge tone={activeCount(ins.id) >= 3 ? "gold" : "slate"}>{tofa(activeCount(ins.id))} فعال</Badge>
                      {rejectedBefore.includes(ins.id) && <Badge tone="danger">قبلاً رد کرده</Badge>}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="detailactions">
              <button type="button" className="btnprimary" disabled={!installerId} onClick={submit}><LuSend /> ارسال درخواست به نصاب</button>
              <button type="button" className="btnsecondary" onClick={() => setInstallerId(null)} disabled={!installerId}>انصراف</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default MissionsAssign;

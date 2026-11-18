import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuUserRound, LuStar, LuCircleCheck, LuClock, LuReceipt, LuTrash2 } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import InfoGrid from "../component/ui/InfoGrid";
import Stepper from "../component/ui/Stepper";
import Badge from "../component/table/Badge";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useCollection } from "../services/store";
import { missionsApi } from "../services/actions";
import { apiErrorMessage } from "../services/apiService";
import { FAULTS, MISSION_STAGES, MISSION_STATUS, PRIORITY } from "../services/constants";
import { fmtDateTime, toFaDigits, tofa } from "../utils/format";

// جزئیات یک درخواست (تیکت): مراحل، اطلاعات، تکنسین، رویدادها و پیشبرد کار
const MissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { edit } = usePermissions();
  const missions = useCollection("missions");
  const m = missions.find((x) => String(x.id) === id);
  const [dialog, setDialog] = useState(null); // reject | close | cancel | delete

  if (!m) {
    return (
      <div className="modulepage">
        <PageHeader title="درخواست پیدا نشد" subtitle="شماره‌ی درخواست درست نیست یا حذف شده است" />
        <Link to="/missions" className="btnsecondary"><LuArrowRight /> بازگشت به فهرست</Link>
      </div>
    );
  }

  const canEdit = edit("missions");
  const pr = PRIORITY[m.priority];
  const st = MISSION_STATUS[m.status];
  const ended = m.stage === "closed" || m.status === "cancelled";
  const unassigned = !m.installerId;

  const run = (fn, msg) => {
    try { fn(); if (msg) toast.success(msg); } catch (err) { toast.error(apiErrorMessage(err)); }
  };

  // دکمه‌ی پیشبرد مرحله‌ی بعد، بسته به وضعیت فعلی
  const actions = [];
  if (!ended && canEdit) {
    if (unassigned && m.stage === "registered") actions.push(<button key="review" type="button" className="btnsecondary" onClick={() => run(() => missionsApi.review(m.id), "بررسی آغاز شد")}>شروع بررسی</button>);
    if (unassigned) actions.push(<Link key="assign" to="/missions/assign" className="btnprimary">اختصاص تکنسین</Link>);
    if (m.status === "assigned") {
      actions.push(<button key="acc" type="button" className="btnprimary" onClick={() => run(() => missionsApi.accept(m.id), "پذیرش تکنسین ثبت شد")}>ثبت پذیرش تکنسین</button>);
      actions.push(<button key="rej" type="button" className="btnsecondary" onClick={() => setDialog("reject")}>ثبت رد توسط تکنسین</button>);
    }
    if (m.status === "accepted" && m.stage === "assigned") actions.push(<button key="start" type="button" className="btnprimary" onClick={() => run(() => missionsApi.start(m.id), "کار آغاز شد؛ اعلان رسیدن تکنسین ارسال شد")}>رسیدن تکنسین و شروع کار</button>);
    if (m.stage === "inprogress") actions.push(<button key="fin" type="button" className="btnprimary" onClick={() => run(() => missionsApi.finish(m.id), "پایان کار ثبت شد")}>ثبت پایان کار</button>);
    if (m.stage === "finished") actions.push(<button key="close" type="button" className="btnprimary" onClick={() => setDialog("close")}>تأیید مشتری و بستن</button>);
    actions.push(<button key="cancel" type="button" className="btnsecondary" onClick={() => setDialog("cancel")}>لغو درخواست</button>);
  }

  return (
    <div className="modulepage">
      <PageHeader
        title={`درخواست ${toFaDigits(m.tracking)}`}
        subtitle={`${m.service} • ${m.customer}`}
        actions={
          <>
            <Badge tone={pr.tone}>اولویت {pr.label}</Badge>
            <Badge tone={st.tone}>{st.label}</Badge>
            <button type="button" className="btnsecondary" onClick={() => navigate("/missions")}><LuArrowRight /> بازگشت</button>
          </>
        }
      />

      <Panel title="وضعیت درخواست" hint="از ثبت تا تأیید مشتری و بسته‌شدن" actions={<div className="panelactions">{actions}</div>}>
        <Stepper steps={MISSION_STAGES} current={m.stage} />
        {!ended && canEdit && <p className="hintline">تا ساخته‌شدن پنل نصابان، پاسخ و گزارش تکنسین را اپراتور اینجا ثبت می‌کند.</p>}
      </Panel>

      <div className="twocol">
        <Panel title="اطلاعات درخواست">
          <InfoGrid
            items={[
              ["مشتری", <Link key="c" to={`/customers/${m.customerId}`} className="textlink">{m.customer}</Link>],
              ["تلفن", <span dir="ltr" key="p">{toFaDigits(m.phone)}</span>],
              ["آدرس", `${m.city} - ${m.address}`],
              ["خدمت", m.service],
              ["نوع خرابی", m.fault ? FAULTS[m.fault] : null],
              ["هزینه‌ی برآوردی", `${tofa(m.price)} تومان`],
              ["زمان ثبت", fmtDateTime(m.createdAt)],
            ]}
          />
          <p className="descbox">{m.description}</p>
          {canEdit && (
            <div className="detailactions">
              <Link to={`/finance/new?request=${m.id}`} className="btnsecondary btnxs"><LuReceipt /> ثبت فاکتور برای این درخواست</Link>
              <button type="button" className="btnsecondary btnxs" onClick={() => setDialog("delete")}><LuTrash2 /> حذف درخواست</button>
            </div>
          )}
        </Panel>

        <Panel title="تکنسین و نظرسنجی">
          {unassigned ? (
            <p className="muted">هنوز تکنسینی به این درخواست اختصاص داده نشده است.</p>
          ) : (
            <div className="techline">
              <span className="techavatar"><LuUserRound /></span>
              <div><strong>{m.installer}</strong><span className="muted">{st.label}</span></div>
            </div>
          )}
          {m.rejectReason && m.status === "rejected" && <p className="descbox">آخرین رد: {m.rejectReason}</p>}

          <h3 className="subhead">پایان کار و نظرسنجی</h3>
          {m.stage === "closed" ? (
            <div className="surveybox">
              <span className="rating">{[1, 2, 3, 4, 5].map((i) => <LuStar key={i} className={i <= m.rating ? "" : "star-off"} />)}</span>
              {m.feedback && <p>«{m.feedback}»</p>}
              <span className="muted"><LuCircleCheck /> مشتری پایان کار را تأیید کرده است</span>
            </div>
          ) : m.stage === "finished" ? (
            <p className="muted"><LuClock /> پایان کار ثبت شده؛ منتظر تأیید مشتری.</p>
          ) : m.status === "cancelled" ? (
            <p className="muted">این درخواست لغو شده است.</p>
          ) : (
            <p className="muted">پس از پایان کار، مشتری آن را تأیید می‌کند و می‌تواند امتیاز بدهد.</p>
          )}
        </Panel>
      </div>

      <Panel title="رویدادها">
        <ol className="timeline">
          {[...m.events].reverse().map((e, i) => (
            <li key={e.at + i}>
              <span className="timelinedot timelinedot-sm" />
              <div><strong>{e.text}</strong><span className="muted">{fmtDateTime(e.at)}</span></div>
            </li>
          ))}
        </ol>
      </Panel>

      {dialog === "reject" && (
        <FormDialog title="ثبت رد ماموریت توسط تکنسین" fields={[{ key: "reason", label: "دلیل رد", type: "textarea", required: true, span: 2 }]} row={null} submitLabel="ثبت رد"
          onSubmit={(v) => { missionsApi.reject(m.id, v.reason); toast.info("رد ماموریت ثبت شد؛ درخواست دوباره قابل ارجاع است"); setDialog(null); }} onClose={() => setDialog(null)} size="sm" />
      )}
      {dialog === "close" && (
        <FormDialog title="تأیید مشتری و نظرسنجی"
          fields={[
            { key: "rating", label: "امتیاز مشتری", type: "select", required: true, default: "5", options: [5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${tofa(n)} ستاره` })) },
            { key: "feedback", label: "نظر مشتری (اختیاری)", type: "textarea", span: 2 },
          ]}
          row={null} submitLabel="تأیید و بستن"
          onSubmit={(v) => { missionsApi.close(m.id, { rating: Number(v.rating), feedback: v.feedback }); toast.success("درخواست بسته شد"); setDialog(null); }} onClose={() => setDialog(null)} size="sm" />
      )}
      {dialog === "cancel" && (
        <FormDialog title="لغو درخواست" fields={[{ key: "reason", label: "دلیل لغو", type: "textarea", required: true, span: 2 }]} row={null} submitLabel="لغو درخواست"
          onSubmit={(v) => { missionsApi.cancel(m.id, v.reason); toast.info("درخواست لغو شد"); setDialog(null); }} onClose={() => setDialog(null)} size="sm" />
      )}
      {dialog === "delete" && (
        <ConfirmDialog title="حذف درخواست" message={`درخواست ${m.tracking} برای همیشه حذف شود؟`} onConfirm={() => { missionsApi.remove(m.id); toast.success("درخواست حذف شد"); navigate("/missions"); }} onClose={() => setDialog(null)} />
      )}
    </div>
  );
};

export default MissionDetail;

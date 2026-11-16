import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuUserRound, LuStar, LuCircleCheck, LuClock } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import InfoGrid from "../component/ui/InfoGrid";
import Stepper from "../component/ui/Stepper";
import Badge from "../component/table/Badge";
import usePermissions from "../hooks/usePermissions";
import { MISSION_STAGES, MOCK_MISSIONS, PRIORITY } from "../services/mockData";
import { toFaDigits, tofa } from "../utils/format";

// جزئیات یک درخواست خدمات (تیکت): مراحل، اطلاعات، تکنسین، رویدادها و نظرسنجی
const MissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { edit } = usePermissions();
  const m = MOCK_MISSIONS.find((x) => String(x.id) === id);

  if (!m) {
    return (
      <div className="modulepage">
        <PageHeader title="درخواست پیدا نشد" subtitle="شماره‌ی درخواست درست نیست" />
        <Link to="/missions" className="btnsecondary">
          <LuArrowRight /> بازگشت به فهرست
        </Link>
      </div>
    );
  }

  const unassigned = !m.installer;
  const pr = PRIORITY[m.priority];

  return (
    <div className="modulepage">
      <PageHeader
        title={`درخواست ${toFaDigits(m.tracking)}`}
        subtitle={`${m.service} • ${m.customer}`}
        actions={
          <>
            <Badge tone={pr.tone}>اولویت {pr.label}</Badge>
            <button type="button" className="btnsecondary" onClick={() => navigate("/missions")}>
              <LuArrowRight /> بازگشت
            </button>
          </>
        }
      />

      <Panel title="وضعیت درخواست" hint="از ثبت تا تأیید مشتری و بسته‌شدن">
        <Stepper steps={MISSION_STAGES} current={m.stage} />
      </Panel>

      <div className="twocol">
        <Panel title="اطلاعات درخواست">
          <InfoGrid
            items={[
              ["مشتری", m.customer],
              ["تلفن", <span dir="ltr" key="p">{toFaDigits(m.customerPhone)}</span>],
              ["آدرس", `${m.city} - ${m.address}`],
              ["خدمت", m.service],
              ["هزینه‌ی برآوردی", `${tofa(m.price)} تومان`],
              ["زمان ثبت", <span dir="ltr" key="t">{toFaDigits(m.createdAt)}</span>],
            ]}
          />
          <p className="descbox">{m.description}</p>
        </Panel>

        <Panel
          title="تکنسین"
          actions={
            edit("missions") && (
              <Link to="/missions/assign" className={unassigned ? "btnprimary btnxs" : "btnsecondary btnxs"}>
                {unassigned ? "اختصاص تکنسین" : "تغییر تکنسین"}
              </Link>
            )
          }
        >
          {unassigned ? (
            <p className="muted">هنوز تکنسینی به این درخواست اختصاص داده نشده است.</p>
          ) : (
            <div className="techline">
              <span className="techavatar">
                <LuUserRound />
              </span>
              <div>
                <strong>{m.installer}</strong>
                <span className="muted" dir="ltr">
                  {toFaDigits(m.installerPhone)}
                </span>
              </div>
              {m.status === "rejected" && <Badge tone="danger">ماموریت را رد کرد</Badge>}
            </div>
          )}
          {m.rejectReason && <p className="descbox">دلیل رد: {m.rejectReason}</p>}

          <h3 className="subhead">پایان کار و نظرسنجی</h3>
          {m.stage === "closed" ? (
            <div className="surveybox">
              <span className="rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <LuStar key={i} className={i <= m.rating ? "" : "star-off"} />
                ))}
              </span>
              <p>«{m.feedback}»</p>
              <span className="muted">
                <LuCircleCheck /> مشتری پایان کار را تأیید کرده است
              </span>
            </div>
          ) : m.stage === "finished" ? (
            <p className="muted">
              <LuClock /> تکنسین پایان کار را ثبت کرده؛ منتظر تأیید مشتری.
            </p>
          ) : (
            <p className="muted">پس از پایان کار، مشتری آن را تأیید می‌کند و می‌تواند امتیاز بدهد.</p>
          )}
        </Panel>
      </div>

      <Panel title="رویدادها">
        <ol className="timeline">
          {m.events.map((e) => (
            <li key={e.at + e.text}>
              <span className="timelinedot timelinedot-sm" />
              <div>
                <strong>{e.text}</strong>
                <span className="muted" dir="ltr">
                  {toFaDigits(e.at)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
};

export default MissionDetail;

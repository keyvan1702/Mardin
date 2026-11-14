import React, { useState } from "react";
import { LuUserRound, LuCircleCheck, LuCircleX, LuMapPin, LuPhone, LuSend } from "react-icons/lu";
import Badge from "../component/table/Badge";
import { MOCK_MISSIONS, MOCK_INSTALLERS } from "../services/mockData";
import { tofa } from "../utils/format";

const MissionsAssign = () => {
  const pending = MOCK_MISSIONS.filter((m) => m.status === "pending");
  const [selected, setSelected] = useState(pending[0]?.id ?? null);
  const [chosenInstaller, setChosenInstaller] = useState({});

  const mission = pending.find((m) => m.id === selected) || null;

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>تخصیص ماموریت به نصاب</span></h1>

      <div className="splitgrid">
        {/* لیست درخواست‌های در انتظار */}
        <section className="sidecard">
          <h2 className="sectiontitle">در انتظار نصاب ({tofa(pending.length)})</h2>
          {pending.length === 0 ? (
            <p className="muted">همه‌ی درخواست‌ها تخصیص داده شده‌اند.</p>
          ) : (
            <ul className="missionlist">
              {pending.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className={`missionitem ${selected === m.id ? "missionitemactive" : ""}`}
                    onClick={() => setSelected(m.id)}
                  >
                    <span className="missiontop">
                      <strong>{m.customer}</strong>
                      <Badge tone="gold">#{m.id}</Badge>
                    </span>
                    <span className="missionmeta">
                      <LuMapPin /> {m.city} · {m.service}
                    </span>
                    <span className="missionmeta">{tofa(m.price)} تومان</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* جزئیات ماموریت + لیست نصاب‌ها */}
        <section className="maincard">
          {!mission ? (
            <p className="muted">برای مشاهده جزئیات، یک درخواست را انتخاب کنید.</p>
          ) : (
            <>
              <div className="detailhead">
                <div>
                  <h2 className="sectiontitle">{mission.service}</h2>
                  <p className="muted">
                    مشتری: {mission.customer} · <span dir="ltr">{mission.customerPhone}</span>
                  </p>
                  <p className="muted">{mission.city} - {mission.address}</p>
                  <p>{mission.description}</p>
                </div>
                <strong style={{ fontSize: 22 }}>{tofa(mission.price)} تومان</strong>
              </div>

              <h3 className="sectiontitle" style={{ marginTop: 18 }}>
                انتخاب نصاب
              </h3>
              <div className="installerlist">
                {MOCK_INSTALLERS.map((ins) => (
                  <label
                    key={ins.id}
                    className={`installercard ${chosenInstaller[mission.id] === ins.id ? "installercardactive" : ""}`}
                  >
                    <input
                      type="radio"
                      name="installer"
                      value={ins.id}
                      checked={chosenInstaller[mission.id] === ins.id}
                      onChange={() =>
                        setChosenInstaller((c) => ({ ...c, [mission.id]: ins.id }))
                      }
                    />
                    <div className="installerinfo">
                      <strong>{ins.name}</strong>
                      <span className="muted">
                        {ins.city} · امتیاز {ins.rating} · {tofa(ins.doneJobs)} ماموریت
                      </span>
                      <span className="installerstatus">
                        <Badge tone={ins.online ? "success" : "slate"}>
                          {ins.online ? "آنلاین" : "آفلاین"}
                        </Badge>
                        <Badge tone={ins.activeMissions > 2 ? "gold" : "slate"}>
                          {tofa(ins.activeMissions)} فعال
                        </Badge>
                      </span>
                    </div>
                    <span className="installerphone" dir="ltr">{ins.phone}</span>
                  </label>
                ))}
              </div>

              <div className="detailactions">
                <button type="button" className="btnprimary" disabled={!chosenInstaller[mission.id]}>
                  <LuSend /> ارسال درخواست به نصاب
                </button>
                <button type="button" className="btnsecondary">
                  <LuCircleX /> انصراف
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MissionsAssign;
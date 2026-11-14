import React, { useMemo, useState } from "react";
import { LuCircleCheck, LuCircleX, LuFileUser, LuPhone, LuMapPin, LuSearch } from "react-icons/lu";
import Badge from "../component/table/Badge";
import { MOCK_RESUMES } from "../services/mockData";

const STATUS = {
  pending: { label: "در انتظار بررسی", tone: "gold" },
  approved: { label: "تأییدشده", tone: "success" },
  rejected: { label: "رد‌شده", tone: "danger" },
};

const ResumesList = () => {
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let list = MOCK_RESUMES;
    if (tab !== "all") list = list.filter((r) => r.status === tab);
    const q = query.trim();
    if (q) list = list.filter((r) => r.name.includes(q) || r.position.includes(q) || r.city.includes(q));
    return list;
  }, [tab, query]);

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>بررسی رزومه‌ها</span></h1>

      <div className="toolbar">
        <div className="tabbar">
          {[
            ["pending", "در انتظار"],
            ["approved", "تأییدشده"],
            ["rejected", "رد‌شده"],
            ["all", "همه"],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`tab ${tab === k ? "tabactive" : ""}`}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="fieldbox" style={{ height: 46, flex: "0 1 320px", marginInlineStart: "auto" }}>
          <LuSearch className="fieldicon" />
          <input
            type="search"
            placeholder="جستجوی نام، موقعیت یا شهر..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
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
                <li><LuPhone /> <span dir="ltr">{r.phone}</span></li>
                <li><LuMapPin /> {r.city}</li>
                <li><span dir="ltr">{r.submittedAt}</span></li>
              </ul>

              <p className="resumetext">{r.experience}</p>
              {r.note && <p className="resumenote">یادداشت: {r.note}</p>}

              {r.status === "pending" && (
                <div className="resumeactions">
                  <button type="button" className="btnprimary"><LuCircleCheck /> تأیید</button>
                  <button type="button" className="btnsecondary"><LuCircleX /> رد</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesList;
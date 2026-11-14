import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { fmtDayMonth, tofa } from "../utils/format";

const RANGES = [
  { days: 7, label: "۷ روز گذشته" },
  { days: 30, label: "۳۰ روز گذشته" },
  { days: 90, label: "۹۰ روز گذشته" },
];

const HEIGHT = 300;
const M = { top: 20, right: 28, bottom: 40, left: 56 };

// گام «زیبا» برای خطوط افقی
const niceStep = (v) =>
  [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000].find((s) => s >= v) ||
  Math.ceil(v / 10000) * 10000;

// منحنی نرم (Catmull-Rom به Bézier)
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

const SiteStatsChart = ({ data, range, onRangeChange, loading }) => {
  const gid = `g${useId().replace(/:/g, "")}`;
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(800);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    if (!data.length) return null;
    const plotW = Math.max(width - M.left - M.right, 10);
    const plotH = HEIGHT - M.top - M.bottom;
    const rawMax = Math.max(...data.map((d) => d.value), 1);
    const step = niceStep(rawMax / 3);
    const yMax = Math.ceil(rawMax / step) * step;
    const n = data.length;

    const pts = data.map((d, i) => ({
      x: M.left + (n === 1 ? plotW / 2 : (i * plotW) / (n - 1)),
      y: M.top + plotH - (d.value / yMax) * plotH,
      ...d,
    }));
    const base = M.top + plotH;
    const line = smoothPath(pts);
    const area = `${line} L${pts[n - 1].x},${base} L${pts[0].x},${base} Z`;

    const yTicks = [];
    for (let v = 0; v <= yMax; v += step) {
      yTicks.push({ v, y: M.top + plotH - (v / yMax) * plotH });
    }
    const xTicks = Array.from({ length: 5 }, (_, k) => {
      const i = Math.round((k * (n - 1)) / 4);
      return { x: pts[i].x, label: fmtDayMonth(pts[i].date) };
    });
    const dotEvery = Math.ceil(n / 16);

    return { pts, line, area, yTicks, xTicks, base, plotW, dotEvery };
  }, [data, width]);

  const onMove = (e) => {
    if (!geo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let best = 0;
    let dist = Infinity;
    geo.pts.forEach((p, i) => {
      const dx = Math.abs(p.x - x);
      if (dx < dist) {
        dist = dx;
        best = i;
      }
    });
    setHover(best);
  };

  const hp = geo && hover != null ? geo.pts[hover] : null;

  return (
    <section className="chartcard" aria-label="آمار کلی سایت">
      <header className="chartcardhead">
        <h2 className="chartcardtitle">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect x="2" y="12" width="4.5" height="8" rx="1.2" fill="var(--primary)" />
            <rect x="8.75" y="6" width="4.5" height="14" rx="1.2" fill="var(--primary)" />
            <rect x="15.5" y="2" width="4.5" height="18" rx="1.2" fill="var(--primary)" />
          </svg>
          آمار کلی سایت
        </h2>

        <label className="rangeselect">
          <select
            value={range}
            onChange={(e) => onRangeChange(Number(e.target.value))}
            aria-label="بازه‌ی زمانی"
          >
            {RANGES.map((r) => (
              <option key={r.days} value={r.days}>
                {r.label}
              </option>
            ))}
          </select>
          <LuChevronDown className="rangeselecticon" />
        </label>
      </header>

      <div
        ref={wrapRef}
        className={`chartwrap ${loading ? "chartwrap-loading" : ""}`}
        dir="ltr"
      >
        {!geo ? (
          <div className="chartempty">در حال بارگذاری...</div>
        ) : (
          <>
            <svg
              width={width}
              height={HEIGHT}
              role="img"
              aria-label="نمودار آمار روزانه‌ی سایت"
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
            >
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {geo.yTicks.map((t) => (
                <g key={t.v}>
                  <line
                    x1={M.left}
                    x2={M.left + geo.plotW}
                    y1={t.y}
                    y2={t.y}
                    className="chartgrid"
                  />
                  <text x={M.left - 12} y={t.y + 4} textAnchor="end" className="charttext">
                    {tofa(t.v)}
                  </text>
                </g>
              ))}

              {geo.xTicks.map((t, i) => (
                <g key={i}>
                  <line
                    x1={t.x}
                    x2={t.x}
                    y1={M.top}
                    y2={geo.base}
                    className="chartgrid chartgrid-v"
                  />
                  <text
                    x={t.x}
                    y={geo.base + 26}
                    textAnchor="middle"
                    className="charttext charttext-x"
                  >
                    {t.label}
                  </text>
                </g>
              ))}

              <path d={geo.area} fill={`url(#${gid})`} />
              <path d={geo.line} className="chartline" />

              {geo.pts.map(
                (p, i) =>
                  i % geo.dotEvery === 0 && (
                    <circle key={i} cx={p.x} cy={p.y} r="4.5" className="chartdot" />
                  ),
              )}

              {hp && (
                <g>
                  <line x1={hp.x} x2={hp.x} y1={M.top} y2={geo.base} className="chartcursor" />
                  <circle cx={hp.x} cy={hp.y} r="7" className="chartdot chartdot-active" />
                </g>
              )}
            </svg>

            {hp && (
              <div
                className="charttip"
                style={{
                  left: Math.min(Math.max(hp.x, 70), width - 70),
                  top: Math.max(hp.y - 12, 0),
                }}
              >
                <strong>{tofa(hp.value)}</strong>
                <span>بازدید، {fmtDayMonth(hp.date)}</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SiteStatsChart;

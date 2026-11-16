import React from "react";

// پیش‌نمایش ظاهری QR (جایگزین موقت)؛ با وصل شدن API می‌توان با qrcode.react عوضش کرد.
// الگو از روی خود کد ساخته می‌شود تا برای هر کد ثابت بماند.
const N = 25;

function hash(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function matrix(code) {
  let seed = hash(code);
  const rnd = () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822519) >>> 0;
    seed = Math.imul(seed ^ (seed >>> 13), 3266489917) >>> 0;
    return ((seed ^ (seed >>> 16)) >>> 0) / 4294967296;
  };
  const m = Array.from({ length: N }, () => Array.from({ length: N }, () => rnd() > 0.52));
  const finder = (r0, c0) => {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
        const ring = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[rr][cc] = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (ring || core);
      }
  };
  finder(0, 0);
  finder(0, N - 7);
  finder(N - 7, 0);
  return m;
}

const QrPreview = ({ code, size = 120, inactive = false }) => {
  const m = React.useMemo(() => matrix(code), [code]);
  return (
    <svg
      className={`qrpreview ${inactive ? "qrpreview-off" : ""}`}
      width={size}
      height={size}
      viewBox={`-1 -1 ${N + 2} ${N + 2}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR ${code}`}
    >
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
      {m.map((row, r) =>
        row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#1d2026" /> : null)),
      )}
    </svg>
  );
};

export default QrPreview;

import React from "react";
import { initials } from "../../utils/format";

const TONES = ["gold", "info", "success", "slate"];

// رنگ آواتار از روی نام ثابت می‌ماند
const toneOf = (s = "") =>
  TONES[[...s].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TONES.length];

// سلول «شخص»: آواتار حروف اول + نام + یک خط توضیح
const Person = ({ name, sub, subLtr = false }) => (
  <div className="person">
    <span className={`personavatar personavatar-${toneOf(name)}`}>{initials(name)}</span>
    <div className="personbody">
      <span className="personname">{name}</span>
      {sub && (
        <span className="personsub" dir={subLtr ? "ltr" : undefined}>
          {sub}
        </span>
      )}
    </div>
  </div>
);

export default Person;

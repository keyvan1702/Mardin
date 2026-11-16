import React from "react";
import { LuCheck } from "react-icons/lu";

// مراحل یک فرایند؛ steps: [{key,label}]، current: کلید مرحله‌ی فعلی
const Stepper = ({ steps, current }) => {
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <ol className="stepper">
      {steps.map((s, i) => {
        const state = i < idx ? "done" : i === idx ? "current" : "todo";
        return (
          <li key={s.key} className={`step step-${state}`}>
            <span className="stepdot">{state === "done" ? <LuCheck /> : i + 1}</span>
            <span className="steplabel">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;

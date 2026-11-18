import React from "react";
import Switch from "../ui/Switch";
import { toLatinDigits } from "../../utils/format";

/**
 * فیلدهای فرم بر اساس تعریف: { key, label, type, required, options, span, placeholder, dir, readOnly, hint, default }
 * type: text | tel | email | password | number | money | select | textarea | date | time | switch
 */
const digits = (v) => toLatinDigits(v).replace(/[^0-9]/g, "");

const optionList = (opts = []) => opts.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

export function FormFields({ fields, values, errors = {}, onChange, autoFocusFirst = true }) {
  const firstEditable = fields.find((f) => !f.readOnly && f.type !== "switch")?.key;

  return (
    <div className="formgrid">
      {fields.map((f) => {
        const id = `f-${f.key}`;
        const value = values[f.key];
        const err = errors[f.key];
        const wide = f.span === 2 ? "full" : "";
        const common = {
          id,
          disabled: !!f.readOnly,
          autoFocus: autoFocusFirst && f.key === firstEditable,
          "aria-invalid": err ? true : undefined,
          placeholder: f.placeholder,
        };

        if (f.type === "switch") {
          return (
            <div key={f.key} className={`field ${wide}`}>
              <Switch checked={!!value} onChange={(v) => onChange(f.key, v)} label={f.label} disabled={f.readOnly} />
              {f.hint && <span className="fieldhint">{f.hint}</span>}
            </div>
          );
        }

        let control;
        switch (f.type) {
          case "textarea":
            control = (
              <span className="fieldbox fieldbox-textarea" data-invalid={err ? "" : undefined}>
                <textarea {...common} rows={f.rows || 3} value={value} onChange={(e) => onChange(f.key, e.target.value)} />
              </span>
            );
            break;
          case "select":
            control = (
              <span className="fieldbox" data-invalid={err ? "" : undefined}>
                <select {...common} value={value} onChange={(e) => onChange(f.key, e.target.value)}>
                  <option value="">{f.placeholder || "انتخاب کنید"}</option>
                  {optionList(f.options).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </span>
            );
            break;
          case "number":
          case "money":
          case "tel":
            control = (
              <span className="fieldbox" data-invalid={err ? "" : undefined}>
                <input
                  {...common}
                  inputMode={f.type === "tel" ? "tel" : "numeric"}
                  dir="ltr"
                  value={value}
                  onChange={(e) => onChange(f.key, digits(e.target.value))}
                />
                {f.type === "money" && <span className="fieldsuffix">تومان</span>}
              </span>
            );
            break;
          case "email":
          case "password":
          case "date":
          case "time":
            control = (
              <span className="fieldbox" data-invalid={err ? "" : undefined}>
                <input
                  {...common}
                  type={f.type}
                  dir={f.type === "date" || f.type === "time" ? undefined : "ltr"}
                  autoComplete={f.type === "password" ? "new-password" : undefined}
                  value={value}
                  onChange={(e) => onChange(f.key, e.target.value)}
                />
              </span>
            );
            break;
          default:
            control = (
              <span className="fieldbox" data-invalid={err ? "" : undefined}>
                <input {...common} dir={f.dir} value={value} onChange={(e) => onChange(f.key, e.target.value)} />
              </span>
            );
        }

        return (
          <label key={f.key} className={`field ${wide}`} htmlFor={id}>
            <span className="fieldlabel">
              {f.label}
              {f.required && <span className="fieldreq"> *</span>}
            </span>
            {control}
            {err ? <span className="fielderror">{err}</span> : f.hint ? <span className="fieldhint">{f.hint}</span> : null}
          </label>
        );
      })}
    </div>
  );
}

// مقدار اولیه‌ی فرم؛ row = ردیف موجود (ویرایش) یا خالی (جدید)
export function initialValues(fields, row) {
  const out = {};
  fields.forEach((f) => {
    const existing = row?.[f.key];
    if (existing !== undefined && existing !== null) out[f.key] = f.type === "switch" ? !!existing : String(existing);
    else if (f.type === "switch") out[f.key] = f.default ?? false;
    else if (f.default === "today") out[f.key] = new Date().toISOString().slice(0, 10);
    else out[f.key] = f.default ?? "";
  });
  return out;
}

export function validateFields(fields, values) {
  const errors = {};
  fields.forEach((f) => {
    if (f.type === "switch") return;
    const v = String(values[f.key] ?? "").trim();
    if (f.required && !v) errors[f.key] = "این فیلد الزامی است.";
    else if (v && f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) errors[f.key] = "ایمیل معتبر نیست.";
    else if (v && f.type === "tel" && f.phone !== false && !/^0?9\d{9}$/.test(v) && f.strictPhone) errors[f.key] = "شماره موبایل معتبر نیست.";
    else if (v && f.min != null && Number(v) < f.min) errors[f.key] = `حداقل ${f.min} است.`;
  });
  return errors;
}

export function castValues(fields, values) {
  const out = { ...values };
  fields.forEach((f) => {
    if (f.type === "number" || f.type === "money") out[f.key] = values[f.key] === "" ? 0 : Number(values[f.key]);
    else if (typeof out[f.key] === "string") out[f.key] = out[f.key].trim();
  });
  return out;
}

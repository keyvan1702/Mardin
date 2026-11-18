import React, { useState } from "react";
import { LuSave, LuLock, LuUndo2 } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useStore } from "../services/store";
import { accessApi } from "../services/actions";
import { ACCESS_LABELS, ACCESS_ORDER, DEFAULT_ACCESS, MODULES, ROLES, ROLE_LABELS } from "../utils/permissions";

const ROLE_LIST = [ROLES.MANAGER, ROLES.OPERATOR, ROLES.ACCOUNTANT, ROLES.TECHNICIAN];
const ROLE_DESC = {
  manager: "همه‌ی بخش‌ها؛ دسترسی‌ها را او تعریف می‌کند",
  operator: "مشتریان، درخواست‌ها، ارجاع به تکنسین و محتوا",
  accountant: "فاکتور و پرداخت و گزارش‌های مالی",
  technician: "ماموریت‌ها و پرونده‌ی محصولات",
};

// ماتریس سطح دسترسی؛ با «ذخیره» فوراً روی منو و صفحه‌ها اثر می‌کند
const RolesAccess = () => {
  const toast = useToast();
  const { edit } = usePermissions();
  const canEditMatrix = edit("roles");
  const saved = useStore((s) => s.access);
  const [matrix, setMatrix] = useState(() => JSON.parse(JSON.stringify(saved)));
  const dirty = JSON.stringify(matrix) !== JSON.stringify(saved);

  const cycle = (role, module) => {
    if (!canEditMatrix || role === ROLES.MANAGER) return;
    setMatrix((m) => {
      const next = ACCESS_ORDER[(ACCESS_ORDER.indexOf(m[role][module]) + 1) % ACCESS_ORDER.length];
      return { ...m, [role]: { ...m[role], [module]: next } };
    });
  };

  return (
    <div className="modulepage">
      <PageHeader
        title="نقش‌ها و سطح دسترسی"
        subtitle="چهار نقش پنل و دسترسی هرکدام به بخش‌ها؛ روی هر خانه بزنید تا سطح عوض شود"
        actions={
          canEditMatrix && (
            <>
              <button type="button" className="btnsecondary" disabled={!dirty} onClick={() => setMatrix(JSON.parse(JSON.stringify(DEFAULT_ACCESS)))}><LuUndo2 /> بازگشت به پیش‌فرض</button>
              <button type="button" className="btnprimary" disabled={!dirty} onClick={() => { accessApi.save(matrix); toast.success("سطح دسترسی‌ها ذخیره شد و همین حالا اعمال می‌شود"); }}><LuSave /> ذخیره‌ی تغییرات</button>
            </>
          )
        }
      />

      <section className="rolecards">
        {ROLE_LIST.map((r) => (
          <div key={r} className="rolecard"><strong>{ROLE_LABELS[r]}</strong><span>{ROLE_DESC[r]}</span></div>
        ))}
      </section>

      <Panel className="panel-flush">
        <div className="tablewrap">
          <table className="datatable matrixtable">
            <thead>
              <tr>
                <th>بخش</th>
                {ROLE_LIST.map((r) => (
                  <th key={r} className="matrixcol">{ROLE_LABELS[r]}{r === ROLES.MANAGER && <LuLock className="matrixlock" title="قابل تغییر نیست" />}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((m) => (
                <tr key={m.key}>
                  <td className="tdmain">{m.label}</td>
                  {ROLE_LIST.map((r) => {
                    const level = matrix[r][m.key];
                    return (
                      <td key={r} className="matrixcol">
                        <button type="button" className={`level level-${level}`} onClick={() => cycle(r, m.key)} disabled={!canEditMatrix || r === ROLES.MANAGER} aria-label={`${ROLE_LABELS[r]} - ${m.label}: ${ACCESS_LABELS[level]}`}>
                          {ACCESS_LABELS[level]}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tablefoot">«کامل» یعنی می‌تواند ثبت و ویرایش کند؛ «مشاهده» فقط می‌بیند؛ «بدون دسترسی» بخش را در منو نمی‌بیند. مدیر همیشه به همه‌چیز دسترسی کامل دارد.</div>
      </Panel>
    </div>
  );
};

export default RolesAccess;

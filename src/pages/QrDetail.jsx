import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuPrinter, LuPower, LuShieldCheck, LuWrench, LuLock, LuPlus, LuTrash2 } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import InfoGrid from "../component/ui/InfoGrid";
import QrPreview from "../component/ui/QrPreview";
import Badge from "../component/table/Badge";
import FormDialog from "../component/crud/FormDialog";
import ConfirmDialog from "../component/crud/ConfirmDialog";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { useCollection } from "../services/store";
import { qrApi } from "../services/actions";
import { WARRANTY_EXCLUSIONS } from "../services/constants";
import { WARRANTY_STATUS, nextService, warrantyInfo } from "../utils/warranty";
import { fmtDate, tofa } from "../utils/format";

// پرونده‌ی یک محصول + QR اختصاصی آن
const QrDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { edit } = usePermissions();
  const qrs = useCollection("qr");
  const installers = useCollection("installers");
  const item = qrs.find((q) => String(q.id) === id);
  const [dialog, setDialog] = useState(null);

  if (!item) {
    return (
      <div className="modulepage">
        <PageHeader title="پرونده پیدا نشد" subtitle="این QR وجود ندارد یا حذف شده است" />
        <Link to="/products/qr" className="btnsecondary"><LuArrowRight /> بازگشت به فهرست</Link>
      </div>
    );
  }

  const w = warrantyInfo(item.installedAt, item.warrantyMonths);
  const st = WARRANTY_STATUS[w.status];
  const canEdit = edit("qr");
  const repairs = [...item.repairs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="modulepage">
      <PageHeader
        title={item.product}
        subtitle={`پرونده‌ی محصول${item.category ? ` • ${item.category}` : ""}`}
        actions={<button type="button" className="btnsecondary" onClick={() => navigate("/products/qr")}><LuArrowRight /> بازگشت</button>}
      />

      <div className="detailgrid">
        <aside className="qrcard">
          <QrPreview code={item.code} size={180} inactive={!item.active} />
          <strong className="qrcode" dir="ltr">{item.code}</strong>
          <Badge tone={item.active ? "success" : "slate"}>{item.active ? "QR فعال" : "QR غیرفعال"}</Badge>
          <div className="qractions">
            <button type="button" className="btnsecondary" onClick={() => window.print()}><LuPrinter /> چاپ QR</button>
            {canEdit && (
              <>
                <button type="button" className="btnsecondary" onClick={() => { qrApi.toggle(item.id); toast.info(item.active ? "QR غیرفعال شد" : "QR فعال شد"); }}>
                  <LuPower /> {item.active ? "غیرفعال‌سازی" : "فعال‌سازی"}
                </button>
                <button type="button" className="btnsecondary" onClick={() => setDialog("delete")}><LuTrash2 /> حذف QR</button>
              </>
            )}
          </div>
          <p className="qrnote"><LuLock /> اطلاعات خصوصی فقط پس از تأیید شماره موبایل مشتری نمایش داده می‌شود.</p>
        </aside>

        <div className="detailmain">
          <Panel title="مشخصات محصول">
            <InfoGrid items={[["مدل", item.product], ["دسته‌بندی", item.category], ["موتور", item.motor], ["مشتری", item.customer], ["تاریخ نصب", fmtDate(item.installedAt)], ["تکنسین نصاب", item.installer]]} />
          </Panel>

          <Panel title="گارانتی و سرویس دوره‌ای" hint="وضعیت از روی تاریخ نصب و مدت گارانتی به‌صورت خودکار محاسبه می‌شود" actions={<Badge tone={st.tone}>{st.label}</Badge>}>
            <InfoGrid
              items={[
                ["مدت گارانتی", `${tofa(item.warrantyMonths)} ماه`],
                ["پایان گارانتی", fmtDate(w.end)],
                ["زمان باقی‌مانده", w.days >= 0 ? `${tofa(w.days)} روز` : `${tofa(-w.days)} روز از پایان گذشته`],
                ["سرویس دوره‌ای", `هر ${tofa(item.serviceEvery)} ماه`],
                ["سرویس بعدی", fmtDate(nextService(item.installedAt, item.serviceEvery))],
              ]}
            />
            <div className="exclusions">
              <h3><LuShieldCheck /> موارد خارج از پوشش گارانتی</h3>
              <ul>{WARRANTY_EXCLUSIONS.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          </Panel>

          <Panel
            title="سوابق تعمیر و سرویس"
            actions={canEdit && <button type="button" className="btnsecondary btnxs" onClick={() => setDialog("repair")}><LuPlus /> ثبت سابقه</button>}
          >
            {repairs.length === 0 ? (
              <p className="muted">هنوز تعمیر یا سرویسی ثبت نشده است.</p>
            ) : (
              <ol className="timeline">
                {repairs.map((r, i) => (
                  <li key={r.date + r.title + i}>
                    <span className="timelinedot"><LuWrench /></span>
                    <div><strong>{r.title}</strong><span className="muted">{fmtDate(r.date)} • {r.tech}</span></div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>

      {dialog === "repair" && (
        <FormDialog
          title="ثبت سابقه‌ی تعمیر یا سرویس"
          fields={[
            { key: "title", label: "شرح کار", type: "text", required: true, span: 2 },
            { key: "date", label: "تاریخ", type: "date", required: true, default: "today" },
            { key: "tech", label: "تکنسین", type: "select", required: true, options: installers.map((i) => i.name) },
          ]}
          row={null}
          onSubmit={(v) => { qrApi.addRepair(item.id, v); toast.success("سابقه ثبت شد"); setDialog(null); }}
          onClose={() => setDialog(null)}
          size="md"
        />
      )}
      {dialog === "delete" && (
        <ConfirmDialog title="حذف QR" message={`QR ${item.code} و پرونده‌ی آن حذف شود؟`} onConfirm={() => { qrApi.remove(item.id); toast.success("QR حذف شد"); navigate("/products/qr"); }} onClose={() => setDialog(null)} />
      )}
    </div>
  );
};

export default QrDetail;

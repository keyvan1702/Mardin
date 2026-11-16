import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuArrowRight, LuPrinter, LuPower, LuShieldCheck, LuWrench, LuLock } from "react-icons/lu";
import PageHeader from "../component/ui/PageHeader";
import Panel from "../component/ui/Panel";
import InfoGrid from "../component/ui/InfoGrid";
import QrPreview from "../component/ui/QrPreview";
import Badge from "../component/table/Badge";
import { useToast } from "../component/ToastContext";
import usePermissions from "../hooks/usePermissions";
import { MOCK_QR, WARRANTY_EXCLUSIONS } from "../services/mockData";
import { WARRANTY_STATUS, nextService, warrantyInfo } from "../utils/warranty";
import { fmtDate, tofa } from "../utils/format";

// پرونده‌ی یک محصول + QR اختصاصی آن
const QrDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { edit } = usePermissions();
  const item = MOCK_QR.find((q) => String(q.id) === id);
  const [active, setActive] = useState(item?.active ?? true);

  if (!item) {
    return (
      <div className="modulepage">
        <PageHeader title="پرونده پیدا نشد" subtitle="این QR وجود ندارد یا حذف شده است" />
        <Link to="/products/qr" className="btnsecondary">
          <LuArrowRight /> بازگشت به فهرست
        </Link>
      </div>
    );
  }

  const w = warrantyInfo(item.installedAt, item.warrantyMonths);
  const st = WARRANTY_STATUS[w.status];
  const canEditQr = edit("qr");

  return (
    <div className="modulepage">
      <PageHeader
        title={item.product}
        subtitle={`پرونده‌ی محصول • ${item.category}`}
        actions={
          <button type="button" className="btnsecondary" onClick={() => navigate("/products/qr")}>
            <LuArrowRight /> بازگشت
          </button>
        }
      />

      <div className="detailgrid">
        <aside className="qrcard">
          <QrPreview code={item.code} size={180} inactive={!active} />
          <strong className="qrcode" dir="ltr">
            {item.code}
          </strong>
          <Badge tone={active ? "success" : "slate"}>{active ? "QR فعال" : "QR غیرفعال"}</Badge>
          <div className="qractions">
            <button type="button" className="btnsecondary" onClick={() => window.print()}>
              <LuPrinter /> چاپ QR
            </button>
            {canEditQr && (
              <button
                type="button"
                className="btnsecondary"
                onClick={() => {
                  setActive((a) => !a);
                  toast.info(active ? "QR غیرفعال شد" : "QR فعال شد");
                }}
              >
                <LuPower /> {active ? "غیرفعال‌سازی" : "فعال‌سازی"}
              </button>
            )}
          </div>
          <p className="qrnote">
            <LuLock /> اطلاعات خصوصی فقط پس از تأیید شماره موبایل مشتری نمایش داده می‌شود.
          </p>
        </aside>

        <div className="detailmain">
          <Panel title="مشخصات محصول">
            <InfoGrid
              items={[
                ["مدل", item.product],
                ["دسته‌بندی", item.category],
                ["موتور", item.motor],
                ["مشتری", item.customer],
                ["تاریخ نصب", fmtDate(item.installedAt)],
                ["تکنسین نصاب", item.installer],
              ]}
            />
          </Panel>

          <Panel
            title="گارانتی و سرویس دوره‌ای"
            hint="وضعیت از روی تاریخ نصب و مدت گارانتی به‌صورت خودکار محاسبه می‌شود"
            actions={<Badge tone={st.tone}>{st.label}</Badge>}
          >
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
              <h3>
                <LuShieldCheck /> موارد خارج از پوشش گارانتی
              </h3>
              <ul>
                {WARRANTY_EXCLUSIONS.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel title="سوابق تعمیر و سرویس">
            {item.repairs.length === 0 ? (
              <p className="muted">هنوز تعمیر یا سرویسی ثبت نشده است.</p>
            ) : (
              <ol className="timeline">
                {item.repairs.map((r) => (
                  <li key={r.date + r.title}>
                    <span className="timelinedot">
                      <LuWrench />
                    </span>
                    <div>
                      <strong>{r.title}</strong>
                      <span className="muted">
                        {fmtDate(r.date)} • {r.tech}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default QrDetail;

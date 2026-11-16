import React from "react";
import { LuInbox } from "react-icons/lu";

/**
 * جدول عمومی استاتیک.
 * columns: [{ key, header, render?(row), className? }]
 * rows: آرایه‌ی آبجکت‌ها
 * empty: متن حالت خالی
 * footer: متن زیر جدول (مثلاً تعداد نتایج)
 */
const DataTable = ({ columns, rows, empty = "داده‌ای برای نمایش وجود ندارد.", footer }) => (
  <div className="tablecard">
    <div className="tablewrap">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.className}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="tableemptyrow">
              <td colSpan={columns.length}>
                <div className="tableempty">
                  <span className="tableemptyicon">
                    <LuInbox />
                  </span>
                  <span>{empty}</span>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columns.map((c) => (
                  <td key={c.key} className={c.className}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {footer && <div className="tablefoot">{footer}</div>}
  </div>
);

export default DataTable;

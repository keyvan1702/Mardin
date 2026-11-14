import React from "react";

/**
 * جدول عمومی استاتیک.
 * columns: [{ key, header, render?(row) }]
 * rows: آرایه‌ی آبجکت‌ها
 * empty: متن حالت خالی
 */
const DataTable = ({ columns, rows, empty = "داده‌ای برای نمایش وجود ندارد." }) => (
  <div className="tablecard">
    <div className="tablewrap">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  padding: "40px 16px",
                }}
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
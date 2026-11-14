import React from "react";
import DataTable from "../component/table/DataTable";
import Badge from "../component/table/Badge";
import { MOCK_USERS } from "../services/mockData";
import { ROLE_LABELS, normalizeRole } from "../utils/permissions";

const SettingsAccess = () => {
  const rows = MOCK_USERS.map(({ password: _, ...u }) => u);
  const columns = [
    { key: "name", header: "کاربر", render: (r) => <strong>{r.name}</strong> },
    { key: "username", header: "نام کاربری", render: (r) => <span dir="ltr">{r.username}</span> },
    {
      key: "role",
      header: "نقش",
      render: (r) => (
        <Badge tone={normalizeRole(r.role) === "super-admin" ? "gold" : "slate"}>
          {ROLE_LABELS[normalizeRole(r.role)]}
        </Badge>
      ),
    },
  ];

  return (
    <div className="modulepage">
      <h1 className="pagetitle"><span>دسترسی‌ها</span></h1>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default SettingsAccess;
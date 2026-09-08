"use client";
import React from "react";
import { AUDIT, CONNECTORS, KPI_DEFS, MODULES, PERMS, PVIEWS, REFDATA, ROLES } from "@/lib/data";
import { useApp } from "@/lib/state";
import { Badge, Tabs } from "@/components/ui";

const TABS = ["Role permissions", "Reference data", "KPI definitions", "Connectors", "Audit log"];
const permColor: Record<string, string> = { RW: "green", R: "blue", "—": "gray" };

export default function Admin() {
  const { role, subview, setSub } = useApp();
  const tab = subview["admin"] || TABS[0];
  const setTab = (t: string) => setSub("admin", t);
  const isAdmin = role === "Admin";

  return (
    <div className="wrap">
      <h2 className="page">Admin</h2>
      <p className="sub">User and role management, role-to-module permission mapping, reference data, connectors, integrations and portal maintenance</p>
      {!isAdmin && <div className="note">🔒 Read-only. Administration is reserved to the Admin role.</div>}
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "Role permissions" && <RolePerms role={role} />}
      {tab === "Reference data" && <RefData />}
      {tab === "KPI definitions" && <KpiDefs />}
      {tab === "Connectors" && <Connectors />}
      {tab === "Audit log" && <AuditLog />}
    </div>
  );
}

function RolePerms({ role }: { role: string }) {
  return (
    <>
      <div className="note">The nine roles map into the three portal views, with module and action-level access controlled through RBAC rather than separate applications. RW = read and write · R = read only · — = no access.</div>
      <table>
        <thead><tr><th>Role</th><th>Portal view</th>{MODULES.map((m) => <th key={m}>{m}</th>)}</tr></thead>
        <tbody>
          {ROLES.map((r) => (
            <tr key={r.n} style={r.n === role ? { background: "#f6f9fc" } : undefined}>
              <td><b>{r.n}</b></td><td>{r.view}</td>
              {PERMS[r.n].map((p, i) => <td key={i}><Badge cls={permColor[p]}>{p}</Badge></td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cols mt">
        {Object.entries(PVIEWS).map(([name, v]) => (
          <div key={name} className="card">
            <b>{name}</b>
            <div className="legend mt6">{v.d}</div>
            <div className="mt6">{v.nav.filter((n) => n !== "scope").map((n) => <span key={n} className="chip">{n}</span>)}</div>
            <div className="legend mt6">{ROLES.filter((r) => r.view === name).length} roles default to this view</div>
          </div>
        ))}
      </div>
      <h3 className="mt">Role rights</h3>
      <table>
        <thead><tr><th style={{ width: "30%" }}>Role</th><th>Rights</th></tr></thead>
        <tbody>{ROLES.map((r) => <tr key={r.n}><td><b>{r.n}</b></td><td className="legend">{r.rights}</td></tr>)}</tbody>
      </table>
      <div className="legend mt">* The Factory Solution & Assets Lead holds the exclusive right to certify and publish.</div>
    </>
  );
}

function RefData() {
  return (
    <>
      <table>
        <thead><tr><th>Reference list</th><th>Values</th><th>Status</th></tr></thead>
        <tbody>
          {REFDATA.map(([n, v, s], i) => (
            <tr key={i}><td><b>{n}</b></td><td className="legend">{v}</td><td><Badge cls={s === "Locked" ? "green" : "amber"}>{s}</Badge></td></tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt">Reference data is Admin-owned. Sector, segment and the final Industry and Business Line lists remain open — see the MVP Scope page.</div>
    </>
  );
}

function KpiDefs() {
  return (
    <>
      <table>
        <thead><tr><th>KPI</th><th>Unit</th><th>Definition</th><th>Grain</th></tr></thead>
        <tbody>{KPI_DEFS.map(([n, u, d, g], i) => <tr key={i}><td><b>{n}</b></td><td>{u}</td><td className="legend">{d}</td><td className="muted">{g}</td></tr>)}</tbody>
      </table>
      <div className="legend mt">Central definitions produce daily metric snapshots — a value per KPI, per scope, per period. Coverage, % industrialized and the signal-to-opportunity attribution window still need to be pinned down precisely.</div>
    </>
  );
}

function Connectors() {
  return (
    <table>
      <thead><tr><th>Connector</th><th>Type</th><th>Credential</th><th>Licence</th><th>Used by</th><th>Status</th></tr></thead>
      <tbody>
        {CONNECTORS.map((c) => (
          <tr key={c.n}><td><b>{c.n}</b></td><td>{c.type}</td><td className="muted">{c.cred}</td><td>{c.lic}</td><td>{c.used}</td>
            <td><Badge cls={c.active ? "green" : "amber"}>{c.active ? "Active" : "Inactive"}</Badge></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AuditLog() {
  return (
    <>
      <table>
        <thead><tr><th>When</th><th>User</th><th>Action</th><th>Entity</th></tr></thead>
        <tbody>{AUDIT.map((a, i) => <tr key={i}><td className="muted" style={{ fontSize: 11 }}>{a.t}</td><td>{a.u}</td><td><b>{a.a}</b></td><td className="legend">{a.e}</td></tr>)}</tbody>
      </table>
      <div className="legend mt">Append-only. No client PII is written to logs. Admin and system jobs run an explicit, audited unscoped context.</div>
    </>
  );
}

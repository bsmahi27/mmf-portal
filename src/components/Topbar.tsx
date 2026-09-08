"use client";
import React from "react";
import { BUS, NAV, ROLES } from "@/lib/data";
import { useApp } from "@/lib/state";
import { useDrawer } from "@/lib/drawer";
import InteractionDrawer from "./drawers/InteractionDrawer";

function avatarFor(role: string) {
  const caps = role.match(/[A-Z]/g) || [];
  return caps.slice(0, 2).join("") || "U";
}

export default function Topbar() {
  const { scope, setScope, role, setRole, current, userName, logout } = useApp();
  const drawer = useDrawer();
  const bu = BUS.find((b) => b.code === scope.bu);
  const title = NAV.find((n) => n.id === current)?.label || "Dashboard";

  return (
    <div className="top">
      <h1>{title}</h1>
      <div className="sel">BU
        <select value={scope.bu} onChange={(e) => setScope({ bu: e.target.value, country: "all" })}>
          <option value="all">All BUs (SBU roll-up)</option>
          {BUS.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
        </select>
      </div>
      <div className="sel">Country
        <select disabled={!bu?.hasCountries} value={scope.country}
          onChange={(e) => setScope({ ...scope, country: e.target.value })}>
          {bu?.hasCountries ? (
            <>
              <option value="all">All countries</option>
              {bu.countries!.map((c) => <option key={c} value={c}>{c}</option>)}
            </>
          ) : <option>— not split —</option>}
        </select>
      </div>
      <div className="sel">Role
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => <option key={r.n} value={r.n}>{r.n}</option>)}
        </select>
      </div>
      <button className="btn" onClick={() => drawer.open("Log an interaction",
        <span className="badge b-blue">ProspectInteraction</span>, <InteractionDrawer />)}>✎ Log interaction</button>
      <div className="asof">As of 02 Sep 2026 09:14 · Salesforce sync</div>
      <div className="who">
        <div className="avatar">{avatarFor(role)}</div>
        <button className="btn gray sm" onClick={logout} title={userName}>Sign out</button>
      </div>
    </div>
  );
}

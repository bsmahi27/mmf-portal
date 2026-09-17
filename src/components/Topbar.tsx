"use client";
import React from "react";
import { NAV, ROLES } from "@/lib/data";
import { useApp } from "@/lib/state";
import { useDrawer } from "@/lib/drawer";
import InteractionDrawer from "./drawers/InteractionDrawer";
import type { Scope } from "@/lib/types";

function avatarFor(role: string) {
  const caps = role.match(/[A-Z]/g) || [];
  return caps.slice(0, 2).join("") || "U";
}

function scopeValue(scope: { bu: string; country: string; level?: "country" | "bu" | "sbu" }) {
  if (scope.level === "sbu" || scope.bu === "all") return "s:NCE";
  if (scope.country !== "all") {
    const countryCodes: Record<string, string> = {
      Sweden: "SE",
      Finland: "FI",
      Norway: "NO",
      Denmark: "DK",
    };
    return `c:${countryCodes[scope.country] || scope.country}`;
  }
  if (scope.level === "country") return `c:${scope.bu}`;
  return `b:${scope.bu === "NO" ? "Nordics" : scope.bu === "UK" ? "UK" : scope.bu === "DE" ? "Germany" : "Netherlands"}`;
}

function applyScope(value: string): Scope {
  const [type, code] = value.split(":");
  if (type === "s") return { bu: "all", country: "all", level: "sbu" as const };
  if (type === "b") {
    return { bu: code === "Nordics" ? "NO" : code === "Germany" ? "DE" : code === "Netherlands" ? "NL" : "UK", country: "all", level: "bu" as const };
  }
  const countries: Record<string, Scope> = {
    NL: { bu: "NL", country: "all", level: "country" as const },
    DE: { bu: "DE", country: "all", level: "country" as const },
    UK: { bu: "UK", country: "all", level: "country" as const },
    SE: { bu: "NO", country: "Sweden", level: "country" as const },
    FI: { bu: "NO", country: "Finland", level: "country" as const },
    NO: { bu: "NO", country: "Norway", level: "country" as const },
    DK: { bu: "NO", country: "Denmark", level: "country" as const },
  };
  return countries[code] || { bu: "NL", country: "all" };
}

export default function Topbar() {
  const { scope, setScope, role, setRole, current, userName, logout } = useApp();
  const drawer = useDrawer();
  const title = NAV.find((n) => n.id === current)?.label || "Dashboard";

  return (
    <div className="top">
      <h1>{title}</h1>
      <div className="top-tools">
        <div className="sel">Scope
          <select value={scopeValue(scope)} onChange={(e) => setScope(applyScope(e.target.value))}>
            <optgroup label="Country">
              <option value="c:NL">Netherlands</option>
              <option value="c:DE">Germany</option>
              <option value="c:UK">United Kingdom</option>
              <option value="c:SE">Sweden</option>
              <option value="c:FI">Finland</option>
              <option value="c:NO">Norway</option>
              <option value="c:DK">Denmark</option>
            </optgroup>
            <optgroup label="BU roll-up">
              <option value="b:Netherlands">Netherlands (BU)</option>
              <option value="b:Germany">Germany (BU)</option>
              <option value="b:UK">UK (BU)</option>
              <option value="b:Nordics">Nordics (BU)</option>
            </optgroup>
            <optgroup label="SBU">
              <option value="s:NCE">NCE - all countries</option>
            </optgroup>
          </select>
        </div>
        <div className="sel">Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r.n} value={r.n}>{r.n}</option>)}
          </select>
        </div>
        <button className="btn" onClick={() => drawer.open("Log an interaction",
          <span className="badge b-blue">ProspectInteraction</span>, <InteractionDrawer />)}>✎ Log interaction</button>
        <div className="asof">As of 15 Sep 2026 09:14 · Salesforce sync</div>
        <div className="who">
          <div className="avatar">{avatarFor(role)}</div>
          <button className="btn gray sm" onClick={logout} title={userName}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

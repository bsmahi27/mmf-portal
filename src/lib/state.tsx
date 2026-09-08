"use client";
import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { BUS, MODULES, PERMS, PVIEWS, ROLES, KPI, KPI_COUNTRY } from "./data";
import type { Scope, KpiSet } from "./types";

type AppState = {
  scope: Scope;
  setScope: (s: Scope) => void;
  role: string;
  setRole: (r: string) => void;
  pview: string;
  setPview: (p: string) => void;
  current: string;
  subview: Record<string, string>;
  go: (id: string, sub?: string) => void;
  setSub: (page: string, tab: string) => void;
  campFilter: string;
  setCampFilter: (f: string) => void;
  isAuthed: boolean;
  userName: string;
  login: (name: string, role: string) => void;
  logout: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<Scope>({ bu: "DE", country: "all" });
  const [role, setRoleState] = useState<string>("BU MM (Business) Leader");
  const [pview, setPviewState] = useState<string>("Leadership");
  const [current, setCurrent] = useState<string>("dashboard");
  const [subview, setSubview] = useState<Record<string, string>>({});
  const [campFilter, setCampFilter] = useState<string>("All");
  const [isAuthed, setIsAuthed] = useState(false);
  const [userName, setUserName] = useState("");

  const setRole = (r: string) => {
    setRoleState(r);
    const found = ROLES.find((x) => x.n === r);
    if (found) setPviewState(found.view);
  };

  const setPview = (p: string) => setPviewState(p);

  const setScopeSafe = (s: Scope) => setScope(s);

  const go = (id: string, sub?: string) => {
    setCurrent(id);
    if (sub) setSubview((prev) => ({ ...prev, [id]: sub }));
  };
  const setSub = (page: string, tab: string) => setSubview((prev) => ({ ...prev, [page]: tab }));

  const login = (name: string, r: string) => {
    setUserName(name);
    setRole(r);
    setIsAuthed(true);
  };
  const logout = () => {
    setIsAuthed(false);
    setUserName("");
    setCurrent("dashboard");
  };

  const value: AppState = {
    scope, setScope: setScopeSafe, role, setRole, pview, setPview, current, subview, go, setSub,
    campFilter, setCampFilter,
    isAuthed, userName, login, logout,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}

// ---- Scoping & permission helpers ----

export function inScope<T extends { bu: string; country?: string }>(scope: Scope, r: T) {
  return (scope.bu === "all" || r.bu === scope.bu) &&
    (scope.country === "all" || !r.country || r.country === scope.country);
}

export function scopeLabel(scope: Scope) {
  if (scope.bu === "all") return "NCE — SBU roll-up";
  if (scope.country !== "all") return `${scope.country} (Nordics)`;
  const bu = BUS.find((b) => b.code === scope.bu);
  return bu ? bu.name : scope.bu;
}

export function buName(code: string) {
  const bu = BUS.find((b) => b.code === code);
  return bu ? bu.name : code;
}

export function kpiFor(scope: Scope): KpiSet {
  if (scope.bu === "all") {
    const bus = Object.values(KPI);
    const sum = (f: keyof KpiSet) => bus.reduce((a, b) => a + b[f], 0);
    const avg = (f: keyof KpiSet) => sum(f) / bus.length;
    return {
      pipeline: sum("pipeline"), revenue: sum("revenue"), outreach: sum("outreach"),
      meetings: sum("meetings"), oppsCreated: sum("oppsCreated"), signals: sum("signals"),
      coverage: avg("coverage"), reuse: avg("reuse"), conv: avg("conv"), stageConv: avg("stageConv"),
      pTarget: sum("pTarget"), rTarget: sum("rTarget"), cTarget: avg("cTarget"),
    };
  }
  if (scope.bu === "NO" && scope.country !== "all") return KPI_COUNTRY[scope.country];
  return KPI[scope.bu];
}

export function perms(role: string): string[] {
  return PERMS[role] || [];
}

export function can(role: string, mod: string, rw = false) {
  const idx = MODULES.indexOf(mod);
  const p = perms(role)[idx];
  if (!p) return false;
  if (rw) return p.startsWith("RW");
  return p !== "—";
}

export function roleRights(role: string) {
  const r = ROLES.find((x) => x.n === role);
  return r ? r.rights : "";
}

export function navIds(pview: string) {
  return PVIEWS[pview]?.nav || [];
}

// ---- formatting helpers ----
export function money(n: number) {
  return `€${n.toFixed(1)}M`;
}
export function stars(r: number) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
export function pctColor(p: number) {
  if (p >= 90) return "var(--green)";
  if (p >= 70) return "var(--amber)";
  return "var(--red)";
}

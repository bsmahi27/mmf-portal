"use client";
import React from "react";

export function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return <span className={`badge b-${cls}`}>{children}</span>;
}

export function Kpi({ lab, val, meta }: { lab: string; val: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <div className="kpi">
      <div className="lab">{lab}</div>
      <div className="val">{val}</div>
      {meta && <div className="meta">{meta}</div>}
    </div>
  );
}

export function Chip({ on, onClick, children }: { on?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <span className={`chip${on ? " on" : ""}${onClick ? " clk" : ""}`} onClick={onClick}>
      {children}
    </span>
  );
}

export function ProgressBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="bar">
      <i style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

export function Ring({ pct, color }: { pct: number; color: string }) {
  const r = 24, c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <svg className="ring" viewBox="0 0 58 58">
      <circle cx="29" cy="29" r={r} fill="none" stroke="#eef2f7" strokeWidth="6" />
      <circle cx="29" cy="29" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c}
        strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 29 29)" />
      <text x="29" y="33" textAnchor="middle" fontSize="12" fontWeight={700} fill="var(--ink)">{Math.round(pct)}%</text>
    </svg>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button key={t} className={t === active ? "active" : ""} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <div className="note">{children}</div>;
}

export function RoleBar({ role, mod, rw }: { role: string; mod: string; rw: boolean }) {
  if (rw) return null;
  return <div className="note">🔒 Read-only for {role}. Row-level security and role-to-module permissions enforced across every write action on this page.</div>;
}

export function Legend({ children }: { children: React.ReactNode }) {
  return <div className="legend">{children}</div>;
}

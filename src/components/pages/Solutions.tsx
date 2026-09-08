"use client";
import React, { useState } from "react";
import { ASSETS, PLAY_TEMPLATES, SOLUTIONS } from "@/lib/data";
import { useApp } from "@/lib/state";
import { Badge, Chip, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import SolutionDrawer from "@/components/drawers/SolutionDrawer";

const TABS = ["Solution catalog", "Asset library", "Play templates"];
const certColor: Record<string, string> = { "Certified & Published": "green", "Submitted": "amber", "Draft": "gray" };
const clsColor: Record<string, string> = { "Industry": "teal", "Business Line": "violet", "Cross-Business Line": "blue" };

export default function Solutions() {
  const { subview, setSub, role } = useApp();
  const tab = subview["solutions"] || TABS[0];
  const setTab = (t: string) => setSub("solutions", t);

  return (
    <div className="wrap">
      <h2 className="page">Solutions & Assets</h2>
      <p className="sub">The Factory&apos;s catalog of repeatable solutions, the reusable assets behind each, and the play templates campaigns instantiate</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "Solution catalog" && <Catalog role={role} />}
      {tab === "Asset library" && <AssetLibrary />}
      {tab === "Play templates" && <Plays />}
    </div>
  );
}

function Catalog({ role }: { role: string }) {
  const drawer = useDrawer();
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const filterKeys = ["Industry", "Business Line", "Cross-Business Line", "Industrialized", "Certified & Published"];
  const active = Object.keys(filters).filter((k) => filters[k]);
  const filtered = SOLUTIONS.filter((s) => !active.length || active.includes(s.cls) || active.includes(s.mat) || active.includes(s.cert));
  const isAssetLead = role === "Factory Solution & Assets Lead";

  return (
    <>
      <div className="mb wrapf flex"><span className="muted" style={{ marginRight: 4 }}>Filter:</span>
        {filterKeys.map((k) => <Chip key={k} on={!!filters[k]} onClick={() => setFilters((v) => ({ ...v, [k]: !v[k] }))}>{k}</Chip>)}
      </div>
      <div className="cols">
        {filtered.map((s) => (
          <div key={s.n} className="card" style={{ cursor: "pointer" }} onClick={() => drawer.open(s.n, <span className="muted">{s.tag}</span>, <SolutionDrawer s={s} />)}>
            <div className="flex wrapf mb"><Badge cls={clsColor[s.cls]}>{s.cls}</Badge><Badge cls={s.mat === "Industrialized" ? "green" : s.mat === "In-Development" ? "amber" : "gray"}>{s.mat}</Badge></div>
            <b>{s.n}</b>
            <div className="legend">{s.tag}</div>
            <div className="legend mt6">{ASSETS.filter((a) => a.sol === s.n).length} assets · reused {s.reuse}×</div>
            <div className="mt6"><Badge cls={certColor[s.cert]}>{s.cert}</Badge></div>
          </div>
        ))}
      </div>
      <div className="legend mt">Certification workflow: Draft → Submitted → Certified & Published. Signed off by Factory Solution & Assets Lead. Published means reusable by every BU. Files live in SharePoint; portal stores metadata, link, version pointer. {isAssetLead ? "You hold publishing rights." : `Publishing unavailable to ${role}.`}</div>
    </>
  );
}

function AssetLibrary() {
  const [q, setQ] = useState("");
  const filtered = ASSETS.filter((a) => JSON.stringify(a).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <input className="t mb" placeholder="Search assets…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
      <table>
        <thead><tr><th>Asset</th><th>Type</th><th>Solution</th><th>Version</th><th>Carve-out / reusable</th><th>Certification</th></tr></thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.n}><td><b>{a.n}</b></td><td>{a.type}</td><td className="muted">{a.sol}</td><td>{a.ver}</td>
              <td>{a.carve ? <Badge cls="green">Yes</Badge> : "—"}</td>
              <td><Badge cls={certColor[a.cert]}>{a.cert}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt">Carve-out and reusable templates identified so they can be lifted into a new pursuit without rework. Assets are SharePoint-linked with version history; reuse analytics feed the % industrialized KPI.</div>
    </>
  );
}

function Plays() {
  return (
    <>
      <table>
        <thead><tr><th>Play template</th><th>Solution</th><th>Channel</th><th>Default steps</th><th>Status</th></tr></thead>
        <tbody>{PLAY_TEMPLATES.map((p) => <tr key={p.n}><td><b>{p.n}</b></td><td>{p.sol}</td><td>{p.ch}</td><td>{p.steps}</td><td>{p.status}</td></tr>)}</tbody>
      </table>
      <div className="legend mt">Campaigns instantiate a template as a Play and tailor it — channel, sequence, timing and attached assets.</div>
    </>
  );
}

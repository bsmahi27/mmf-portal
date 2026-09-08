"use client";
import React, { useState } from "react";
import { CONNECTORS, ENGINES, SIGNALS } from "@/lib/data";
import { can, inScope, useApp } from "@/lib/state";
import { Badge, Chip, RoleBar, Tabs } from "@/components/ui";

const TABS = ["Signal queue", "Engines", "Engine configuration", "Sources"];

const RULES = [
  ["Cost-reduction language", "keywords: opex, efficiency, cost programme", "Budget pressure", "1.0"],
  ["ERP / application estate", "keywords: SAP, legacy ERP, modernization", "Application estate constraint", "0.9"],
  ["Tender published", "event: tender · threshold > €1M", "Procurement window open", "1.0"],
  ["Technology hiring spike", "count > 15 roles in 90 days", "In-flight programme being staffed", "0.7"],
  ["Leadership change", "entity: CIO, CDO, CFO appointment", "New mandate likely", "0.6"],
];

export default function Radar() {
  const { scope, role, subview, setSub } = useApp();
  const tab = subview["radar"] || TABS[0];
  const setTab = (t: string) => setSub("radar", t);
  const rw = can(role, "Triggers Radar", true);
  const inScopeEngines = ENGINES.filter((e) => scope.bu === "all" || e.bu === scope.bu);
  const inScopeSignals = SIGNALS.filter((s) => inScope(scope, s));

  return (
    <div className="wrap">
      <h2 className="page">Triggers Radar</h2>
      <p className="sub">BU → Radar Engine → Trigger Rules → Signals · daily batch · deterministic filters combined with AI relevance scoring</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <RoleBar role={role} mod="Triggers Radar" rw={rw} />
      {tab === "Signal queue" && <SignalQueue signals={inScopeSignals} rw={rw} />}
      {tab === "Engines" && <Engines engines={inScopeEngines} rw={rw} onConfig={() => setTab("Engine configuration")} />}
      {tab === "Engine configuration" && <Config scope={scope} rw={rw} />}
      {tab === "Sources" && <Sources role={role} />}
    </div>
  );
}

function SignalQueue({ signals, rw }: { signals: typeof SIGNALS; rw: boolean }) {
  const [status, setStatus] = useState<Record<number, string>>({});
  const sorted = signals.map((s, i) => ({ s, i })).sort((a, b) => b.s.score - a.s.score);
  return (
    <>
      <div className="flex wrapf mb between">
        <div className="flex wrapf">
          <Badge cls="blue">New {signals.filter((s) => s.status === "New").length}</Badge>
          <Badge cls="gray">Reviewed {signals.filter((s) => s.status === "Reviewed").length}</Badge>
          <Badge cls="gray">Dismissed {signals.filter((s) => s.status === "Dismissed").length}</Badge>
        </div>
        <div className="miniflow"><span className="s on">New</span> → <span className="s">Reviewed</span> → <span className="s">Dismissed</span></div>
      </div>
      {sorted.map(({ s, i }) => {
        const st = status[i];
        return (
          <div key={i} className="sig" style={{ opacity: st ? 0.6 : 1 }}>
            <div className="flex between wrapf">
              <div className="flex wrapf">
                <span className="score">{s.score}</span>
                <Badge cls={s.sev === "High" ? "red" : "amber"}>{s.sev}</Badge>
                <b>{s.acct}</b>
                <Badge cls={s.status === "New" ? "blue" : "gray"}>{st || s.status}</Badge>
              </div>
              <div className="muted" style={{ fontSize: 11 }}>{s.engine} · {s.src}</div>
            </div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>{s.title}</div>
            <div className="mt6">🤖 {s.sum} <Badge cls="amber">AI-generated</Badge></div>
            {rw && (
              <div className="flex mt wrapf">
                <button className="btn ghost sm" onClick={() => setStatus((v) => ({ ...v, [i]: "Reviewed" }))}>✓ Mark reviewed</button>
                <button className="btn ghost sm" onClick={() => setStatus((v) => ({ ...v, [i]: "Added to campaign" }))}>＋ Add to campaign</button>
                <button className="btn ghost sm" onClick={() => setStatus((v) => ({ ...v, [i]: "Linked to prospect" }))}>🎯 Link to prospect</button>
                <button className="btn gray sm" onClick={() => setStatus((v) => ({ ...v, [i]: "Dismissed" }))}>✕ Dismiss</button>
              </div>
            )}
            {st && <div className="mt6"><Badge cls="green">{st}</Badge></div>}
          </div>
        );
      })}
      <div className="legend mt">Signals are deduped across runs before they reach the queue. Notification via Teams, email or in-app digest — high-severity signals surface immediately.</div>
    </>
  );
}

function Engines({ engines, rw, onConfig }: { engines: typeof ENGINES; rw: boolean; onConfig: () => void }) {
  return (
    <>
      <div className="flex between mb"><div className="legend">{engines.length} engines in scope</div>{rw && <button className="btn sm" onClick={onConfig}>+ New engine</button>}</div>
      <div className="cols">
        {engines.map((e) => (
          <div key={e.n} className="card">
            <div className="flex between"><b>{e.n}</b><Badge cls="green">Active</Badge></div>
            <div className="legend mt6">{e.clients} accounts in the client set · {e.rules} trigger rules · {e.sched} batch</div>
            <div className="flex between mt">
              <Badge cls="blue">{e.signals} signals (30d)</Badge>
              {rw && <button className="btn ghost sm" onClick={onConfig}>Configure</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="legend mt">One BU runs several engines, each watching a defined client set. The client set draws on the same account repository as campaign target accounts, so accounts flow between the two.</div>
    </>
  );
}

function Config({ scope, rw }: { scope: { bu: string; country: string }; rw: boolean }) {
  const [sources, setSources] = useState<Record<string, boolean>>(
    Object.fromEntries(CONNECTORS.filter((c) => c.used.includes("Radar")).map((c) => [c.n, c.active]))
  );
  return (
    <div className="card">
      <div className="f2">
        <div><label className="fl">Engine name</label><input className="t" defaultValue={`${scope.bu === "all" ? "DE" : scope.bu} · Industrial`} disabled={!rw} /></div>
        <div><label className="fl">Business Unit</label><select className="t" disabled={!rw}><option>UK</option><option>DE</option><option>NL</option><option>NO</option></select></div>
        <div><label className="fl">Batch schedule</label><select className="t" disabled={!rw}><option>Daily</option><option>Weekly</option></select></div>
        <div><label className="fl">Owner</label><input className="t" defaultValue="Factory Agentic Lead" disabled={!rw} /></div>
      </div>
      <label className="fl">Client set</label>
      <div className="flex wrapf">
        <button className="btn ghost sm">📄 From a target list</button>
        <button className="btn ghost sm">🔍 From a filter (BU + sector)</button>
        <button className="btn ghost sm">🎯 From campaign target accounts</button>
      </div>
      <div className="legend mt6">24 accounts currently in the set</div>

      <label className="fl">Sources</label>
      <div>
        {Object.keys(sources).map((n) => (
          <Chip key={n} on={sources[n]} onClick={() => setSources((v) => ({ ...v, [n]: !v[n] }))}>{n}</Chip>
        ))}
      </div>

      <div className="card mt" style={{ background: "#eef4fa" }}>
        <h3>Trigger rules</h3>
        <table>
          <thead><tr><th>Rule</th><th>Logic</th><th>AI relevance focus</th><th>Weight</th></tr></thead>
          <tbody>{RULES.map((r) => <tr key={r[0]}><td>{r[0]}</td><td className="legend">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody>
        </table>
        {rw && <button className="btn ghost sm mt">Add rule</button>}
      </div>

      <label className="fl">AI focus</label>
      <textarea rows={3} defaultValue="Prioritise signals indicating budget pressure, incumbent contract expiry, ERP or application estate constraints, and technology hiring that implies an in-flight programme. Weight higher for target accounts with an existing Capgemini relationship." disabled={!rw} />

      <div className="mt"><button className="btn" disabled={!rw} onClick={() => alert("Would save the engine and schedule the first batch tonight.")}>Save engine</button></div>
      <div className="legend mt">Daily batch per engine: fetch sources → rules and AI scoring → dedupe → signals → notify.</div>
    </div>
  );
}

function Sources({ role }: { role: string }) {
  const canRegister = role === "Admin" || role === "Factory Agentic Lead";
  return (
    <>
      <div className="note">DataSourceConnector is a shared registry used by both Triggers Radar and Smart Agents. Each connector carries its configuration, a Key Vault credential reference and its licence terms.</div>
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
      <div className="mt">
        {canRegister ? <button className="btn sm">Register a source</button> : <div className="legend">Only Admin or the Factory Agentic Lead can register a source.</div>}
      </div>
      <div className="legend mt">⚠️ Subscription and in-house sources require procurement clearance on licensing terms, and Data Privacy Officer sign-off where personal or regulated data is involved. Credentials held in Azure Key Vault, never in database.</div>
    </>
  );
}

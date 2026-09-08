"use client";
import React, { useState } from "react";
import {
  CAMPAIGNS, CAMP_HISTORY, CSTATES, ENGINES, PLAYBOOK_PARTS, PLAY_TEMPLATES, SOLUTIONS, UPLOADED_ACCTS,
} from "@/lib/data";
import { buName, can, inScope, useApp } from "@/lib/state";
import { Badge, Chip, RoleBar, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import CampaignDrawer from "@/components/drawers/CampaignDrawer";

const TABS = ["Board", "Plan a campaign", "Target accounts", "Playbook repository", "Change history"];
const statusColor: Record<string, string> = {
  Active: "green", Review: "violet", Paused: "amber", Draft: "gray", Planned: "blue", Approved: "blue", Closed: "gray",
};

export default function Campaigns() {
  const { scope, role, subview, setSub, go } = useApp();
  const tab = subview["campaigns"] || TABS[0];
  const setTab = (t: string) => setSub("campaigns", t);
  const rw = can(role, "Campaigns", true);
  const inScopeCampaigns = CAMPAIGNS.filter((c) => inScope(scope, c));

  return (
    <div className="wrap">
      <h2 className="page">Campaigns</h2>
      <p className="sub">Plan · edit · execute · attribute — solutions tied to a shortlisted account or prospect set, prioritized by Radar signals, tracked from targeting to won revenue</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <RoleBar role={role} mod="Campaigns" rw={rw} />
      {tab === "Board" && <Board campaigns={inScopeCampaigns} rw={rw} onNew={() => setTab("Plan a campaign")} />}
      {tab === "Plan a campaign" && <Plan scope={scope} rw={rw} onUpload={() => setTab("Target accounts")} onProspects={() => go("prospects", "All prospects")} onRadar={() => go("radar", "Engines")} />}
      {tab === "Target accounts" && <TargetAccounts scope={scope} onRadar={() => go("radar", "Engines")} />}
      {tab === "Playbook repository" && <Playbook campaigns={inScopeCampaigns} />}
      {tab === "Change history" && <History campaigns={inScopeCampaigns} />}
    </div>
  );
}

function Board({ campaigns, rw, onNew }: { campaigns: typeof CAMPAIGNS; rw: boolean; onNew: () => void }) {
  const drawer = useDrawer();
  const { campFilter, setCampFilter } = useApp();
  const filtered = campFilter === "All" ? campaigns : campaigns.filter((c) => c.status === campFilter);
  return (
    <>
      <div className="flex wrapf mb between">
        <div className="flex wrapf">
          <span className="muted" style={{ marginRight: 4 }}>Filter by status:</span>
          {["All", ...CSTATES].map((s) => <Chip key={s} on={campFilter === s} onClick={() => setCampFilter(s)}>{s}</Chip>)}
        </div>
        {rw && <button className="btn sm" onClick={onNew}>+ New campaign</button>}
      </div>
      <div className="legend mb">{campaigns.length} campaigns in scope · {campaigns.filter((c) => c.status === "Active").length} active</div>
      <div className="kanban">
        {CSTATES.map((status) => {
          const items = filtered.filter((c) => c.status === status);
          return (
            <div key={status} className="kcol">
              <h4>{status} ({items.length})</h4>
              {items.length ? items.map((c) => (
                <div key={c.n} className="kcard" onClick={() => drawer.open(c.n, <Badge cls={statusColor[c.status]}>{c.status}</Badge>, <CampaignDrawer c={c} />)}>
                  <b>{c.n}</b>
                  <div className="muted">{c.sol}</div>
                  <span className="chip">{c.accts} accts</span>
                  {c.m.pipe > 0 && <span className="chip">€{c.m.pipe.toFixed(1)}M</span>}
                  {c.signalDriven && <span className="chip">📡</span>}
                </div>
              )) : <div className="muted">—</div>}
            </div>
          );
        })}
      </div>
      <div className="legend mt">Draft → Planned → Approved → Active ⇄ Paused → Closed → Review. 📡 = signal-driven campaign.</div>
    </>
  );
}

function Plan({ scope, rw, onUpload, onProspects, onRadar }: {
  scope: { bu: string; country: string }; rw: boolean; onUpload: () => void; onProspects: () => void; onRadar: () => void;
}) {
  const [sols, setSols] = useState<Record<string, boolean>>({ [SOLUTIONS[0].n]: true });
  const [plays, setPlays] = useState<Record<string, boolean>>({});
  return (
    <div className="card">
      <div className="f2">
        <div><label className="fl">Campaign name</label><input className="t" disabled={!rw} /></div>
        <div><label className="fl">Business Unit</label><select className="t" disabled={!rw} defaultValue={scope.bu === "all" ? "DE" : scope.bu}><option value="UK">UK</option><option value="DE">Germany</option><option value="NL">Netherlands</option><option value="NO">Nordics</option></select></div>
        <div><label className="fl">Country</label><select className="t" disabled={!rw}><option>—</option><option>Sweden</option><option>Finland</option><option>Norway</option><option>Denmark</option></select></div>
        <div><label className="fl">Campaign owner</label><input className="t" disabled={!rw} /></div>
        <div><label className="fl">Status</label><select className="t" disabled={!rw}>{CSTATES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="fl">Approver</label><input className="t" disabled={!rw} /></div>
        <div><label className="fl">Start date</label><input className="t" disabled={!rw} /></div>
        <div><label className="fl">End date</label><input className="t" disabled={!rw} /></div>
      </div>
      <label className="fl">Solution(s)</label>
      <div>{SOLUTIONS.map((s) => <Chip key={s.n} on={!!sols[s.n]} onClick={() => setSols((v) => ({ ...v, [s.n]: !v[s.n] }))}>{s.n}</Chip>)}</div>
      <label className="fl">Objective</label>
      <textarea rows={2} placeholder="Open 8 qualified conversations and €6M of MM Factory pipeline in mid-market manufacturing" disabled={!rw} />

      <label className="fl">Account / prospect shortlist — four sources</label>
      <div className="card" style={{ background: "#f6f9fc" }}>
        <div className="flex wrapf">
          <button className="btn ghost sm">📄 Target account list</button>
          <button className="btn ghost sm" onClick={onUpload}>⬆ Direct upload</button>
          <button className="btn ghost sm" onClick={onProspects}>🎯 Prospect Repository</button>
          <button className="btn ghost sm" onClick={onRadar}>📡 Radar engine</button>
        </div>
      </div>

      <label className="fl">Radar engine (optional)</label>
      <select className="t" disabled={!rw}><option>— none —</option>{ENGINES.map((e) => <option key={e.n}>{e.n}</option>)}</select>

      <label className="fl">Plays</label>
      <div>{PLAY_TEMPLATES.map((p) => <Chip key={p.n} on={!!plays[p.n]} onClick={() => setPlays((v) => ({ ...v, [p.n]: !v[p.n] }))}>{p.n}</Chip>)}</div>

      <div className="mt">
        <button className="btn" disabled={!rw} onClick={() => alert("Would create the campaign in Draft, generate the playbook shell and submit it to the BU Leader for approval.")}>Create campaign</button>
      </div>
    </div>
  );
}

function TargetAccounts({ scope, onRadar }: { scope: { bu: string; country: string }; onRadar: () => void }) {
  const accts = UPLOADED_ACCTS.filter((a) => inScope(scope, a));
  return (
    <>
      <div className="note">Target account management — upload and manage independent of Salesforce. New-business prospects not yet in Salesforce are supported and remain portal-maintained.</div>
      <div className="row">
        <div className="card" style={{ flex: 1, minWidth: 280 }}>
          <h3>Upload target accounts</h3>
          <button className="btn ghost sm">Download template</button>
          <div className="card mt" style={{ background: "#f6f9fc" }}>Drop file here (target_accounts.xlsx)</div>
          <label className="fl">Campaign assignment</label>
          <select className="t">{CAMPAIGNS.map((c) => <option key={c.n}>{c.n}</option>)}</select>
          <div className="mt"><button className="btn sm">Validate & attach</button></div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 280 }}>
          <h3>Common account repository</h3>
          <div className="miniflow"><span className="s on">Campaign target accounts</span> ⇄ <span className="s on">Radar monitored accounts</span></div>
          <div className="legend mt">Accounts added to a campaign become available to Triggers Radar automatically, and vice versa.</div>
          <div className="mt"><button className="btn ghost sm" onClick={onRadar}>Open Radar engines</button></div>
        </div>
      </div>
      <table className="mt">
        <thead><tr><th>Account</th><th>BU</th><th>Sector</th><th>Campaign</th><th>Owner</th><th>Confidence</th><th>Salesforce status</th></tr></thead>
        <tbody>
          {accts.map((a) => (
            <tr key={a.n}><td><b>{a.n}</b></td><td>{buName(a.bu)}{a.country ? ` · ${a.country}` : ""}</td><td>{a.sector}</td>
              <td className="muted">{a.camp}</td><td>{a.owner}</td>
              <td><Badge cls={a.conf === "High" ? "green" : a.conf === "Medium" ? "amber" : "gray"}>{a.conf}</Badge></td>
              <td>{a.sf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Playbook({ campaigns }: { campaigns: typeof CAMPAIGNS }) {
  const drawer = useDrawer();
  return (
    <>
      <div className="note">Campaign Playbook Repository — central store of campaign brief, messaging, personas, value prop, objection handling, so execution is repeatable and knowledge is retained.</div>
      <div className="cols mb">
        {PLAYBOOK_PARTS.map(([n, d]) => (
          <div key={n} className="card"><h3>{n}</h3><div className="legend">{d}</div></div>
        ))}
      </div>
      <table>
        <thead><tr><th>Campaign</th><th>Solution</th><th>Components complete</th><th>Reusable</th></tr></thead>
        <tbody>
          {campaigns.map((c) => {
            const complete = c.status === "Draft" ? 1 : c.status === "Planned" ? 3 : 5;
            return (
              <tr key={c.n} className="clk" onClick={() => drawer.open(c.n, <Badge cls={statusColor[c.status]}>{c.status}</Badge>, <CampaignDrawer c={c} />)}>
                <td><b>{c.n}</b></td><td className="muted">{c.sol}</td>
                <td>{"●".repeat(complete)}{"○".repeat(5 - complete)} {complete}/5</td>
                <td><Badge cls={complete === 5 ? "green" : "gray"}>{complete === 5 ? "Yes" : "Not yet"}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function History({ campaigns }: { campaigns: typeof CAMPAIGNS }) {
  const names = campaigns.map((c) => c.n);
  const history = CAMP_HISTORY.filter((h) => names.includes(h.c));
  return (
    <table>
      <thead><tr><th>When</th><th>Campaign</th><th>Who</th><th>Change</th></tr></thead>
      <tbody>{history.map((h, i) => <tr key={i}><td>{h.when}</td><td><b>{h.c}</b></td><td>{h.who}</td><td>{h.what}</td></tr>)}</tbody>
    </table>
  );
}

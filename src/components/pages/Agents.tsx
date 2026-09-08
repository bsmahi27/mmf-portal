"use client";
import React from "react";
import { AGENTS, AGENT_USAGE } from "@/lib/data";
import { stars, useApp } from "@/lib/state";
import { Badge, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import AgentDrawer from "@/components/drawers/AgentDrawer";
import RegisterAgentDrawer from "@/components/drawers/RegisterAgentDrawer";

const TABS = ["Registry", "Adoption analytics", "Governance"];

export default function Agents() {
  const { role, subview, setSub } = useApp();
  const tab = subview["agents"] || TABS[0];
  const setTab = (t: string) => setSub("agents", t);
  const canRegister = role === "Factory Agentic Lead" || role === "Admin";

  return (
    <div className="wrap">
      <h2 className="page">Smart Agents</h2>
      <p className="sub">A governed registry of AI agents mapped to the sales cycle, invoked on a specific account or opportunity · owned by the Factory Agentic Lead</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "Registry" && <Registry canRegister={canRegister} />}
      {tab === "Adoption analytics" && <Adoption />}
      {tab === "Governance" && <Governance />}
    </div>
  );
}

function Registry({ canRegister }: { canRegister: boolean }) {
  const drawer = useDrawer();
  return (
    <div className="cols">
      {AGENTS.map((a) => {
        const usage = AGENT_USAGE.find((u) => u.n === a.n);
        return (
          <div key={a.n} className="agentcard" onClick={() => drawer.open(a.n, <Badge cls={a.status === "Published" ? "green" : "amber"}>{a.status}</Badge>, <AgentDrawer a={a} />)}>
            <div className="flex between mb"><div className="ic">{a.ic}</div><div className="flex"><Badge cls={a.type === "Internal" ? "violet" : "blue"}>{a.type}</Badge><span className="legend">{a.ver}</span></div></div>
            <b>{a.n}</b>
            <div className="legend">{a.stage}</div>
            <div style={{ fontSize: 12.4 }} className="mt6">{a.d}</div>
            <div className="mt6">{a.grounding.map((g) => <span key={g} className="chip">{g}</span>)}</div>
            <div className="flex between mt6"><Badge cls={a.status === "Published" ? "green" : "amber"}>{a.status}</Badge>
              {usage && <span className="legend">{usage.inv} runs {stars(usage.rating)}</span>}</div>
          </div>
        );
      })}
      <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
        <h3>Register an external agent</h3>
        <div className="legend mb">Built elsewhere? Register an endpoint, auth and input/output schema — the Agent API contract — and it is invoked through the same UI.</div>
        <button className="btn sm" disabled={!canRegister}
          onClick={() => drawer.open("Register an external agent", <Badge cls="blue">Agent API contract</Badge>, <RegisterAgentDrawer />)}>
          {canRegister ? "+ Register agent" : "🔒 + Register agent"}
        </button>
      </div>
      <div className="legend mt" style={{ gridColumn: "1/-1" }}>Internal agents are authored in-app — prompt, model, grounding and I/O. External agents are built elsewhere and registered via the contract. Only Published agents are visible to sellers.</div>
    </div>
  );
}

function Adoption() {
  const maxInv = Math.max(...AGENT_USAGE.map((a) => a.inv));
  const countryTotals: Record<string, number> = { Sweden: 0, Finland: 0, Norway: 0, Denmark: 0 };
  AGENT_USAGE.forEach((a) => Object.entries(a.byCountry).forEach(([c, v]) => (countryTotals[c] += v)));
  const roleTotals: Record<string, number> = {};
  AGENT_USAGE.forEach((a) => Object.entries(a.byRole).forEach(([r, v]) => (roleTotals[r] = (roleTotals[r] || 0) + v)));
  const total = AGENT_USAGE.reduce((s, a) => s + a.inv, 0);
  return (
    <>
      <div className="note">Adoption analytics — invocations by user, role, BU and country, with ratings and feedback on generated outputs. The same figures surface on the Executive Dashboard under Agent adoption.</div>
      <table>
        <thead><tr><th>Agent</th><th>Invocations</th><th>Distinct users</th><th>Outputs</th><th>Rating</th><th>Trend</th><th>UK</th><th>DE</th><th>NL</th><th>Nordics</th><th>Last used</th></tr></thead>
        <tbody>
          {AGENT_USAGE.map((a) => (
            <tr key={a.n}><td><b>{a.n}</b></td><td>{a.inv}</td><td>{a.users}</td><td>{a.outputs}</td>
              <td><span className="stars">{stars(a.rating)}</span> {a.rating}</td><td><Badge cls="green">{a.trend}</Badge></td>
              <td>{a.byBu.UK}</td><td>{a.byBu.DE}</td><td>{a.byBu.NL}</td><td>{a.byBu.NO}</td><td className="muted">{a.lastUsed}</td>
            </tr>
          ))}
          <tr><td><b>Total</b></td><td><b>{total}</b></td><td colSpan={9}></td></tr>
        </tbody>
      </table>
      <h3 className="mt">Adoption by agent</h3>
      {AGENT_USAGE.map((a) => (
        <div key={a.n} className="mb"><div className="flex between"><span>{a.n}</span><span className="muted">{a.inv}</span></div><div className="bar"><i style={{ width: `${(a.inv / maxInv) * 100}%` }} /></div></div>
      ))}
      <div className="row mt">
        <div className="card" style={{ flex: 1 }}>
          <h3>Usage by country — Nordics</h3>
          {Object.entries(countryTotals).map(([c, v]) => <div key={c} className="mb"><div className="flex between"><span>{c}</span><span className="muted">{v}</span></div><div className="bar"><i style={{ width: `${(v / Math.max(...Object.values(countryTotals))) * 100}%` }} /></div></div>)}
          <div className="legend mt6">Country is recorded on every invocation; it only splits out for Nordics, the one BU that is divided.</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Usage by role</h3>
          {Object.entries(roleTotals).sort((a, b) => b[1] - a[1]).map(([r, v]) => (
            <div key={r} className="mb"><div className="flex between"><span>{r}</span><span className="muted">{v}</span></div><div className="bar"><i style={{ width: `${(v / Math.max(...Object.values(roleTotals))) * 100}%` }} /></div></div>
          ))}
        </div>
      </div>
      <h3 className="mt">Feedback</h3>
      {AGENT_USAGE.map((a) => <div key={a.n} className="card mb"><b>{a.n}</b> <span className="stars">{stars(a.rating)}</span><div className="legend mt6">“{a.fb}”</div></div>)}
      <div className="legend mt">AgentUsageMetrics holds agent ID, invocation count, user, BU/country, timestamp, rating and feedback.</div>
    </>
  );
}

function Governance() {
  return (
    <>
      <table>
        <tbody>
          <tr><td className="muted">Owner</td><td>Factory Agentic Lead</td></tr>
          <tr><td className="muted">Versioning</td><td>Prompt and configuration are versioned; each version carries a config snapshot and an eval status</td></tr>
          <tr><td className="muted">Eval before publish</td><td>An agent cannot move to Published until its eval passes</td></tr>
          <tr><td className="muted">Visibility</td><td>Only Published agents are visible to sellers</td></tr>
          <tr><td className="muted">Grounding</td><td>Always row-level-security scoped to the invoking user</td></tr>
        </tbody>
      </table>
      <h3 className="mt">Agent versions</h3>
      <table>
        <thead><tr><th>Agent</th><th>Version</th><th>Type</th><th>Eval</th><th>Status</th></tr></thead>
        <tbody>
          {AGENTS.map((a) => (
            <tr key={a.n}><td><b>{a.n}</b></td><td>{a.ver}</td><td>{a.type}</td>
              <td><Badge cls={a.status === "Published" ? "green" : "amber"}>{a.status === "Published" ? "Passed" : "In test"}</Badge></td>
              <td><Badge cls={a.status === "Published" ? "green" : "amber"}>{a.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt">Every agent output is AI-generated and must be reviewed by a human before client-facing use.</div>
    </>
  );
}

"use client";
import React, { useState } from "react";
import {
  AGENT_USAGE, BUS, CAMPAIGNS, ENGINES, INTERACTIONS, KPI, PROSPECTS, ACCOUNTS, OPPS, CAMPAIGNS as CAMPS,
} from "@/lib/data";
import { can, inScope, kpiFor, pctColor, scopeLabel, stars, useApp } from "@/lib/state";
import { Badge, Kpi, Ring, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import CampaignDrawer from "@/components/drawers/CampaignDrawer";
import ProspectDrawer from "@/components/drawers/ProspectDrawer";
import InteractionDrawer from "@/components/drawers/InteractionDrawer";

const TABS = ["BU leader scorecard", "SBU exec roll-up", "Seller personal view", "Campaign & Radar performance", "Campaign health", "Agent adoption"];

export default function Dashboard() {
  const { scope, setScope, pview, subview, setSub } = useApp();
  const tab = subview["dashboard"] || TABS[0];
  const setTab = (t: string) => setSub("dashboard", t);
  const k = kpiFor(scope);

  return (
    <div className="wrap">
      <h2 className="page">{scopeLabel(scope)} — Factory performance</h2>
      <p className="sub">Shared KPI definitions · actuals against quarterly objectives · refreshed daily</p>
      <Tabs tabs={pview === "Seller" ? [TABS[2]] : TABS} active={tab} onChange={setTab} />
      {tab === "BU leader scorecard" && <BuScorecard k={k} scope={scope} />}
      {tab === "SBU exec roll-up" && <SbuRollup setScope={setScope} />}
      {tab === "Seller personal view" && <SellerView />}
      {tab === "Campaign & Radar performance" && <CampaignPerf />}
      {tab === "Campaign health" && <CampaignHealth />}
      {tab === "Agent adoption" && <AgentAdoption />}
    </div>
  );
}

function BuScorecard({ k, scope }: { k: ReturnType<typeof kpiFor>; scope: { bu: string; country: string } }) {
  const pipelinePct = (k.pipeline / k.pTarget) * 100;
  const revenuePct = (k.revenue / k.rTarget) * 100;
  const coveragePct = (k.coverage / k.cTarget) * 100;
  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        <Kpi lab="Qualified pipeline (€M)" val={`€${k.pipeline.toFixed(1)}M`} meta={`Target €${k.pTarget.toFixed(1)}M · ${pipelinePct.toFixed(0)}%`} />
        <Kpi lab="Revenue booked (€M)" val={`€${k.revenue.toFixed(1)}M`} meta={`Target €${k.rTarget.toFixed(1)}M · ${revenuePct.toFixed(0)}%`} />
        <Kpi lab="Coverage (%)" val={`${k.coverage.toFixed(0)}%`} meta={`Target ${k.cTarget.toFixed(0)}%`} />
        <Kpi lab="% Industrialized (%)" val={`${k.reuse.toFixed(0)}%`} meta="Reuse of certified assets" />
        <Kpi lab="Outreach activities" val={k.outreach} />
        <Kpi lab="Meetings secured" val={k.meetings} />
        <Kpi lab="Opportunities created" val={k.oppsCreated} />
        <Kpi lab="Campaign stage conversion (%)" val={`${k.stageConv.toFixed(0)}%`} />
        <Kpi lab="Signal → opportunity conversion (%)" val={`${k.conv.toFixed(0)}%`} />
        <Kpi lab="Agent adoption" val="61" meta="distinct users" />
      </div>
      <div className="row mt">
        <div className="card flex" style={{ gap: 20 }}>
          <Ring pct={pipelinePct} color={pctColor(pipelinePct)} />
          <Ring pct={revenuePct} color={pctColor(revenuePct)} />
          <Ring pct={coveragePct} color={pctColor(coveragePct)} />
          <div className="legend">Pipeline / Revenue / Coverage attainment vs quarterly target.</div>
        </div>
      </div>
      <div className="flex mt wrapf">
        <button className="btn ghost sm">Export PDF</button>
        <button className="btn ghost sm">Export Excel</button>
        <button className="btn gray sm">Weekly BU digest</button>
        <button className="btn gray sm">Quarterly plan pack</button>
      </div>
      {scope.bu === "NO" && <div className="note mt">Country split. Use Country selector to drill into Sweden, Finland, Norway or Denmark.</div>}
    </>
  );
}

function SbuRollup({ setScope }: { setScope: (s: { bu: string; country: string }) => void }) {
  const maxPipe = Math.max(...BUS.map((b) => KPI[b.code].pipeline));
  return (
    <>
      <table>
        <thead><tr><th>Business Unit</th><th>Pipeline (€M)</th><th>vs target</th><th>Revenue (€M)</th><th>Coverage (%)</th><th>% Industrialized</th><th>Outreach</th><th>Meetings</th><th>Opps created</th><th>Signals</th></tr></thead>
        <tbody>
          {BUS.map((b) => {
            const k = KPI[b.code];
            return (
              <tr key={b.code} className="clk" onClick={() => setScope({ bu: b.code, country: "all" })}>
                <td>{b.name}</td><td>€{k.pipeline.toFixed(1)}M</td><td>{((k.pipeline / k.pTarget) * 100).toFixed(0)}%</td>
                <td>€{k.revenue.toFixed(1)}M</td><td>{k.coverage.toFixed(0)}%</td><td>{k.reuse.toFixed(0)}%</td>
                <td>{k.outreach}</td><td>{k.meetings}</td><td>{k.oppsCreated}</td><td>{k.signals}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="card mt">
        <h3>Qualified pipeline by BU</h3>
        {BUS.map((b) => (
          <div key={b.code} className="mb">
            <div className="flex between"><span>{b.name}</span><span className="muted">€{KPI[b.code].pipeline.toFixed(1)}M</span></div>
            <div className="bar"><i style={{ width: `${(KPI[b.code].pipeline / maxPipe) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </>
  );
}

function SellerView() {
  const drawer = useDrawer();
  const me = ACCOUNTS[0]?.owner || "R. Patel";
  const myProspects = PROSPECTS.filter((p) => p.own === me);
  const myAccounts = ACCOUNTS.filter((a) => a.owner === me);
  const myOpps = OPPS.filter((o) => o.own === me && o.status === "Open");
  const myCampaigns = CAMPS.filter((c) => c.owner === me);
  const nextActions = INTERACTIONS.filter((i) => i.status === "Open" && PROSPECTS.find((p) => p.id === i.pid)?.own === me);

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        <Kpi lab="My prospects" val={myProspects.length} meta={`${myProspects.filter((p) => p.st >= 4).length} qualified/converted`} />
        <Kpi lab="My accounts" val={myAccounts.length} meta={`${myAccounts.filter((a) => a.tier === 1).length} tier 1`} />
        <Kpi lab="My pipeline" val={`€${myOpps.reduce((a, o) => a + o.val, 0).toFixed(1)}M`} />
        <Kpi lab="My campaigns" val={myCampaigns.length} meta={`${myCampaigns.filter((c) => c.status === "Active").length} active`} />
        <Kpi lab="Signals on my accounts" val="3" meta="1 unreviewed" />
      </div>
      <h3 className="mt">Next actions due</h3>
      <table>
        <thead><tr><th>Prospect</th><th>Next action</th><th>Due</th><th>Status</th></tr></thead>
        <tbody>
          {nextActions.map((i, idx) => {
            const p = PROSPECTS.find((pp) => pp.id === i.pid)!;
            return (
              <tr key={idx} className="clk" onClick={() => drawer.open(p.n, <Badge cls="gray">{p.id}</Badge>, <ProspectDrawer p={p} />)}>
                <td>{p.n}</td><td>{i.next}</td><td>{i.due}</td><td><Badge cls={i.status === "Open" ? "amber" : "green"}>{i.status}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3 className="mt">My accounts</h3>
      <table>
        <thead><tr><th>Account</th><th>Sector</th><th>Source</th><th>Open pipeline</th><th>Top signal score</th></tr></thead>
        <tbody>{myAccounts.map((a) => <tr key={a.n}><td>{a.n}</td><td>{a.sector}</td><td className="muted">{a.src}</td><td>€{OPPS.filter((o) => o.acct === a.n).reduce((s, o) => s + o.val, 0).toFixed(1)}M</td><td>—</td></tr>)}</tbody>
      </table>
      <div className="flex mt wrapf">
        <button className="btn sm" onClick={() => drawer.open("Log an interaction", <Badge cls="blue">ProspectInteraction</Badge>, <InteractionDrawer />)}>Log interaction</button>
      </div>
    </>
  );
}

function CampaignPerf() {
  const drawer = useDrawer();
  return (
    <>
      <h3>Campaign performance</h3>
      <table>
        <thead><tr><th>Campaign</th><th>Status</th><th>Reached</th><th>Outreach</th><th>Meetings</th><th>Pipeline (€M)</th><th>Opps</th><th>Wins (€M)</th></tr></thead>
        <tbody>
          {CAMPS.map((c) => (
            <tr key={c.n} className="clk" onClick={() => drawer.open(c.n, <Badge cls="blue">{c.status}</Badge>, <CampaignDrawer c={c} />)}>
              <td>{c.n} <div className="legend">{c.sol}</div></td>
              <td><Badge cls="blue">{c.status}</Badge></td>
              <td>{c.m.reached}/{c.accts}</td><td>{c.m.outreach}</td><td>{c.m.meetings}</td>
              <td>€{c.m.pipe.toFixed(1)}M</td><td>{c.m.oppsGen}</td><td>€{c.m.wins.toFixed(1)}M</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="mt">Radar engine performance</h3>
      <table>
        <thead><tr><th>Engine</th><th>BU</th><th>Client set</th><th>Rules</th><th>Schedule</th><th>Signals (30d)</th><th>Unreviewed</th></tr></thead>
        <tbody>{ENGINES.map((e) => <tr key={e.n}><td>{e.n}</td><td>{e.bu}</td><td>{e.clients}</td><td>{e.rules}</td><td>{e.sched}</td><td>{e.signals}</td><td>2</td></tr>)}</tbody>
      </table>
    </>
  );
}

function CampaignHealth() {
  const stalled = CAMPS.filter((c) => c.m.reached > 0 && c.m.meetings / c.m.reached < 1.2);
  const targetAccts = CAMPS.reduce((s, c) => s + c.accts, 0);
  const reached = CAMPS.reduce((s, c) => s + c.m.reached, 0);
  const outreach = CAMPS.reduce((s, c) => s + c.m.outreach, 0);
  const meetings = CAMPS.reduce((s, c) => s + c.m.meetings, 0);
  const opps = CAMPS.reduce((s, c) => s + c.m.oppsGen, 0);
  const steps = [
    ["Target accounts", targetAccts], ["Reached", reached], ["Outreach activities", outreach],
    ["Meetings secured", meetings], ["Opportunities created", opps],
  ] as [string, number][];
  return (
    <>
      <h3>Funnel</h3>
      {steps.map(([label, val], i) => (
        <div key={label} className="mb">
          <div className="flex between"><span>{label}</span><span className="muted">{val}{i > 0 && steps[i - 1][1] ? ` · ${((val / steps[i - 1][1]) * 100).toFixed(0)}%` : ""}</span></div>
          <div className="bar"><i style={{ width: `${steps[0][1] ? (val / steps[0][1]) * 100 : 0}%` }} /></div>
        </div>
      ))}
      <h3 className="mt">Campaigns needing attention</h3>
      {stalled.length ? stalled.map((c) => (
        <div key={c.n} className="card mb"><b>{c.n}</b><div className="legend">{c.m.reached} accounts reached vs {c.m.meetings} meetings secured</div></div>
      )) : <div className="muted">None — all campaigns tracking to plan.</div>}
      <h3 className="mt">Status mix</h3>
      <div className="flex wrapf">
        {["Draft", "Planned", "Approved", "Active", "Paused", "Closed", "Review"].map((s) => (
          <span key={s} className="chip">{s}: {CAMPS.filter((c) => c.status === s).length}</span>
        ))}
      </div>
      <div className="legend mt6">{CAMPS.filter((c) => c.signalDriven).length} signal-driven campaigns.</div>
    </>
  );
}

function AgentAdoption() {
  const totalInv = AGENT_USAGE.reduce((s, a) => s + a.inv, 0);
  const totalUsers = new Set(AGENT_USAGE.flatMap((a) => Object.keys(a.byRole))).size;
  const totalOutputs = AGENT_USAGE.reduce((s, a) => s + a.outputs, 0);
  const avgRating = AGENT_USAGE.reduce((s, a) => s + a.rating, 0) / AGENT_USAGE.length;
  const maxInv = Math.max(...AGENT_USAGE.map((a) => a.inv));
  const countryTotals: Record<string, number> = { Sweden: 0, Finland: 0, Norway: 0, Denmark: 0 };
  AGENT_USAGE.forEach((a) => Object.entries(a.byCountry).forEach(([c, v]) => (countryTotals[c] += v)));
  const roleTotals: Record<string, number> = {};
  AGENT_USAGE.forEach((a) => Object.entries(a.byRole).forEach(([r, v]) => (roleTotals[r] = (roleTotals[r] || 0) + v)));
  const sortedRoles = Object.entries(roleTotals).sort((a, b) => b[1] - a[1]);
  const maxCountry = Math.max(...Object.values(countryTotals));
  const maxRole = Math.max(...sortedRoles.map(([, v]) => v));

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi lab="Agent invocations" val={totalInv} meta="this quarter, all BUs" />
        <Kpi lab="Distinct users" val={totalUsers} />
        <Kpi lab="Outputs generated" val={totalOutputs} />
        <Kpi lab="Average rating" val={avgRating.toFixed(1)} meta={stars(avgRating)} />
      </div>
      <h3 className="mt">Most-used agents</h3>
      {AGENT_USAGE.slice().sort((a, b) => b.inv - a.inv).map((a) => (
        <div key={a.n} className="mb">
          <div className="flex between"><span>{a.n}</span><span className="muted">{a.inv} · {a.trend}</span></div>
          <div className="bar"><i style={{ width: `${(a.inv / maxInv) * 100}%` }} /></div>
        </div>
      ))}
      <div className="row mt">
        <div className="card" style={{ flex: 1 }}>
          <h3>Usage by country — Nordics</h3>
          {Object.entries(countryTotals).map(([c, v]) => (
            <div key={c} className="mb"><div className="flex between"><span>{c}</span><span className="muted">{v}</span></div><div className="bar"><i style={{ width: `${(v / maxCountry) * 100}%` }} /></div></div>
          ))}
          <div className="legend mt6">Country is recorded on every invocation; it only splits out for Nordics.</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Usage by role</h3>
          {sortedRoles.map(([r, v]) => (
            <div key={r} className="mb"><div className="flex between"><span>{r}</span><span className="muted">{v}</span></div><div className="bar"><i style={{ width: `${(v / maxRole) * 100}%` }} /></div></div>
          ))}
        </div>
      </div>
      <h3 className="mt">Feedback</h3>
      {AGENT_USAGE.slice(0, 4).map((a) => (
        <div key={a.n} className="card mb"><b>{a.n}</b> <span className="stars">{stars(a.rating)}</span><div className="legend mt6">“{a.fb}”</div></div>
      ))}
    </>
  );
}

"use client";
import React, { useState } from "react";
import {
  AGENTS, AGENT_USAGE, BUS, CAMPAIGNS, ENGINES, INTERACTIONS, KPI, KPI_COUNTRY, PARTNER_PLAYS, PROSPECTS, ACCOUNTS, OPPS, SIGNALS, CAMPAIGNS as CAMPS,
} from "@/lib/data";
import { can, inScope, kpiFor, pctColor, scopeLabel, stars, useApp } from "@/lib/state";
import { Badge, Kpi, Ring } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import CampaignDrawer from "@/components/drawers/CampaignDrawer";
import ProspectDrawer from "@/components/drawers/ProspectDrawer";
import InteractionDrawer from "@/components/drawers/InteractionDrawer";

const TABS = ["BU leader scorecard", "SBU exec roll-up", "Seller personal view", "Campaign & Radar performance", "Campaign health", "Agent adoption"];

export default function Dashboard() {
  const { scope, go } = useApp();
  const k = kpiFor(scope);

  return (
    <div className="wrap">
      <BuScorecard k={k} scope={scope} go={go} />
    </div>
  );
}

function BuScorecard({ k, scope, go }: { k: ReturnType<typeof kpiFor>; scope: { bu: string; country: string }; go: (id: string, sub?: string) => void }) {
  const pipelinePct = (k.pipeline / k.pTarget) * 100;
  const bookingsPct = (k.revenue / k.rTarget) * 100;
  const coveragePct = (k.coverage / k.cTarget) * 100;
  const agentSummary = AGENTS.reduce((summary, agent) => {
    if (!summary.names.has(agent.n)) {
      summary.names.add(agent.n);
      summary.launches += agent.launches ?? 0;
    }
    return summary;
  }, { names: new Set<string>(), launches: 0 });
  const countryNames: Record<string, string> = { NL: "Netherlands", DE: "Germany", UK: "United Kingdom", SE: "Sweden", FI: "Finland", NO: "Norway", DK: "Denmark" };
  const countryCodes = scope.bu === "all"
    ? Object.keys(countryNames)
    : scope.bu === "NO" && scope.country === "all"
      ? ["SE", "FI", "NO", "DK"]
      : [scope.country === "all" ? scope.bu : Object.entries(countryNames).find(([, name]) => name === scope.country)?.[0] ?? scope.bu];
  const countryKpi = (code: string) => code === "NL" || code === "DE" || code === "UK"
    ? KPI[code]
    : KPI_COUNTRY[countryNames[code]];
  const byCountry = countryCodes.map((code) => ({ name: countryNames[code], value: countryKpi(code).revenue }));
  const scopedCampaigns = CAMPAIGNS.filter((campaign) => countryCodes.includes(campaign.country ? Object.entries(countryNames).find(([, name]) => name === campaign.country)?.[0] ?? campaign.bu : campaign.bu));
  const scopedPartners = PARTNER_PLAYS.filter((play) => play.countries.some((country) => countryCodes.includes(country)) && play.status === "Active");
  const scopedSignals = SIGNALS.filter((signal) => countryCodes.includes(signal.country ? Object.entries(countryNames).find(([, name]) => name === signal.country)?.[0] ?? signal.bu : signal.bu));
  const maxCountry = Math.max(...byCountry.map((x) => x.value));

  return (
    <>
      <div className="flex between wrapf mb" style={{ alignItems: "flex-end" }}>
        <div>
          <h2 className="page" style={{ marginBottom: 2 }}>{scopeLabel(scope)} — Mid-Market Factory snapshot</h2>
          <p className="sub" style={{ margin: 0 }}>Leadership view · actuals vs quarterly targets · every tile drills into its module</p>
        </div>
        <div className="legend">Figures illustrative · As of 15 Sep 2026</div>
      </div>

      <div className="dashgrid">
        <div className="tile wide" style={{ gridColumn: "span 7" }} onClick={() => go("pipeline", "Prospect pipeline")}>
          <div className="drill">Open Pipeline Explorer →</div>
          <div className="th"><div className="ti" style={{ background: "var(--primary)" }}>👥</div><div className="tt">Clients</div></div>
          <div className="metricrow">
            <div><div className="big">~{k.clients ?? Math.round((k.pipeline + k.revenue) * 4)}</div><div className="lab">Total mid-market clients</div></div>
            <div><div className="big">{k.targetAccounts ?? k.oppsCreated}</div><div className="lab">Target accounts</div></div>
            <div><div className="big">{k.activeAccounts ?? k.meetings}</div><div className="lab">Targeted / active accounts</div></div>
            <div><div className="big">{k.meetings}</div><div className="lab">Client meetings generated</div></div>
          </div>
          <div className="att"><span className="badge b-blue">Coverage {Math.round(k.coverage)}%</span> vs target {Math.round(k.cTarget)}% · {k.qualifiedLeads} qualified leads this quarter</div>
        </div>

        <div className="tile" style={{ gridColumn: "span 5" }} onClick={() => go("pipeline", "Master list")}>
          <div className="drill">Open prospect pipeline →</div>
          <div className="th"><div className="ti" style={{ background: "var(--navy2)" }}>🧭</div><div className="tt">Pipeline & Opportunity Explorer</div></div>
          <div className="flex between">
            <div>
              <div className="big">€{k.revenue.toFixed(1)}M</div>
              <div className="lab">Bookings influenced</div>
              <div className="mt6"><span className="muted" style={{ fontSize: 12 }}>Qualified pipeline <b>€{k.pipeline.toFixed(1)}M</b></span></div>
            </div>
            <Ring pct={bookingsPct} color={pctColor(bookingsPct)} />
          </div>
          <div className="att">Target €{k.rTarget.toFixed(1)}M bookings · €{k.pTarget.toFixed(1)}M pipeline</div>
        </div>

        <div className="tile" style={{ gridColumn: "span 4" }} onClick={() => go("campaigns", "Calendar")}>
          <div className="drill">Open →</div>
          <div className="th"><div className="ti" style={{ background: "var(--teal)" }}>📣</div><div className="tt">Campaigns</div></div>
          <div className="big">{k.campaigns}</div>
          <div className="lab"># Active campaigns</div>
          <div className="att">{scopedCampaigns.length} total in scope · campaign calendar & builder available</div>
        </div>

        <div className="tile" style={{ gridColumn: "span 4" }} onClick={() => go("solutions", "Partner Plays")}>
          <div className="drill">Open →</div>
          <div className="th"><div className="ti" style={{ background: "var(--amber)" }}>🤝</div><div className="tt">Partner Plays</div></div>
          <div className="big">{scopedPartners.length}</div>
          <div className="lab"># Active partner plays</div>
          <div className="att">€{scopedPartners.reduce((sum, play) => sum + play.pipe, 0).toFixed(1)}M partner-influenced pipeline</div>
        </div>

        <div className="tile" style={{ gridColumn: "span 4" }} onClick={() => go("solutions", "Assets by Business Line")}>
          <div className="drill">Open →</div>
          <div className="th"><div className="ti" style={{ background: "var(--primary)" }}>💡</div><div className="tt">Solutions & Assets</div></div>
          <div className="big">{k.assets ?? Math.max(12, Math.round(k.reuse))}</div>
          <div className="lab"># Key assets across Business Lines</div>
          <div className="att">{Math.round(k.reuse)}% industrialized (reuse of certified assets)</div>
        </div>

        <div className="tile" style={{ gridColumn: "span 6" }} onClick={() => go("radar", "Signal radar")}>
          <div className="drill">Open →</div>
          <div className="th"><div className="ti" style={{ background: "var(--primary-d)" }}>📡</div><div className="tt">Triggers Radar</div></div>
          <div className="flex between">
            <div><div className="big">{k.signals}</div><div className="lab"># Market triggers covered this quarter</div></div>
            <div style={{ textAlign: "right" }}>
              <div><span className="badge b-red">{scopedSignals.filter((signal) => signal.rel === "Critical").length} critical</span></div>
              <div className="mt6"><span className="badge b-amber">{scopedSignals.filter((signal) => signal.rel === "High").length} high</span></div>
            </div>
          </div>
          <div className="att">7 vertical trigger categories · {k.signals} open signals awaiting action</div>
        </div>

        <div className="tile" style={{ gridColumn: "span 6" }} onClick={() => go("agents", "Registry")}>
          <div className="drill">Open launchpad →</div>
          <div className="th"><div className="ti" style={{ background: "var(--pink)" }}>🤖</div><div className="tt">Smart Agents</div></div>
          <div className="flex between">
            <div><div className="big">{agentSummary.names.size}</div><div className="lab"># agents on the launchpad</div></div>
            <div style={{ textAlign: "right" }}>
              <div className="big" style={{ fontSize: 22 }}>{agentSummary.launches}</div>
              <div className="lab">launches this quarter</div>
            </div>
          </div>
          <div className="att">Lifecycle stages in place · outputs are generated from the same account and signal context</div>
        </div>
      </div>

      <div className="row mt">
        <div className="card" style={{ flex: 1, minWidth: 330 }}>
          <h3>Bookings influenced by country (€M)</h3>
          {byCountry.map((item) => (
            <div key={item.name} className="mb">
              <div className="flex between" style={{ fontSize: 12.5 }}>
                <span>{item.name}</span>
                <span className="muted">€{item.value.toFixed(1)}M</span>
              </div>
              <div className="bar"><i style={{ width: `${(item.value / maxCountry) * 100}%` }} /></div>
            </div>
          ))}
          <div className="legend mt">Country is the primary grain; BU and SBU are roll-ups.</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 290 }}>
          <h3>Attainment vs quarterly target</h3>
          {([
            ["Bookings influenced", bookingsPct],
            ["Qualified pipeline", pipelinePct],
            ["Coverage", coveragePct],
          ] as [string, number][]).map(([label, value]) => (
            <div key={label} className="mb">
              <div className="flex between" style={{ fontSize: 12.5 }}>
                <span>{label}</span>
                <span className="muted">{Math.round(value)}%</span>
              </div>
              <div className="bar"><i style={{ width: `${Math.min(100, value)}%`, background: pctColor(value) }} /></div>
            </div>
          ))}
          <div className="legend mt">MVP shows attainment only. Month-on-month and quarter-on-quarter trends are deferred until enough history exists.</div>
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
        <Kpi lab="My prospects" val={myProspects.length} meta={`${myProspects.filter((p) => p.st >= 5).length} qualified/converted`} />
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

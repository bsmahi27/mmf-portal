"use client";
import React, { useMemo, useState } from "react";
import { CAMPAIGNS, PROSPECTS, OPPS, PSTAGES, BATCHES } from "@/lib/data";
import { buName, inScope, useApp } from "@/lib/state";
import { Badge, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import ProspectDrawer from "@/components/drawers/ProspectDrawer";

const TABS = ["Prospect pipeline", "Target prospects intake", "Master list, integration & mapping"];

export default function Pipeline() {
  const { scope, subview, setSub } = useApp();
  const tab = subview["pipeline"] || TABS[0];
  const setTab = (t: string) => setSub("pipeline", t);
  const inScopeProspects = useMemo(() => PROSPECTS.filter((p) => inScope(scope, p)), [scope]);

  return (
    <div className="wrap">
      <h2 className="page">Pipeline Explorer</h2>
      <p className="sub">Factory-created prospect pipeline — searchable, filterable and editable up to the point of conversion into Thor</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "Prospect pipeline" && <ProspectPipeline prospects={inScopeProspects} />}
      {tab === "Target prospects intake" && <Intake scope={scope} />}
      {tab === "Master list, integration & mapping" && <MasterList scope={scope} />}
    </div>
  );
}

function ProspectPipeline({ prospects }: { prospects: typeof PROSPECTS }) {
  const drawer = useDrawer();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("All");
  const [year, setYear] = useState("All");
  const [quarter, setQuarter] = useState("All");
  const years = [...new Set(prospects.map((p) => p.sign.split("-")[1]).filter(Boolean))].sort();
  const filtered = prospects.filter((p) => {
    const matchesQ = !q || JSON.stringify(p).toLowerCase().includes(q.toLowerCase());
    const matchesStage = stage === "All" || PSTAGES[p.st] === stage;
    const [prospectQuarter, prospectYear] = p.sign.split("-");
    return matchesQ && matchesStage && (year === "All" || prospectYear === year) && (quarter === "All" || prospectQuarter === quarter);
  });

  return (
    <>
      <div className="card mb" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input className="t" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company, prospect ID, industry, seller or trigger" style={{ minWidth: 260, flex: 1 }} />
        <select className="t" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="All">Status: all</option>
          {PSTAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="t" value={year} onChange={(e) => setYear(e.target.value)}><option value="All">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select className="t" value={quarter} onChange={(e) => setQuarter(e.target.value)}><option value="All">All quarters</option>{["Q1", "Q2", "Q3", "Q4"].map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </div>

      <div className="kanban mb">
        {PSTAGES.map((s, i) => {
          const items = filtered.filter((p) => p.st === i);
          return (
            <div key={s} className="kcol">
              <h4>{s} ({items.length})</h4>
              {items.length ? items.map((p) => (
                <div key={p.id} className="kcard" onClick={() => drawer.open(p.n, <Badge cls="gray">{p.id}</Badge>, <ProspectDrawer p={p} />)}>
                  <b>{p.n}</b>
                  <div className="muted">{p.id}</div>
                  <span className="chip">€{p.tcv.toFixed(1)}M</span>
                  <span className="chip">{p.sign}</span>
                </div>
              )) : <div className="muted">—</div>}
            </div>
          );
        })}
      </div>

      <table>
        <thead><tr><th>Prospect ID</th><th>Company</th><th>Industry</th><th>TCV</th><th>Stage</th><th>Expected sign</th><th>Owner</th><th>Trigger</th><th>Campaign</th><th>BU</th></tr></thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="clk" onClick={() => drawer.open(p.n, <Badge cls="gray">{p.id}</Badge>, <ProspectDrawer p={p} />)}>
              <td style={{ fontFamily: "monospace" }}>{p.id}</td>
              <td><b>{p.n}</b></td>
              <td>{p.ind}</td>
              <td>€{p.tcv.toFixed(1)}M</td>
              <td><Badge cls={p.st === 6 ? "green" : p.st >= 5 ? "teal" : "gray"}>{PSTAGES[p.st]}</Badge></td>
              <td>{p.sign}</td>
              <td>{p.own}</td>
              <td className="muted">{p.src}</td>
              <td className="muted">{CAMPAIGNS.find((campaign) => campaign.bu === p.bu && campaign.status === "Active")?.n || "—"}</td>
              <td>{buName(p.bu)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Intake({ scope }: { scope: { bu: string; country: string } }) {
  return (
    <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h3>Single prospect form</h3>
        <div className="f2">
          <div><label className="fl">Company name</label><input className="t" placeholder="Enter company" /></div>
          <div><label className="fl">Business unit</label><select className="t" defaultValue={scope.bu === "all" ? "DE" : scope.bu}><option value="UK">UK</option><option value="DE">Germany</option><option value="NL">Netherlands</option><option value="NO">Nordics</option></select></div>
          <div><label className="fl">Country</label><select className="t"><option>—</option><option>Sweden</option><option>Finland</option><option>Norway</option><option>Denmark</option></select></div>
          <div><label className="fl">Industry</label><select className="t"><option>Manufacturing</option><option>Retail</option><option>CPG</option><option>Automotive</option><option>TMT</option><option>E&U</option><option>Transport</option><option>Financial Services</option><option>Life Sciences</option></select></div>
          <div><label className="fl">Owner</label><input className="t" placeholder="Seller / Client Partner" /></div>
          <div><label className="fl">Estimated TCV (€M)</label><input className="t" placeholder="0.0" /></div>
        </div>
        <div className="mt"><button className="btn sm">Create prospect</button></div>
      </div>

      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h3>Bulk upload</h3>
        <p className="muted">Upload multiple target accounts using a governed Excel template. Validation is staged before commit.</p>
        <div className="mt6"><button className="btn sm ghost">Download template</button></div>
        <div style={{ border: "2px dashed var(--line)", borderRadius: 10, padding: 18, textAlign: "center", marginTop: 12, color: "var(--mut)", fontSize: 12.5 }}>
          📄 Drop target_accounts.xlsx here
        </div>
        <div className="mt"><button className="btn sm">Validate & attach</button></div>
      </div>
    </div>
  );
}

function MasterList({ scope }: { scope: { bu: string; country: string } }) {
  const records = PROSPECTS.filter((p) => inScope(scope, p));
  return (
    <>
      <div className="card mb">
        <h3>Master list – one record across prospects and opportunities</h3>
        <div className="legend">One governed record, one lifecycle. Target list intake feeds the prospect master, which drives campaigns, radar and opportunity conversion.</div>
      </div>
      <table>
        <thead><tr><th>Prospect ID</th><th>Company</th><th>Industry</th><th>Owner</th><th>Expected sign</th><th>Campaign</th><th>Linked opportunity</th><th>BU</th></tr></thead>
        <tbody>
          {records.map((p) => (
            <tr key={p.id}>
              <td style={{ fontFamily: "monospace" }}>{p.id}</td>
              <td><b>{p.n}</b></td>
              <td>{p.ind}</td>
              <td>{p.own}</td>
              <td>{p.sign}</td>
              <td className="muted">{CAMPAIGNS.find((c) => c.bu === p.bu)?.n || "—"}</td>
              <td className="muted" style={{ fontFamily: "monospace" }}>{p.oppId || "—"}</td>
              <td>{buName(p.bu)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt">Connected outputs: Pipeline Explorer, Campaign management, Executive dashboards, Triggers Radar and Smart Agents.</div>
    </>
  );
}

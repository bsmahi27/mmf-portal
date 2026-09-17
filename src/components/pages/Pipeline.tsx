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
  const hasFilters = Boolean(q) || stage !== "All" || year !== "All" || quarter !== "All";

  return (
    <>
      <div className="card mb pipeline-filters">
        <input className="t pipeline-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="⌕ Search company, prospect ID, industry, seller or trigger…" />
        <select className="t" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="All">Status: all</option>
          {PSTAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="t" value={year} onChange={(e) => setYear(e.target.value)}><option value="All">Year: all</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select className="t" value={quarter} onChange={(e) => setQuarter(e.target.value)}><option value="All">Quarter: all</option>{["Q1", "Q2", "Q3", "Q4"].map((item) => <option key={item} value={item}>{item}</option>)}</select>
        {hasFilters && <button className="btn gray sm" onClick={() => { setQ(""); setStage("All"); setYear("All"); setQuarter("All"); }}>Clear filters</button>}
        <div className="legend pipeline-filter-help">Year and quarter filter on the expected signing period. Search runs across the prospect master; filters and search combine.</div>
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
  const [uploaded, setUploaded] = useState(false);
  return (
    <>
      <div className="card mb"><h3>Two intake paths, one master database</h3><p className="muted">Choose the simplest route based on volume. Both routes use the same mandatory fields and publish into one prospect master.</p></div>
      <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h3>① Quick form <Badge cls="blue">SINGLE ACCOUNT</Badge></h3>
        <p className="muted">Create or update one target account. Also available inline from Seller Input and Radar.</p>
        <div className="f2">
          <div><label className="fl">Company name *</label><input className="t" placeholder="Enter company" /></div>
          <div><label className="fl">Country *</label><select className="t"><option>Netherlands</option><option>Germany</option><option>United Kingdom</option><option>Sweden</option><option>Finland</option><option>Norway</option><option>Denmark</option></select></div>
          <div><label className="fl">Industry *</label><select className="t">{["Manufacturing", "Retail", "CPG", "Automotive", "TMT", "E&U", "Transport", "Financial Services", "Life Sciences"].map((item) => <option key={item}>{item}</option>)}</select></div>
          <div><label className="fl">Revenue band</label><select className="t"><option>€500M – €1B</option><option>€1B – €2B</option><option>€2B – €3B</option></select></div>
          <div><label className="fl">Business unit *</label><select className="t"><option>Netherlands</option><option>Germany</option><option>UK</option><option>Nordics</option></select></div>
          <div><label className="fl">Assigned seller *</label><input className="t" placeholder="Search seller" /></div>
          <div><label className="fl">Campaign / trigger</label><select className="t"><option>Select or enter</option>{CAMPAIGNS.map((campaign) => <option key={campaign.n}>{campaign.n}</option>)}</select></div>
          <div><label className="fl">Next action</label><input className="t" placeholder="Enter next step" /></div>
        </div>
        <div className="legend mt6">Prospect ID is auto-generated for new entries, for example <code>PRS-NL-00031</code>.</div>
        <div className="mt"><button className="btn ghost sm">Save draft</button> <button className="btn sm">Submit</button></div>
      </div>

      <div className="card" style={{ flex: 1, minWidth: 320 }}>
        <h3>② Excel upload <Badge cls="teal">BULK UPLOAD</Badge></h3>
        <p className="muted">Add or refresh multiple target accounts using the governed template.</p>
        <div style={{ border: "2px dashed var(--line)", borderRadius: 10, padding: 18, textAlign: "center", marginTop: 12, color: "var(--mut)", fontSize: 12.5 }}>
          📄 Drop <b>target_accounts.xlsx</b> here<br /><span className="legend">Prospect ID · Company name · Country · Industry · Business unit · Revenue band · Assigned seller · Campaign/trigger · Next action</span>
        </div>
        <div className="mt"><button className="btn ghost sm">↓ Download template</button> <button className="btn sm" onClick={() => setUploaded(true)}>Upload &amp; validate</button></div>
        {uploaded && <div className="output mt"><b>Validation complete</b>{"\n\n"}• 44 rows read{"\n"}• 38 accepted → staged as prospects (PRS-{scope.bu}-00031 … 00068){"\n"}• 4 duplicates matched to existing accounts{"\n"}• 2 rejected: missing industry code{"\n\n"}Nothing is committed until you approve the staged batch.</div>}
      </div>
      </div>
      <div className="card mt"><h3>Backend process — capture, validate, publish</h3><div className="flow"><div className="fs"><b>1 · Capture</b><span className="legend">Quick form or Excel upload</span></div><div className="fs"><b>2 · Validate &amp; match</b><span className="legend">Required fields · duplicate check · owner/BU mapping · value validation</span></div><div className="fs"><b>3 · Publish</b><span className="legend">One governed record in the prospect master, linked across the lifecycle</span></div></div></div>
      <div className="card mt"><h3>Recent uploads</h3><table><thead><tr><th>File</th><th>Country</th><th>Uploaded by</th><th>When</th><th>Rows</th><th>Accepted</th><th>Rejected</th><th>Status</th></tr></thead><tbody><tr><td>NL_target_list_H2.xlsx</td><td>Netherlands</td><td>S. de Vries</td><td>28 Jul 2026</td><td>62</td><td>58</td><td>4</td><td><Badge cls="green">Committed</Badge></td></tr><tr><td>DE_industrial_targets.xlsx</td><td>Germany</td><td>K. Weber</td><td>04 Aug 2026</td><td>81</td><td>74</td><td>7</td><td><Badge cls="green">Committed</Badge></td></tr><tr><td>UK_manufacturing_wave2.csv</td><td>United Kingdom</td><td>R. Patel</td><td>08 Aug 2026</td><td>44</td><td>—</td><td>—</td><td><Badge cls="amber">Staged — awaiting review</Badge></td></tr></tbody></table></div>
    </>
  );
}

function MasterList({ scope: _scope }: { scope: { bu: string; country: string } }) {
  return (
    <>
      <div className="card mb"><h3>Master list — one record across prospects and opportunities</h3><p className="muted">Target list intake (form or Excel) → pre-Thor stages 01–04 → Thor stages 05–07. One governed record, one lifecycle.</p><div className="cols">{[["IDENTITY", "Client ID · company · country · industry"], ["SEGMENTATION", "BU / MU · revenue band · market · sector"], ["OWNERSHIP", "Seller · account owner · contributors"], ["ENGAGEMENT", "Campaign · trigger · activities · outcomes"], ["THOR OPPORTUNITY", "Thor ID · stage · TCV / CV · CTT date"], ["GOVERNANCE", "Source · validation · history · data quality"]].map(([title, detail]) => <div className="card" style={{ background: "#f8fafc" }} key={title}><b style={{ color: "var(--primary)", fontSize: 11.5 }}>{title}</b><div className="legend mt6">{detail}</div></div>)}</div><div className="mt"><span className="legend">Master data controls: </span>{["Unique ID", "Duplicate matching", "Field validation", "Audit trail", "Daily refresh"].map((item) => <span className="chip" key={item}>{item}</span>)}</div><div className="mt"><span className="legend">Connected outputs: </span>{["Pipeline Explorer", "Campaign management", "Executive dashboards", "Triggers Radar", "Search & Smart Agents"].map((item) => <span className="chip" key={item}>{item}</span>)}</div></div>
      <div className="row mb"><div className="card" style={{ flex: 1, minWidth: 300 }}><h3>Option A — live Thor integration <Badge cls="green">PREFERRED</Badge></h3><div className="flow"><div className="fs"><b>Thor</b></div><div className="fs"><b>API / integration layer</b></div><div className="fs"><b>Pipeline Explorer</b></div></div><div className="mt6">{["Real-time visibility", "Latest opportunity updates", "No manual intervention", "Improved analytics accuracy"].map((item) => <span className="chip" key={item}>✓ {item}</span>)}</div></div><div className="card" style={{ flex: 1, minWidth: 300 }}><h3>Option B — daily automated refresh <Badge cls="amber">FALLBACK</Badge></h3><div className="flow"><div className="fs"><b>Thor</b></div><div className="fs"><b>Daily CSV</b></div><div className="fs"><b>Execution bot</b></div><div className="fs"><b>Backend storage</b></div></div><div className="mt6">{["Daily snapshots replace live feeds", "Consistent reporting despite intra-day change", "Structured extracts support bot integration"].map((item) => <span className="chip" key={item}>✓ {item}</span>)}</div></div></div>
      <div className="banner" style={{ background: "#eef4fa", borderColor: "#cde3f0", color: "#0b4a6f" }}>⚙️ <b>Open action:</b> technology team to validate Thor API availability and integration feasibility; fall back to the daily automated refresh if live integration is not viable — owners Sheethal Prasad / Vijay Kaulgud, due 29 Aug 2026.</div>
      <div className="card mt"><h3>Field mapping and nomenclature</h3><p className="muted">Resolve nomenclature differences between the portal, Thor and Salesforce.</p><table><thead><tr><th>Pipeline Explorer</th><th>Thor</th><th>Salesforce</th><th>Governed definition</th></tr></thead><tbody>{[["Client name", "Account name", "Account", "Client / account name"], ["Business unit", "BU", "Owning unit", "Business unit"], ["Sales stage", "Opportunity stage", "Stage", "Sales stage"], ["CTT sign date", "Sign date", "Target close date", "CTT sign date"], ["TCV & CV", "TCV / CV", "Value fields", "TCV & CV"], ["Offer", "Offering", "Product / offer", "Offer"]].map(([a, b, c, d]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td className="muted">{d}</td></tr>)}</tbody></table><div className="legend mt">Illustrative mapping structure; final names are confirmed against sample datasets before build.</div><div className="legend mt6">The portal consumes and displays only. It never writes back to Thor or Salesforce. Every view built on the daily extract shows its data date.</div></div>
    </>
  );
}

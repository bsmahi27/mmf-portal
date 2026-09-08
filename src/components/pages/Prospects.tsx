"use client";
import React, { useState } from "react";
import { ACCOUNTS, BATCHES, CAMPAIGNS, OPPS, PROSPECTS, PSOURCES, PSTAGES } from "@/lib/data";
import { buName, can, inScope, useApp } from "@/lib/state";
import { Badge, RoleBar, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import ProspectDrawer from "@/components/drawers/ProspectDrawer";
import OppDrawer from "@/components/drawers/OppDrawer";
import BatchDrawer from "@/components/drawers/BatchDrawer";

const TABS = ["Lifecycle", "All prospects", "Intake", "Upload batches", "Opportunities"];
const INDUSTRIES = ["Manufacturing", "Retail", "CPG", "Automotive", "TMT", "E&U", "Transport", "Financial Services", "Life Sciences"];

export default function Prospects() {
  const { scope, role, subview, setSub } = useApp();
  const tab = subview["prospects"] || TABS[0];
  const setTab = (t: string) => setSub("prospects", t);
  const rw = can(role, "Prospects", true);
  const inScopeProspects = PROSPECTS.filter((p) => inScope(scope, p));

  return (
    <div className="wrap">
      <h2 className="page">Prospect Management & Target Prospect Intake</h2>
      <p className="sub">The complete pre-opportunity lifecycle — target identification through research, outreach, meetings and qualification, before conversion into a Thor/Salesforce opportunity</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <RoleBar role={role} mod="Prospects" rw={rw} />
      {tab === "Lifecycle" && <Lifecycle prospects={inScopeProspects} />}
      {tab === "All prospects" && <AllProspects prospects={inScopeProspects} />}
      {tab === "Intake" && <Intake rw={rw} scope={scope} />}
      {tab === "Upload batches" && <UploadBatches scope={scope} />}
      {tab === "Opportunities" && <Opportunities scope={scope} rw={rw} />}
    </div>
  );
}

function Lifecycle({ prospects }: { prospects: typeof PROSPECTS }) {
  const drawer = useDrawer();
  return (
    <div className="kanban">
      {PSTAGES.map((stage, i) => {
        const items = prospects.filter((p) => p.st === i);
        return (
          <div key={stage} className="kcol">
            <h4>{stage} ({items.length})</h4>
            {items.length ? items.map((p) => (
              <div key={p.id} className="kcard" onClick={() => drawer.open(p.n, <Badge cls="gray">{p.id}</Badge>, <ProspectDrawer p={p} />)}>
                <b>{p.n}</b>
                <div className="muted">{p.id}</div>
                <span className="chip">€{p.tcv.toFixed(1)}M</span>
              </div>
            )) : <div className="muted">—</div>}
          </div>
        );
      })}
    </div>
  );
}

function AllProspects({ prospects }: { prospects: typeof PROSPECTS }) {
  const drawer = useDrawer();
  const [q, setQ] = useState("");
  const filtered = prospects.filter((p) => JSON.stringify(p).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <input className="t mb" placeholder="Search prospects…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
      <table>
        <thead><tr><th>Prospect ID</th><th>Company</th><th>Industry</th><th>Est. TCV</th><th>Lifecycle stage</th><th>Qualification</th><th>Owner</th><th>Source</th><th>Batch</th><th>BU</th><th>Opportunity</th></tr></thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="clk" onClick={() => drawer.open(p.n, <Badge cls="gray">{p.id}</Badge>, <ProspectDrawer p={p} />)}>
              <td className="muted" style={{ fontFamily: "monospace" }}>{p.id}</td>
              <td><b>{p.n}</b></td><td>{p.ind}</td><td>€{p.tcv.toFixed(1)}M</td>
              <td><Badge cls={p.st === 5 ? "green" : p.st >= 4 ? "teal" : "gray"}>{PSTAGES[p.st]}</Badge></td>
              <td>{p.qual}</td><td>{p.own}</td><td className="muted">{p.src}</td><td className="muted">{p.batch}</td>
              <td>{buName(p.bu)}{p.country ? ` · ${p.country}` : ""}</td>
              <td className="muted" style={{ fontFamily: "monospace" }}>{p.oppId || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt">Every portal-created prospect is an MM Factory prospect by default, so there is no MM Factory flag at prospect level. The classification is retained at opportunity level for reporting and attribution.</div>
    </>
  );
}

function Intake({ rw, scope }: { rw: boolean; scope: { bu: string; country: string } }) {
  const drawer = useDrawer();
  const [uploaded, setUploaded] = useState(false);
  const scopedCampaigns = CAMPAIGNS.filter((c) => inScope(scope, c));
  return (
    <div className="row">
      <div className="card" style={{ flex: 1, minWidth: 330 }}>
        <h3>① Single prospect form</h3>
        <p className="muted" style={{ fontSize: 12.5 }}>Creates one prospect and assigns a unique Prospect ID.</p>
        <div className="f2">
          <div><label className="fl">Company / account name</label><input className="t" placeholder="e.g. Yorkshire Precision Ltd" disabled={!rw} /></div>
          <div><label className="fl">Business Unit</label>
            <select className="t" defaultValue={scope.bu === "all" ? "DE" : scope.bu} disabled={!rw}>
              <option value="UK">UK</option><option value="DE">Germany</option><option value="NL">Netherlands</option><option value="NO">Nordics</option>
            </select>
          </div>
          <div><label className="fl">Country <span style={{ textTransform: "none", fontWeight: 400 }}>(Nordics only)</span></label>
            <select className="t" disabled={!rw}><option>—</option><option>Sweden</option><option>Finland</option><option>Norway</option><option>Denmark</option></select>
          </div>
          <div><label className="fl">Industry</label>
            <select className="t" disabled={!rw}>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select>
          </div>
          <div><label className="fl">Source</label>
            <select className="t" disabled={!rw}>{PSOURCES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <div><label className="fl">Owner</label><input className="t" placeholder="Seller / Client Partner" disabled={!rw} /></div>
          <div><label className="fl">Estimated TCV (€M)</label><input className="t" placeholder="0.0" disabled={!rw} /></div>
          <div><label className="fl">Expected sign</label><input className="t" placeholder="Q1-2027" disabled={!rw} /></div>
        </div>
        <label className="fl">Campaign association <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></label>
        <select className="t" disabled={!rw}>
          <option>— none —</option>
          {scopedCampaigns.map((c) => <option key={c.n}>{c.n}</option>)}
        </select>
        <div className="mt"><button className="btn sm" disabled={!rw} onClick={() => alert("Prototype — would create the prospect at stage Target Identified with the next Prospect ID, MM Factory by default.")}>Create prospect</button></div>
        <div className="legend mt">"Source" replaces the former "Trigger" field wherever it records where the prospect came from.</div>
      </div>

      <div className="card" style={{ flex: 1, minWidth: 330 }}>
        <h3>② Bulk upload — Excel template</h3>
        <p className="muted" style={{ fontSize: 12.5 }}>Upload prospects using the predefined template. Files and records are validated in the backend, and batch- and record-level Accepted / Rejected status is shown.</p>
        <div className="mt6"><button className="btn sm ghost">⬇ Download the approved template</button></div>
        <div style={{ border: "2px dashed var(--line)", borderRadius: 10, padding: 20, textAlign: "center", color: "var(--mut)", fontSize: 12.5, marginTop: 10 }}>
          📄 Drop <b>prospects_{scope.bu === "all" ? "XX" : scope.bu}.xlsx</b> here<br />
          <span className="legend">Template columns: company · BU · country (Nordics only) · industry · segment · owner · estimated TCV · source · campaign</span>
        </div>
        <div className="mt"><button className="btn sm" disabled={!rw} onClick={() => setUploaded(true)}>Validate file</button></div>
        {uploaded && (
          <div className="mt">
            <div className="output">
              <b>BATCH-0008 — validation complete</b>
              {"\n\n"}Batch status   Validated — awaiting commit{"\n"}
              Rows read      44{"\n"}
              Accepted       38{"\n"}
              Rejected        6{"\n\n"}
              Rejections carry an actionable reason per record. Nothing is committed until the batch is approved.
            </div>
            <div className="mt">
              <button className="btn sm">Approve &amp; commit batch</button>{" "}
              <button className="btn sm ghost" onClick={() => drawer.open(BATCHES[0].file, <Badge cls={BATCHES[0].status === "Committed" ? "green" : "amber"}>{BATCHES[0].status}</Badge>, <BatchDrawer b={BATCHES[0]} />)}>View record detail</button>{" "}
              <button className="btn sm gray">⬇ Download rejects</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadBatches({ scope }: { scope: { bu: string; country: string } }) {
  const drawer = useDrawer();
  const batches = BATCHES.filter((b) => inScope(scope, b));
  return (
    <table>
      <thead><tr><th>Batch</th><th>File</th><th>BU</th><th>Uploaded by</th><th>When</th><th>Rows</th><th>Accepted</th><th>Rejected</th><th>Status</th></tr></thead>
      <tbody>
        {batches.map((b) => (
          <tr key={b.id} className="clk" onClick={() => drawer.open(b.file, <Badge cls={b.status === "Committed" ? "green" : "amber"}>{b.status}</Badge>, <BatchDrawer b={b} />)}>
            <td style={{ fontFamily: "monospace" }}>{b.id}</td><td><b>{b.file}</b></td><td>{buName(b.bu)}</td><td>{b.by}</td><td>{b.when}</td>
            <td>{b.rows}</td><td><Badge cls="green">{b.ok}</Badge></td><td><Badge cls={b.bad > 0 ? "red" : "gray"}>{b.bad}</Badge></td>
            <td><Badge cls={b.status === "Committed" ? "green" : "amber"}>{b.status}</Badge></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Opportunities({ scope, rw }: { scope: { bu: string; country: string }; rw: boolean }) {
  const drawer = useDrawer();
  const [flags, setFlags] = useState<Record<string, boolean>>(Object.fromEntries(OPPS.map((o) => [o.id, o.mm])));
  const opps = OPPS.filter((o) => inScope(scope, o));
  return (
    <>
      <div className="mb"><button className="btn ghost sm">⟳ Sync from Salesforce</button></div>
      <table>
        <thead><tr><th>crmId</th><th>Opportunity</th><th>Account</th><th>Value</th><th>Stage</th><th>Owner</th><th>Close date</th><th>From prospect</th><th>Status</th><th>MM Factory</th></tr></thead>
        <tbody>
          {opps.map((o) => (
            <tr key={o.id}>
              <td className="clk" style={{ fontFamily: "monospace", fontSize: 10.5, cursor: "pointer" }} onClick={() => drawer.open(o.n, <Badge cls="blue">{o.stage}</Badge>, <OppDrawer o={o} />)}>{o.id}</td>
              <td className="clk" style={{ cursor: "pointer" }} onClick={() => drawer.open(o.n, <Badge cls="blue">{o.stage}</Badge>, <OppDrawer o={o} />)}><b>{o.n}</b></td>
              <td>{o.acct}</td><td>€{o.val.toFixed(1)}M</td><td>{o.stage}</td><td>{o.own}</td><td>{o.close}</td>
              <td className="muted" style={{ fontFamily: "monospace" }}>{o.pid || "—"}</td>
              <td><Badge cls={o.status === "Won" ? "green" : "gray"}>{o.status}</Badge></td>
              <td><button className={`btn sm ${flags[o.id] ? "gray" : ""}`} disabled={!rw} onClick={() => setFlags((f) => ({ ...f, [o.id]: !f[o.id] }))}>{flags[o.id] ? "✓ Classified" : "Classify"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt">Salesforce sync via REST with SystemModstamp watermark at daily cadence; Bulk API for initial load. MM Factory classification is portal-side only, no write-back.</div>
    </>
  );
}

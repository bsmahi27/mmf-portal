"use client";
import React, { useState } from "react";
import { CAMPAIGNS, INTERACTIONS, OPPS, PSTAGES, SIGNALS } from "@/lib/data";
import type { Prospect } from "@/lib/types";
import { buName, can, useApp } from "@/lib/state";
import { useDrawer } from "@/lib/drawer";
import { Badge } from "../ui";
import InteractionDrawer from "./InteractionDrawer";
import OppDrawer from "./OppDrawer";

export default function ProspectDrawer({ p }: { p: Prospect }) {
  const { role } = useApp();
  const drawer = useDrawer();
  const rw = can(role, "Prospects", true);
  const interactions = INTERACTIONS.filter((i) => i.pid === p.id);
  const signals = SIGNALS.filter((s) => s.acct === p.n);
  const campaigns = CAMPAIGNS.filter((c) => c.sol && signals.some((s) => s.engine === c.engine)).slice(0, 2);
  const linkedOpp = p.oppId ? OPPS.find((o) => o.id === p.oppId) : undefined;
  const eligibleOpps = OPPS.filter((o) => !o.pid);
  const [stage, setStage] = useState(PSTAGES[p.st]);

  return (
    <div>
      <div className="flex wrapf mb">
        <span className="badge b-gray">{p.id}</span>
        <Badge cls={p.st === 5 ? "green" : p.st >= 4 ? "teal" : "gray"}>{PSTAGES[p.st]}</Badge>
        <span className="muted">{buName(p.bu)}{p.country ? ` · ${p.country}` : ""}</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi"><div className="lab">Estimated TCV</div><div className="val">€{p.tcv.toFixed(1)}M</div></div>
        <div className="kpi"><div className="lab">Expected sign</div><div className="val">{p.sign}</div></div>
        <div className="kpi"><div className="lab">Qualification</div><div className="val" style={{ fontSize: 16 }}>{p.qual}</div></div>
      </div>

      <h3 className="mt">Prospect record</h3>
      <div className="f2">
        <div><label className="fl">Prospect ID <span className="lock">system</span></label><input className="t" defaultValue={p.id} disabled /></div>
        <div><label className="fl">Company</label><input className="t" defaultValue={p.n} disabled={!rw} /></div>
        <div><label className="fl">Industry</label><input className="t" defaultValue={p.ind} disabled={!rw} /></div>
        <div><label className="fl">Est. TCV (€M)</label><input className="t" defaultValue={p.tcv} disabled={!rw} /></div>
        <div><label className="fl">Owner</label><input className="t" defaultValue={p.own} disabled={!rw} /></div>
        <div><label className="fl">Expected sign</label><input className="t" defaultValue={p.sign} disabled={!rw} /></div>
        <div><label className="fl">Source <span className="lock">system</span></label><input className="t" defaultValue={p.src} disabled /></div>
        <div><label className="fl">Upload batch <span className="lock">system</span></label><input className="t" defaultValue={p.batch} disabled /></div>
        <div><label className="fl">Business Unit <span className="lock">system</span></label><input className="t" defaultValue={buName(p.bu)} disabled /></div>
        <div>
          <label className="fl">Lifecycle stage</label>
          <select className="t" value={stage} onChange={(e) => setStage(e.target.value)} disabled={!rw}>
            {PSTAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="mt"><button className="btn" disabled={!rw}>Save changes</button></div>
      <div className="legend mt6">System-controlled and mandated fields are locked.</div>

      <h3 className="mt">Interactions</h3>
      {interactions.length ? (
        <table>
          <thead><tr><th>Type</th><th>Date</th><th>Seller</th><th>Next action</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            {interactions.map((i, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td>{i.type}</td><td>{i.date}</td><td>{i.seller}</td><td>{i.next}</td><td>{i.due}</td>
                  <td><Badge cls={i.status === "Open" ? "amber" : "green"}>{i.status}</Badge></td>
                </tr>
                <tr><td colSpan={6} className="legend">Notes: {i.notes}</td></tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : <div className="muted">No interactions logged yet.</div>}
      {rw && <div className="mt"><button className="btn ghost sm" onClick={() =>
        drawer.open("Log an interaction", <span className="badge b-blue">ProspectInteraction</span>, <InteractionDrawer prospectId={p.id} />)}>Log interaction</button></div>}

      <h3 className="mt">Linked campaigns & signals</h3>
      {campaigns.length ? campaigns.map((c) => <span key={c.n} className="chip">{c.n}</span>) : <span className="muted">—</span>}
      <div className="mt6">
        {signals.length ? signals.map((s, i) => <div key={i} className="legend">Signal {s.score} · {s.title}</div>) : <div className="legend">No linked signals.</div>}
      </div>

      <h3 className="mt">Opportunity link</h3>
      {linkedOpp ? (
        <table>
          <thead><tr><th>Opportunity ID</th><th>Conversion date</th><th>Status</th></tr></thead>
          <tbody><tr>
            <td className="clk" style={{ cursor: "pointer", color: "var(--primary)" }}
              onClick={() => drawer.open(linkedOpp.n, <Badge cls="blue">{linkedOpp.stage}</Badge>, <OppDrawer o={linkedOpp} />)}>{linkedOpp.id}</td>
            <td>{p.sign}</td><td><Badge cls={linkedOpp.status === "Won" ? "green" : "gray"}>{linkedOpp.status}</Badge></td>
          </tr></tbody>
        </table>
      ) : p.st >= 4 ? (
        <div className="flex">
          <select className="t">{eligibleOpps.map((o) => <option key={o.id} value={o.id}>{o.n}</option>)}</select>
          <button className="btn sm" disabled={!rw}>Link</button>
        </div>
      ) : <div className="muted">Available once the prospect reaches Qualified Lead.</div>}
    </div>
  );
}

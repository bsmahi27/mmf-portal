"use client";
import React from "react";
import { CAMP_HISTORY, PLAYBOOK_PARTS, PLAY_TEMPLATES, PROSPECTS, PSTAGES, SIGNALS } from "@/lib/data";
import type { Campaign } from "@/lib/types";
import { buName, can, useApp } from "@/lib/state";
import { Badge } from "../ui";

const statusColor: Record<string, string> = {
  Active: "green", Review: "violet", Paused: "amber", Draft: "gray", Planned: "blue", Approved: "blue", Closed: "gray",
};

export default function CampaignDrawer({ c }: { c: Campaign }) {
  const { role } = useApp();
  const rw = can(role, "Campaigns", true);
  const history = CAMP_HISTORY.filter((h) => h.c === c.n);
  const shortlist = PROSPECTS.filter((p) => p.bu === c.bu && (!c.country || p.country === c.country)).slice(0, 5);
  const plays = PLAY_TEMPLATES.filter((pl) => pl.sol === c.sol);
  const complete = c.status === "Draft" ? 1 : c.status === "Planned" ? 3 : 5;

  return (
    <div>
      <div className="flex wrapf mb">
        <Badge cls={statusColor[c.status] || "gray"}>{c.status}</Badge>
        <span className="muted">{buName(c.bu)}{c.country ? ` · ${c.country}` : ""}</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi"><div className="lab">Target accounts</div><div className="val">{c.m.targets ?? c.accts}</div></div>
        <div className="kpi"><div className="lab">Engaged accounts</div><div className="val">{c.m.engaged ?? c.m.reached}</div></div>
        <div className="kpi"><div className="lab">Meetings delivered</div><div className="val">{c.m.delivered ?? c.m.meetings}</div></div>
        <div className="kpi"><div className="lab">Qualified pipeline</div><div className="val">€{c.m.pipe.toFixed(1)}M</div></div>
        <div className="kpi"><div className="lab">Qualified leads</div><div className="val">{c.m.qleads ?? c.m.oppsGen}</div></div>
        <div className="kpi"><div className="lab">Bookings influenced</div><div className="val">€{(c.m.bookings ?? c.m.pipe * 0.55).toFixed(1)}M</div></div>
      </div>
      <div className="legend mt6">Prototype campaign metrics: target accounts, engagement, meetings, qualified leads, influenced pipeline and bookings.</div>

      <h3 className="mt">Campaign record</h3>
      <table>
        <tbody>
          <tr><td className="muted">Solution</td><td>{c.sol}</td></tr>
          <tr><td className="muted">Radar engine</td><td>{c.engine !== "—" ? <><Badge cls="blue">{c.engine}</Badge></> : "—"}</td></tr>
          <tr><td className="muted">Owner</td><td>{c.owner}</td></tr>
          <tr><td className="muted">Approver</td><td>{c.approver}</td></tr>
          <tr><td className="muted">Dates</td><td>{c.start} → {c.end}</td></tr>
        </tbody>
      </table>
      <div className="flex mt wrapf">
        {rw && c.status !== "Closed" && c.status !== "Review" && (
          <button className="btn ghost sm" onClick={() => alert("Would open the campaign for edit. Changes are recorded in change history.")}>Edit campaign</button>
        )}
        {c.status === "Planned" && rw && <button className="btn sm">Submit for approval</button>}
        <button className="btn gray sm">Log interaction</button>
        <button className="btn gray sm">Export</button>
      </div>

      <h3 className="mt">Playbook</h3>
      <table>
        <thead><tr><th>Component</th><th>Status</th><th>Description</th></tr></thead>
        <tbody>
          {PLAYBOOK_PARTS.map(([name, desc], i) => (
            <tr key={name}><td>{name}</td><td><Badge cls={i < complete ? "green" : "gray"}>{i < complete ? "Complete" : "Outstanding"}</Badge></td><td className="legend">{desc}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt">Shortlist</h3>
      <table>
        <thead><tr><th>Account / prospect</th><th>Lifecycle stage</th><th>Priority</th><th>Top signal</th></tr></thead>
        <tbody>
          {shortlist.map((p) => {
            const sig = SIGNALS.filter((s) => s.acct === p.n).sort((a, b) => b.score - a.score)[0];
            return (
              <tr key={p.id}>
                <td>{p.n} <span className="legend">{p.id}</span></td>
                <td><Badge cls={p.st === 6 ? "green" : p.st >= 5 ? "teal" : "gray"}>{PSTAGES[p.st]}</Badge></td>
                <td><Badge cls={p.tcv > 5 ? "red" : p.tcv > 2.5 ? "amber" : "gray"}>{p.tcv > 5 ? "High" : p.tcv > 2.5 ? "Medium" : "Low"}</Badge></td>
                <td>{sig ? `${sig.score} · ${sig.title}` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="mt">Plays</h3>
      <table>
        <thead><tr><th>Play template</th><th>Channel</th><th>Steps</th><th>Assets</th></tr></thead>
        <tbody>{plays.map((pl) => <tr key={pl.n}><td>{pl.n}</td><td>{pl.ch}</td><td>{pl.steps}</td><td>2</td></tr>)}</tbody>
      </table>

      <h3 className="mt">Change history</h3>
      {history.length ? (
        <table>
          <thead><tr><th>When</th><th>Who</th><th>Change</th></tr></thead>
          <tbody>{history.map((h, i) => <tr key={i}><td>{h.when}</td><td>{h.who}</td><td>{h.what}</td></tr>)}</tbody>
        </table>
      ) : <div className="muted">No recorded changes.</div>}
    </div>
  );
}

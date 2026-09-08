"use client";
import React, { useState } from "react";
import { CAMPAIGNS } from "@/lib/data";
import type { Opp } from "@/lib/types";
import { buName, can, useApp } from "@/lib/state";
import { Badge } from "../ui";

export default function OppDrawer({ o }: { o: Opp }) {
  const { role } = useApp();
  const rw = can(role, "Campaigns", true);
  const [mm, setMm] = useState(o.mm);
  return (
    <div>
      <div className="flex wrapf mb">
        <span className="badge b-gray">{o.id}</span>
        <Badge cls="blue">{o.stage}</Badge>
        <span className="muted">{o.acct}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi"><div className="lab">Value</div><div className="val">€{o.val.toFixed(1)}M</div></div>
        <div className="kpi"><div className="lab">Probability</div><div className="val">{o.prob}%</div></div>
        <div className="kpi"><div className="lab">Close date</div><div className="val" style={{ fontSize: 16 }}>{o.close}</div></div>
      </div>
      <h3 className="mt">Opportunity record</h3>
      <table>
        <tbody>
          <tr><td className="muted">Account</td><td>{o.acct}</td></tr>
          <tr><td className="muted">Industry</td><td>{o.ind}</td></tr>
          <tr><td className="muted">Business Unit</td><td>{buName(o.bu)}{o.country ? ` · ${o.country}` : ""}</td></tr>
          <tr><td className="muted">Factory solution</td><td>{o.sol || "—"}</td></tr>
          <tr><td className="muted">Owner</td><td>{o.own}</td></tr>
          <tr><td className="muted">Competitor</td><td>{o.comp}</td></tr>
          <tr><td className="muted">Originating prospect</td><td>{o.pid ? <>{o.pid} <span className="legend">(lifecycle history preserved)</span></> : "—"}</td></tr>
          <tr><td className="muted">MM Factory classification</td><td>{mm ? "Classified" : "Not classified"}</td></tr>
        </tbody>
      </table>
      <h3 className="mt">Campaign attribution</h3>
      <select className="t" disabled={!rw}>
        <option>— none —</option>
        {CAMPAIGNS.filter((c) => c.bu === o.bu).map((c) => <option key={c.n} value={c.n}>{c.n}</option>)}
      </select>
      <div className="mt">
        <button className={`btn sm ${mm ? "gray" : ""}`} disabled={!rw} onClick={() => setMm((v) => !v)}>
          {mm ? "✓ Classified" : "Classify"}
        </button>
      </div>
      <div className="legend mt6">Read-only from Salesforce.</div>
    </div>
  );
}

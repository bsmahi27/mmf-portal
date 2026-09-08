"use client";
import React, { useState } from "react";
import { ACCOUNTS, AGENT_USAGE, OPPS } from "@/lib/data";
import type { Agent } from "@/lib/types";
import { inScope, stars, useApp } from "@/lib/state";
import { Badge } from "../ui";

export default function AgentDrawer({ a }: { a: Agent }) {
  const { scope } = useApp();
  const usage = AGENT_USAGE.find((u) => u.n === a.n);
  const accounts = ACCOUNTS.filter((acc) => inScope(scope, acc));
  const [account, setAccount] = useState(accounts[0]?.n || "");
  const opps = OPPS.filter((o) => inScope(scope, o));
  const [running, setRunning] = useState(false);
  const [out, setOut] = useState<React.ReactNode>(null);
  const [rating, setRating] = useState(4);

  function run() {
    setRunning(true);
    setOut(null);
    setTimeout(() => {
      setRunning(false);
      setOut(
        <div className="output mt">
          <b>{a.n} — {account}</b>
          <div className="mt6">• Situation: Mid-market account showing budget pressure and legacy application estate constraints.</div>
          <div>• Opportunity: Cost-takeout and modernization narrative aligns with recent signals.</div>
          <div>• Recent signals: Cost programme announcement, hiring surge in digital roles.</div>
          <div>• Suggested next step: Book a discovery meeting referencing the cost programme.</div>
          <div>• Watch-outs: Incumbent vendor relationship — confirm competitive landscape.</div>
        </div>
      );
    }, 600);
  }

  return (
    <div>
      <div className="muted mb">{a.stage}</div>
      <div className="flex wrapf mb">
        <Badge cls={a.type === "Internal" ? "violet" : "blue"}>{a.type}</Badge>
        <Badge cls={a.status === "Published" ? "green" : "amber"}>{a.status}</Badge>
        <span className="muted">{a.ver}</span>
      </div>
      <p>{a.d}</p>
      <div className="legend">Grounding: {a.grounding.join(" · ")} — always RLS-scoped to the invoking user.</div>

      <div className="grid mt" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi"><div className="lab">Invocations</div><div className="val">{usage?.inv ?? 0}</div></div>
        <div className="kpi"><div className="lab">Distinct users</div><div className="val">{usage?.users ?? 0}</div></div>
        <div className="kpi"><div className="lab">Rating</div><div className="val">{usage?.rating ?? "—"}</div><div className="meta">{usage ? stars(usage.rating) : ""}</div></div>
      </div>

      <label className="fl">Account context</label>
      <select className="t" value={account} onChange={(e) => setAccount(e.target.value)}>
        {accounts.map((acc) => <option key={acc.n} value={acc.n}>{acc.n}</option>)}
      </select>
      <label className="fl">Related opportunity (optional)</label>
      <select className="t">
        <option>— none —</option>
        {opps.map((o) => <option key={o.id} value={o.id}>{o.n}</option>)}
      </select>
      <label className="fl">Guided input</label>
      <textarea rows={3} defaultValue="Focus on cost-reduction levers and SAP modernization." />
      <div className="mt"><button className="btn" onClick={run} disabled={running}>{running ? "Running…" : "Run agent"}</button></div>
      {out}
      {out && (
        <>
          <div className="flex mt wrapf">
            <Badge cls="amber">AI-generated — review before client-facing use</Badge>
          </div>
          <div className="flex mt wrapf">
            <button className="btn ghost sm">Save to account</button>
            <button className="btn ghost sm">Save to campaign</button>
            <button className="btn gray sm">⬇ Export</button>
          </div>
          <div className="mt">
            <span className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ cursor: "pointer" }} onClick={() => setRating(i)}>{i <= rating ? "★" : "☆"}</span>
              ))}
            </span>
          </div>
          <input className="t mt6" placeholder="Feedback on this output (captured for adoption analytics)" />
        </>
      )}
    </div>
  );
}

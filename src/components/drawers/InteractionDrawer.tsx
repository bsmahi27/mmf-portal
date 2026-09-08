"use client";
import React, { useState } from "react";
import { ACCOUNTS, CAMPAIGNS, PROSPECTS, PSTAGES } from "@/lib/data";
import { useApp, inScope } from "@/lib/state";

const TYPES = ["Outreach", "Call", "Meeting scheduled", "Meeting delivered", "Event", "Webinar"];

export default function InteractionDrawer({ prospectId }: { prospectId?: string }) {
  const { scope, campFilter } = useApp();
  const names = Array.from(new Set([...PROSPECTS.map((p) => p.n), ...ACCOUNTS.map((a) => a.n)]));
  const activeCampaigns = CAMPAIGNS.filter((c) => inScope(scope, c) && c.status === "Active");
  const [account, setAccount] = useState(prospectId ? (PROSPECTS.find((p) => p.id === prospectId)?.n ?? names[0]) : names[0]);
  const [type, setType] = useState(TYPES[0]);
  const [status, setStatus] = useState("Open");
  const [resultStage, setResultStage] = useState(PSTAGES[0]);
  const [out, setOut] = useState<React.ReactNode>(null);

  function submit() {
    setOut(
      <div className="output mt">
        <b>Interaction logged — propagated in one action</b>
        <div className="mt6">✓ Prospect record: lifecycle stage updated</div>
        <div>✓ Interaction history: retained against prospect, persisted after conversion</div>
        <div>✓ Campaign metrics: outreach activities, meetings secured, accounts reached incremented</div>
        <div>✓ Dashboard: campaign health, seller view, coverage recomputed</div>
        {resultStage === "Qualified Lead" && (
          <div className="mt6" style={{ color: "var(--primary)" }}>
            → This prospect is now Qualified Lead. Link it to a Salesforce opportunity from the prospect record.
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="muted">Logged against the prospect record</div>
      <label className="fl">Prospect / account</label>
      <select className="t" value={account} onChange={(e) => setAccount(e.target.value)}>
        {names.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <label className="fl">Campaign (optional)</label>
      <select className="t">
        <option>— none —</option>
        {activeCampaigns.map((c) => <option key={c.n} value={c.n}>{c.n}</option>)}
      </select>
      <div className="f2">
        <div>
          <label className="fl">Interaction type</label>
          <select className="t" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="fl">Date</label>
          <input className="t" defaultValue="02 Sep 2026" />
        </div>
      </div>
      <label className="fl">Notes</label>
      <textarea rows={2} placeholder="What happened?" />
      <div className="f3">
        <div><label className="fl">Next action</label><input className="t" placeholder="e.g. Send proposal outline" /></div>
        <div><label className="fl">Owner</label><input className="t" placeholder="Seller name" /></div>
        <div><label className="fl">Due date</label><input className="t" placeholder="e.g. 10 Sep 2026" /></div>
      </div>
      <div className="f2">
        <div>
          <label className="fl">Status</label>
          <select className="t" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Open</option><option>Closed</option>
          </select>
        </div>
        <div>
          <label className="fl">Resulting lifecycle stage</label>
          <select className="t" value={resultStage} onChange={(e) => setResultStage(e.target.value)}>
            {PSTAGES.slice(0, 5).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="mt"><button className="btn" onClick={submit}>Submit interaction</button></div>
      {out}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { CONNECTORS } from "@/lib/data";

export default function RegisterAgentDrawer() {
  const groundingConnectors = CONNECTORS.filter((c) => c.used.includes("Agents"));
  const [sources, setSources] = useState<Record<string, boolean>>(
    Object.fromEntries([...groundingConnectors.map((c) => [c.n, true]), ["Public web", true]])
  );
  const [tested, setTested] = useState(false);

  return (
    <div>
      <div className="badge b-blue mb">Agent API contract</div>
      <div className="f2">
        <div><label className="fl">Agent name</label><input className="t" placeholder="e.g. Pricing Advisor" /></div>
        <div>
          <label className="fl">Sales stage</label>
          <select className="t"><option>Prospecting</option><option>Engagement</option><option>Shaping</option><option>Bidding</option></select>
        </div>
      </div>
      <label className="fl">Endpoint</label>
      <input className="t" placeholder="https://…" />
      <label className="fl">Auth</label>
      <select className="t">
        <option>Bearer token (Key Vault reference)</option>
        <option>OAuth2 client credentials</option>
      </select>
      <label className="fl">Request / response schema</label>
      <div className="output">{`POST {endpoint}
{ agentId, runId,
  context { accountId, account, signals },
  inputs  { …form fields… },
  grounding { allowedSources, userScope } }
→ { status, output { type, content }, citations[], usage }`}</div>
      <label className="fl">Grounding sources allowed</label>
      <div>
        {Object.keys(sources).map((n) => (
          <span key={n} className={`chip clk${sources[n] ? " on" : ""}`}
            onClick={() => setSources((s) => ({ ...s, [n]: !s[n] }))}>{n}</span>
        ))}
      </div>
      <div className="flex mt wrapf">
        <button className="btn ghost sm" onClick={() => setTested(true)}>🔌 Run connection test</button>
        <button className="btn sm" onClick={() => alert("Would save the registration at status In-Test. Publish requires a passing eval.")}>Save as In-Test</button>
      </div>
      {tested && <div className="legend mt6">Connection test succeeded (mock).</div>}
      <div className="legend mt">Secrets stored as Key Vault references. Internal agents implement the same interface in-process, with RAG grounding over the embedded Solutions & Assets index, filtered by user scope.</div>
    </div>
  );
}

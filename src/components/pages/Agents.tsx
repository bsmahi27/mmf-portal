"use client";
import React, { useState } from "react";
import { AGENTS, AGENT_STAGES, SIGNALS } from "@/lib/data";
import { useApp } from "@/lib/state";
import { Badge } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import AgentDrawer from "@/components/drawers/AgentDrawer";
import RegisterAgentDrawer from "@/components/drawers/RegisterAgentDrawer";

export default function Agents() {
  const { role } = useApp();
  const drawer = useDrawer();
  const [stage, setStage] = useState("All");
  const [team, setTeam] = useState("All");
  const [query, setQuery] = useState("");
  const teams = [...new Set(AGENTS.map((agent) => agent.owner || "Clients & Innovation"))];
  const distinct = new Set(AGENTS.map((agent) => agent.n)).size;
  const canRegister = role === "Factory Agentic Lead";
  const filtered = AGENTS.filter((agent) => (stage === "All" || agent.stage === stage) && (team === "All" || agent.owner === team) && `${agent.n} ${agent.d} ${agent.use || ""}`.toLowerCase().includes(query.toLowerCase()));
  const signalCount = (name: string) => SIGNALS.filter((signal) => (signal.agents || []).includes(name)).length;
  return <div className="wrap">
    <h2 className="page">Smart Agents</h2>
    <p className="sub">A curated launchpad into the existing Copilot / TLC agent estate, organised by sales lifecycle stage</p>
    <div className="note"><b>Agents run in Copilot / TLC, not in the portal.</b><div className="legend mt6">The portal is the front door: it tells you which agent to use, when, and takes you there. Triggers Radar recommends the right agent for each signal.</div></div>
    <div className="flex wrapf mb"><select className="t" style={{ width: "auto" }} value={stage} onChange={(e) => setStage(e.target.value)}><option>All</option>{AGENT_STAGES.map((item) => <option key={item.k}>{item.k}</option>)}</select><select className="t" style={{ width: "auto" }} value={team} onChange={(e) => setTeam(e.target.value)}><option>All</option>{teams.map((item) => <option key={item}>{item}</option>)}</select><input className="t" style={{ width: "auto", flex: 1, minWidth: 200 }} placeholder="⌕ Search agent name or purpose…" value={query} onChange={(e) => setQuery(e.target.value)} /><span className="legend">{distinct} distinct agents · {AGENTS.length} stage placements</span><button className="btn sm" disabled={!canRegister} onClick={() => drawer.open("Register an external agent", <Badge cls="violet">New agent</Badge>, <RegisterAgentDrawer />)}>+ Register an external agent</button></div>
    {AGENT_STAGES.filter((item) => stage === "All" || item.k === stage).map((item) => { const agents = filtered.filter((agent) => agent.stage === item.k); if (!agents.length) return null; return <section key={item.k}><h3 style={{ margin: "20px 0 3px" }}>{item.ic} {item.k} <span className="legend">· {agents.length} placement{agents.length === 1 ? "" : "s"}</span></h3><p className="legend" style={{ margin: 0 }}>{item.sub}</p><div className="cols mt6">{agents.map((agent, index) => <div className="agentcard" key={`${agent.n}-${item.k}-${index}`} onClick={() => drawer.open(agent.n, <Badge cls="violet">{agent.owner}</Badge>, <AgentDrawer a={agent} />)}><div className="flex between mb"><Badge cls="violet">{agent.owner}</Badge><span className="legend">{agent.launches} launches</span></div><b>{agent.n}</b><div className="muted mt6">{agent.d}</div><div className="use mt6">Best used for: {agent.use}</div><div className="flex between mt"><span className="legend">{signalCount(agent.n) ? `${signalCount(agent.n)} live signals` : ""}</span><button className="btn sm" onClick={(event) => { event.stopPropagation(); drawer.open(agent.n, <Badge cls="violet">{agent.owner}</Badge>, <AgentDrawer a={agent} />); }}>Launch ↗</button></div></div>)}</div></section>; })}
    <div className="card mt"><b>Agent utilization on the dashboard</b><div className="legend mt6">Usage is approximated from launch clicks while agents run externally in Copilot / TLC. Outputs require human review before client-facing use.</div></div>
  </div>;
}

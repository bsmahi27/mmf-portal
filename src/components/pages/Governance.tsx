"use client";
import React from "react";
import { ACTIONS, COUNCILS, DECISIONS, MEETINGS, MVP_OUTCOMES, RACI } from "@/lib/data";
import { can, useApp } from "@/lib/state";
import { Badge, RoleBar, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import NewMeetingDrawer from "@/components/drawers/NewMeetingDrawer";

const TABS = ["Councils", "Meetings", "Decisions", "Actions", "RACI", "MVP acceptance"];

export default function GovernancePage() {
  const { role, subview, setSub } = useApp();
  const tab = subview["governance"] || TABS[0];
  const setTab = (t: string) => setSub("governance", t);
  const rw = can(role, "Governance", true);

  return (
    <div className="wrap">
      <h2 className="page">Governance</h2>
      <p className="sub">Councils and cadence · a lean record of decisions and actions · a lightweight RACI reference</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      <RoleBar role={role} mod="Governance" rw={rw} />
      {tab === "Councils" && <Councils rw={rw} />}
      {tab === "Meetings" && <Meetings />}
      {tab === "Decisions" && <Decisions />}
      {tab === "Actions" && <Actions rw={rw} />}
      {tab === "RACI" && <Raci role={role} />}
      {tab === "MVP acceptance" && <MvpAcceptance />}
    </div>
  );
}

function Councils({ rw }: { rw: boolean }) {
  const drawer = useDrawer();
  return (
    <>
      <div className="cols">
        {COUNCILS.map((c) => (
          <div key={c.n} className="card">
            <div className="flex between"><b>{c.n}</b><Badge cls="blue">{c.cad}</Badge></div>
            <div className="legend">{c.scope}</div>
            <div className="muted mt6">Chair: {c.chair}</div>
            <div className="mt6"><span className="chip">Next: {c.next}</span></div>
            <div className="mt6"><span className="chip">{c.dec} decisions</span><span className="chip">{c.act} open actions</span></div>
          </div>
        ))}
        <div className="card">
          <h3>Meeting record</h3>
          <div className="legend">A meeting is a dated instance under a council with attendees and notes, capturing decisions and actions. Agenda and free-form minutes are out of MVP scope. Councils, cadence and membership are Admin-configurable.</div>
          {rw && <button className="btn sm mt" onClick={() => drawer.open("Create meeting", <Badge cls="blue">Governance</Badge>, <NewMeetingDrawer />)}>Create meeting</button>}
        </div>
      </div>
    </>
  );
}

function Meetings() {
  return (
    <table>
      <thead><tr><th>Council</th><th>Date</th><th>Attendees</th><th>Decisions</th><th>Actions</th></tr></thead>
      <tbody>
        {MEETINGS.map((m, i) => (
          <React.Fragment key={i}>
            <tr><td><b>{m.council}</b></td><td>{m.date}</td><td className="legend">{m.att}</td>
              <td><Badge cls="green">{m.dec}</Badge></td><td><Badge cls="amber">{m.act}</Badge></td></tr>
            <tr><td colSpan={5} className="legend">Notes: {m.notes}</td></tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

function Decisions() {
  return (
    <table>
      <thead><tr><th>Decision</th><th>Owner</th><th>Date</th><th>Reference</th><th>Status</th></tr></thead>
      <tbody>{DECISIONS.map((d, i) => <tr key={i}><td><b>{d.d}</b></td><td>{d.o}</td><td>{d.dt}</td><td>{d.ref}</td><td><Badge cls={d.s === "Ratified" ? "green" : "amber"}>{d.s}</Badge></td></tr>)}</tbody>
    </table>
  );
}

function Actions({ rw }: { rw: boolean }) {
  const sorted = ACTIONS.slice().sort((a, b) => (a.s === b.s ? 0 : a.s === "Open" ? -1 : 1));
  return (
    <>
      <div className="flex between mb">
        <div className="legend">{ACTIONS.filter((a) => a.s === "Open").length} open · {ACTIONS.filter((a) => a.s === "Closed").length} closed</div>
        {rw && <button className="btn sm">Add action</button>}
      </div>
      <table>
        <thead><tr><th>Action</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
        <tbody>{sorted.map((a, i) => <tr key={i}><td><b>{a.a}</b></td><td>{a.o}</td><td>{a.due}</td><td><Badge cls={a.s === "Open" ? "amber" : "green"}>{a.s}</Badge></td></tr>)}</tbody>
      </table>
      <div className="legend mt">Status-only tracking for MVP. Notifications and automatic rollover are Phase 2.</div>
    </>
  );
}

function Raci({ role }: { role: string }) {
  return (
    <>
      <table>
        <thead><tr><th>Activity</th><th>R</th><th>A</th><th>C</th><th>I</th></tr></thead>
        <tbody>{RACI.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td></tr>)}</tbody>
      </table>
      <div className="legend mt">A lightweight reference table across the nine roles, shown for guidance rather than wired into workflow. {role === "Admin" ? "Editable by Admin." : "Editing requires the Admin role."}</div>
    </>
  );
}

function MvpAcceptance() {
  return (
    <>
      <div className="note">The MVP acceptance criteria emphasise outcomes over functionality — business value validation, user adoption and core GTM enablement for mid-market clients.</div>
      <table>
        <thead><tr><th>Outcome criterion</th><th>Status</th></tr></thead>
        <tbody>{MVP_OUTCOMES.map(([c, s], i) => <tr key={i}><td>{c}</td><td><Badge cls="amber">{s}</Badge></td></tr>)}</tbody>
      </table>
      <div className="legend mt">These sit alongside the per-module acceptance criteria, which are listed in each module section of the specification.</div>
    </>
  );
}

"use client";
import React, { useState } from "react";
import { COUNCILS } from "@/lib/data";
import { useDrawer } from "@/lib/drawer";

export default function NewMeetingDrawer() {
  const drawer = useDrawer();
  const [decisions, setDecisions] = useState<number[]>([0]);
  const [actions, setActions] = useState<number[]>([0]);

  return (
    <div>
      <div className="badge b-blue mb">Governance</div>
      <div className="f2">
        <div>
          <label className="fl">Council</label>
          <select className="t">{COUNCILS.map((c) => <option key={c.n} value={c.n}>{c.n}</option>)}</select>
        </div>
        <div><label className="fl">Date</label><input className="t" defaultValue="02 Sep 2026" /></div>
      </div>
      <label className="fl">Attendees</label>
      <input className="t" placeholder="Comma-separated names/roles" />
      <label className="fl">Meeting notes</label>
      <textarea rows={4} placeholder="Free-form minutes" />

      <h3 className="mt">Decisions</h3>
      {decisions.map((i) => (
        <div className="f2" key={i}>
          <div><label className="fl">Decision</label><input className="t" /></div>
          <div><label className="fl">Owner</label><input className="t" /></div>
        </div>
      ))}
      <button className="btn ghost sm mt6" onClick={() => setDecisions((d) => [...d, d.length])}>+ Add decision</button>

      <h3 className="mt">Actions</h3>
      {actions.map((i) => (
        <div className="f3" key={i}>
          <div><label className="fl">Action</label><input className="t" /></div>
          <div><label className="fl">Owner</label><input className="t" /></div>
          <div><label className="fl">Due date</label><input className="t" /></div>
        </div>
      ))}
      <button className="btn ghost sm mt6" onClick={() => setActions((a) => [...a, a.length])}>+ Add action</button>

      <div className="flex mt wrapf">
        <button className="btn sm" onClick={() => { alert("Meeting saved (mock)."); drawer.close(); }}>Save meeting</button>
        <button className="btn gray sm" onClick={drawer.close}>Cancel</button>
      </div>
    </div>
  );
}

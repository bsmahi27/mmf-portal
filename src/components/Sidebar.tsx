"use client";
import React from "react";
import { NAV, PVIEWS } from "@/lib/data";
import { useApp, navIds } from "@/lib/state";

export default function Sidebar() {
  const { pview, setPview, current, go } = useApp();
  const ids = navIds(pview);
  const main = NAV.filter((n) => ids.includes(n.id) && n.sect !== "About");
  const about = NAV.filter((n) => ids.includes(n.id) && n.sect === "About");

  return (
    <aside className="side">
      <div className="brand"><b>MM Factory Portal</b><span>NCE · Mid-Market Factory · MVP</span></div>
      <div className="vpick">
        <label>Portal view</label>
        <select value={pview} onChange={(e) => setPview(e.target.value)}>
          {Object.keys(PVIEWS).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <nav className="nav">
        {main.map((n) => (
          <a key={n.id} className={current === n.id ? "active" : ""} onClick={() => go(n.id)}>
            <span className="ico">{n.ico}</span>{n.label}
          </a>
        ))}
        {about.length > 0 && <div className="sect">About</div>}
        {about.map((n) => (
          <a key={n.id} className={current === n.id ? "active" : ""} onClick={() => go(n.id)}>
            <span className="ico">{n.ico}</span>{n.label}
          </a>
        ))}
      </nav>
      <div className="foot">MVP prototype · mock data<br/>Spec 02 Sep 2026, changes accepted<br/>© Capgemini 2026</div>
    </aside>
  );
}

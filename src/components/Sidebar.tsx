"use client";
import React from "react";
import { NAV } from "@/lib/data";
import { useApp, navIds } from "@/lib/state";

export default function Sidebar() {
  const { current, go } = useApp();
  const main = NAV.filter((n) => n.sect !== "About");
  const about = NAV.filter((n) => n.sect === "About");

  return (
    <aside className="side">
      <div className="brand"><b>MM Factory Portal</b><span>NCE · Mid-Market Factory · v3.1</span></div>
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
      <div className="foot">Prototype · mock data<br/>Spec v3.0 · 11 Aug 2026<br/>© Capgemini 2026</div>
    </aside>
  );
}

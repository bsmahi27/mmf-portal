"use client";
import React, { useState } from "react";
import { ROLES } from "@/lib/data";
import { useApp } from "@/lib/state";

export default function Login() {
  const { login } = useApp();
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0].n);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErr("Enter your name to continue."); return; }
    login(name.trim(), role);
  }

  return (
    <div className="login-wrap">
      <div className="login-card card">
        <div className="brand" style={{ borderBottom: "none", padding: "0 0 14px" }}>
          <b style={{ color: "var(--ink)" }}>MM Factory Portal</b>
          <span style={{ color: "var(--mut)" }}>NCE · Mid-Market Factory · MVP</span>
        </div>
        <h2 className="page">Sign in</h2>
        <p className="sub">Choose your name and role to enter the portal prototype.</p>
        <form onSubmit={submit}>
          <label className="fl">Your name</label>
          <input className="t" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. T. Schmidt" />
          <label className="fl">Role</label>
          <select className="t" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r.n} value={r.n}>{r.n}</option>)}
          </select>
          {err && <div className="banner mt">{err}</div>}
          <button type="submit" className="btn mt" style={{ width: "100%" }}>Sign in</button>
        </form>
        <div className="legend mt">MVP prototype · mock data · no credentials required</div>
      </div>
    </div>
  );
}

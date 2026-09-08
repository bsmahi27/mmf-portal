"use client";
import React from "react";

const SECTIONS = [
  "§4 Data Model / Backbone", "§5 Prospect Management", "§6 Campaigns", "§7 Solutions & Assets",
  "§8 Triggers Radar", "§9 Dashboarding & Reporting", "§10 Governance", "§11 Smart Agents",
];

const SCOPE_DECISIONS: [string, string][] = [
  ["Organisation model", "BU-first, Country optional"],
  ["Prospect management and interaction logging", "In, and core"],
  ["Triggers Radar and Smart Agents depth", "As the document specifies"],
];

const NOT_IN_SCOPE = [
  "Country-first scoping across seven countries", "Vertical radar", "Recommended agent and next best action per signal",
  "Wider ~29-agent catalogue", "Campaign Builder split", "Campaign calendar", "Eight campaign metrics", "Partner Plays",
];

const OPEN_ITEMS: [string, string][] = [
  ["Sector and segment taxonomy, and final Industry and Business Line reference lists", "§12.8"],
  ["Subscription data-source providers and licensing terms", "§12.8"],
  ["Enterprise-approved LLM deployment for internal agents", "§12.8"],
  ["Precise KPI definitions", "§12.8"],
  ["Whether Qualified Lead and Converted to Opportunity remain separate lifecycle stages", "§5"],
  ["Which fields on a prospect are system-controlled / locked", "§5"],
  ["Accept/reject tracked changes in source document", "Document hygiene"],
  ["§12 heading numbering and document title issues", "Document hygiene"],
];

export default function Scope() {
  return (
    <div className="wrap">
      <h2 className="page">MVP scope</h2>
      <p className="sub">What this prototype is built to, and what is still open</p>
      <div className="banner"><b>Note:</b> Source Word document originally carried 285 unaccepted tracked revisions; this build reflects the accepted-changes version.</div>

      <table className="mb">
        <tbody>
          <tr><td className="muted">Specification</td><td>MMF_Portal_Specification_MVP_Sept02.docx, revisions to 31 August 2026</td></tr>
          <tr><td className="muted">Structure</td><td>Eight functional sections (§4–§11) plus technical addendum (§12)</td></tr>
          <tr><td className="muted">Organisation model</td><td>SBU → BU → (optional Country) → Account. 4 BUs: UK, Germany, Netherlands, Nordics; Nordics splits into 4 countries</td></tr>
          <tr><td className="muted">Portal views</td><td>3 role-based experiences, 9 roles, RBAC</td></tr>
          <tr><td className="muted">Data source</td><td>Salesforce (read-only), daily incremental REST sync, SystemModstamp watermark, crmId join key, MM Factory classification portal-side only</td></tr>
        </tbody>
      </table>

      <h3>Eight functional sections</h3>
      <div className="cols mb">{SECTIONS.map((s) => <div key={s} className="card">{s}</div>)}</div>

      <h3>Scope decisions (02 Sep 2026)</h3>
      <table className="mb">
        <tbody>{SCOPE_DECISIONS.map(([k, v]) => <tr key={k}><td className="muted">{k}</td><td>{v}</td></tr>)}</tbody>
      </table>

      <h3>Not in this MVP</h3>
      <div className="mb">{NOT_IN_SCOPE.map((n) => <span key={n} className="chip">{n}</span>)}</div>

      <h3>Open items</h3>
      <table>
        <thead><tr><th>Item</th><th>Reference</th></tr></thead>
        <tbody>{OPEN_ITEMS.map(([i, r]) => <tr key={i}><td>{i}</td><td className="muted">{r}</td></tr>)}</tbody>
      </table>

      <div className="note mt">This prototype communicates look-and-feel and module structure. The recommended stack in §12 — Next.js, PostgreSQL with Prisma, Entra ID, Azure — applies to the delivery build. Validate legal, data-privacy and security content with the relevant Capgemini experts before external sharing or build sign-off.</div>
    </div>
  );
}

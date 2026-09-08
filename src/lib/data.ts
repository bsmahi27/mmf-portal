import type {
  BU, Role, PortalView, Account, Prospect, Interaction, Batch, BatchRecord, Opp, Solution, Asset,
  PlayTemplate, Campaign, UploadedAcct, CampHistory, Engine, Signal, Connector, Agent, AgentUsage,
  Council, Meeting, Decision, ActionItem, KpiSet,
} from "./types";

export const BUS: BU[] = [
  { code: "UK", name: "UK", hasCountries: false },
  { code: "DE", name: "Germany", hasCountries: false },
  { code: "NL", name: "Netherlands", hasCountries: false },
  { code: "NO", name: "Nordics", hasCountries: true, countries: ["Sweden", "Finland", "Norway", "Denmark"] },
];

export const ROLES: Role[] = [
  { n: "SBU Factory Leader", rights: "Full read across all BUs and countries; approves SBU-level decisions; no write access to BU-level operational records.", view: "Leadership" },
  { n: "BU Factory Leader", rights: "Full read/write within their BU; approves campaigns, chairs weekly deal review.", view: "Leadership" },
  { n: "BU MM (Business) Leader", rights: "Owns BU quarterly objectives and targets; approves campaigns; read/write on prospects, campaigns, governance.", view: "Leadership" },
  { n: "Seller / Client Partner", rights: "Read/write on own prospects, accounts, interactions and Smart Agents; read on campaigns/solutions/radar in their BU.", view: "Seller" },
  { n: "Solution Architect / SME", rights: "Read/write on solutions & assets; consulted on campaigns and prospect qualification.", view: "Factory / Operations" },
  { n: "Campaign Lead", rights: "Read/write on campaigns and playbooks; read on prospects, solutions, radar.", view: "Factory / Operations" },
  { n: "Factory Agentic Lead", rights: "Read/write on Triggers Radar and Smart Agents; registers data sources.", view: "Factory / Operations" },
  { n: "Factory Solution & Assets Lead", rights: "Read/write on solutions & assets; exclusive right to certify and publish.", view: "Factory / Operations" },
  { n: "Admin", rights: "Full read/write across all modules; manages users, roles, reference data and connectors.", view: "Factory / Operations" },
];

export const PVIEWS: Record<string, PortalView> = {
  "Leadership": { d: "Executive performance, BU/SBU roll-ups, objectives and pipeline outcomes.", nav: ["dashboard", "prospects", "campaigns", "governance", "scope"] },
  "Factory / Operations": { d: "Campaign, prospect, asset, trigger, agent and governance operations.", nav: ["dashboard", "prospects", "campaigns", "solutions", "radar", "agents", "governance", "admin", "scope"] },
  "Seller": { d: "Assigned prospects/accounts, signals, interactions, campaigns, opportunities and Smart Agents.", nav: ["dashboard", "prospects", "campaigns", "solutions", "radar", "agents", "scope"] },
};

export const MODULES = ["Prospects", "Campaigns", "Solutions & Assets", "Triggers Radar", "Dashboard", "Governance", "Smart Agents", "Admin"];

export const PERMS: Record<string, string[]> = {
  "SBU Factory Leader": ["R", "R", "R", "R", "R", "R", "R", "—"],
  "BU Factory Leader": ["RW", "RW", "R", "R", "R", "R", "R", "—"],
  "BU MM (Business) Leader": ["RW", "RW", "R", "R", "R", "RW", "R", "—"],
  "Seller / Client Partner": ["RW", "R", "R", "R", "R", "—", "RW", "—"],
  "Solution Architect / SME": ["R", "R", "RW", "R", "R", "R", "R", "—"],
  "Campaign Lead": ["R", "RW", "R", "R", "R", "R", "R", "—"],
  "Factory Agentic Lead": ["R", "R", "R", "RW", "R", "R", "RW", "—"],
  "Factory Solution & Assets Lead": ["R", "R", "RW", "R", "R", "R", "R", "—"],
  "Admin": ["RW", "RW", "RW", "RW", "RW", "RW", "RW", "RW"],
};

export const PSTAGES = ["Target Identified", "Research", "Outreach", "Meetings Scheduled / Delivered", "Qualified Lead", "Converted to Opportunity"];
export const PSOURCES = ["Single form", "Excel upload", "Radar signal", "Campaign"];
export const CSTATES = ["Draft", "Planned", "Approved", "Active", "Paused", "Closed", "Review"];

export const ACCOUNTS: Account[] = [
  { n: "Rheinwerk Industrial", bu: "DE", sector: "Manufacturing", tier: 1, owner: "T. Schmidt", src: "Salesforce" },
  { n: "Nordkraft Energy", bu: "NO", sector: "E&U", tier: 1, owner: "L. Berg", src: "Salesforce", country: "Norway" },
  { n: "Delta Retail Group", bu: "UK", sector: "Retail", tier: 2, owner: "R. Patel", src: "Salesforce" },
  { n: "FoodCo Rotterdam", bu: "NL", sector: "CPG", tier: 1, owner: "M. de Vries", src: "Portal upload" },
  { n: "Baltic Freight Lines", bu: "NO", sector: "Transport", tier: 2, owner: "S. Lindqvist", src: "Salesforce", country: "Sweden" },
  { n: "Helsinki Financial Services", bu: "NO", sector: "Financial Services", tier: 2, owner: "A. Koskinen", src: "Salesforce", country: "Finland" },
  { n: "CopenTech Automotive", bu: "NO", sector: "Automotive", tier: 1, owner: "N. Holm", src: "Portal upload", country: "Denmark" },
  { n: "Midland Life Sciences", bu: "UK", sector: "Life Sciences", tier: 1, owner: "R. Patel", src: "Salesforce" },
  { n: "Bergstrasse TMT", bu: "DE", sector: "TMT", tier: 2, owner: "K. Weber", src: "Salesforce" },
  { n: "Amstel Transport Group", bu: "NL", sector: "Transport", tier: 2, owner: "M. de Vries", src: "Salesforce" },
];

export const PROSPECTS: Prospect[] = [
  { id: "PRS-UK-00013", n: "Delta Retail Group", bu: "UK", ind: "Retail", tcv: 3.2, st: 4, own: "R. Patel", sign: "Q1-2027", src: "Single form", batch: "—", qual: "Qualified" },
  { id: "PRS-DE-00042", n: "Rheinwerk Industrial", bu: "DE", ind: "Manufacturing", tcv: 6.8, st: 5, own: "T. Schmidt", sign: "Q4-2026", src: "Campaign", batch: "—", qual: "Converted", oppId: "0061t00000AbdK2" },
  { id: "PRS-NL-00007", n: "FoodCo Rotterdam", bu: "NL", ind: "CPG", tcv: 4.1, st: 3, own: "M. de Vries", sign: "Q1-2027", src: "Radar signal", batch: "—", qual: "Engaged" },
  { id: "PRS-DE-00058", n: "Bergstrasse TMT", bu: "DE", ind: "TMT", tcv: 1.9, st: 1, own: "K. Weber", sign: "Q2-2027", src: "Excel upload", batch: "BATCH-0007", qual: "In research" },
  { id: "PRS-NO-00021", n: "Nordkraft Energy", bu: "NO", ind: "E&U", tcv: 5.4, st: 2, own: "L. Berg", sign: "Q1-2027", src: "Excel upload", batch: "BATCH-0004", qual: "Contacted", country: "Norway" },
  { id: "PRS-NO-00033", n: "Baltic Freight Lines", bu: "NO", ind: "Transport", tcv: 2.6, st: 0, own: "S. Lindqvist", sign: "Q3-2027", src: "Single form", batch: "—", qual: "Identified", country: "Sweden" },
  { id: "PRS-NO-00045", n: "Helsinki Financial Services", bu: "NO", ind: "Financial Services", tcv: 3.9, st: 4, own: "A. Koskinen", sign: "Q4-2026", src: "Radar signal", batch: "—", qual: "Qualified", country: "Finland" },
  { id: "PRS-NO-00051", n: "CopenTech Automotive", bu: "NO", ind: "Automotive", tcv: 2.1, st: 1, own: "N. Holm", sign: "Q2-2027", src: "Excel upload", batch: "BATCH-0004", qual: "In research", country: "Denmark" },
  { id: "PRS-UK-00019", n: "Midland Life Sciences", bu: "UK", ind: "Life Sciences", tcv: 7.5, st: 5, own: "R. Patel", sign: "Q3-2026", src: "Campaign", batch: "—", qual: "Converted", oppId: "0061t00000CyzL9" },
  { id: "PRS-NL-00012", n: "Amstel Transport Group", bu: "NL", ind: "Transport", tcv: 1.4, st: 2, own: "M. de Vries", sign: "Q2-2027", src: "Single form", batch: "—", qual: "Contacted" },
];

export const INTERACTIONS: Interaction[] = [
  { pid: "PRS-UK-00013", type: "Meeting delivered", date: "27 Aug 2026", seller: "R. Patel", notes: "Discovery meeting with COO; cost pressure confirmed on logistics network.", next: "Send follow-up proposal outline", status: "Open", due: "10 Sep 2026" },
  { pid: "PRS-UK-00013", type: "Call", date: "12 Aug 2026", seller: "R. Patel", notes: "Intro call — confirmed budget window Q1-2027.", next: "Book discovery meeting", status: "Closed", due: "27 Aug 2026" },
  { pid: "PRS-DE-00042", type: "Meeting delivered", date: "18 Aug 2026", seller: "T. Schmidt", notes: "Final scoping session; agreed SOW draft.", next: "Convert to Salesforce opportunity", status: "Closed", due: "20 Aug 2026" },
  { pid: "PRS-NL-00007", type: "Outreach", date: "30 Aug 2026", seller: "M. de Vries", notes: "Sent tailored cost-takeout narrative referencing tender signal.", next: "Follow up by phone", status: "Open", due: "06 Sep 2026" },
  { pid: "PRS-DE-00058", type: "Outreach", date: "22 Aug 2026", seller: "K. Weber", notes: "Initial outreach email sent from BATCH-0007 upload.", next: "Call to qualify", status: "Open", due: "05 Sep 2026" },
  { pid: "PRS-NO-00021", type: "Call", date: "25 Aug 2026", seller: "L. Berg", notes: "Discussed application estate constraints flagged by Radar.", next: "Schedule meeting", status: "Open", due: "08 Sep 2026" },
  { pid: "PRS-NO-00045", type: "Meeting scheduled", date: "01 Sep 2026", seller: "A. Koskinen", notes: "Meeting booked with CFO for early September.", next: "Prepare meeting brief via Smart Agent", status: "Open", due: "07 Sep 2026" },
];

export const BATCHES: Batch[] = [
  { id: "BATCH-0007", file: "prospects_DE_Q3.xlsx", bu: "DE", by: "K. Weber", when: "22 Aug 2026", rows: 44, ok: 38, bad: 6, status: "Validated — awaiting commit" },
  { id: "BATCH-0004", file: "prospects_NO_Q3.xlsx", bu: "NO", by: "L. Berg", when: "10 Aug 2026", rows: 30, ok: 27, bad: 3, status: "Committed" },
  { id: "BATCH-0002", file: "prospects_UK_Q2.xlsx", bu: "UK", by: "R. Patel", when: "14 Jul 2026", rows: 22, ok: 22, bad: 0, status: "Committed" },
];

export const BATCH_RECORDS: BatchRecord[] = [
  { batch: "BATCH-0007", row: 2, company: "Bergstrasse TMT", res: "Accepted", reason: "—" },
  { batch: "BATCH-0007", row: 3, company: "—", res: "Rejected", reason: "Company name empty" },
  { batch: "BATCH-0007", row: 4, company: "Delta Retail Group", res: "Rejected", reason: "Duplicate — matches existing prospect PRS-UK-00013 (name + BU)" },
  { batch: "BATCH-0007", row: 5, company: "Ruhr Chemicals", res: "Rejected", reason: "Sector code missing — must match the governed Industry list" },
  { batch: "BATCH-0007", row: 6, company: "Weser Logistik", res: "Rejected", reason: "Owner not a provisioned user in this BU" },
  { batch: "BATCH-0007", row: 7, company: "Elbe Retail", res: "Rejected", reason: "Estimated TCV is not numeric" },
  { batch: "BATCH-0007", row: 8, company: "Spree Manufacturing", res: "Rejected", reason: "Country supplied for a BU that is not split" },
  { batch: "BATCH-0004", row: 2, company: "Nordkraft Energy", res: "Accepted", reason: "—" },
  { batch: "BATCH-0004", row: 3, company: "CopenTech Automotive", res: "Accepted", reason: "—" },
  { batch: "BATCH-0004", row: 4, company: "—", res: "Rejected", reason: "Company name empty" },
];

export const OPPS: Opp[] = [
  { id: "0061t00000AbdK2", n: "Rheinwerk Industrial — Cost Takeout Programme", acct: "Rheinwerk Industrial", bu: "DE", ind: "Manufacturing", val: 6.8, stage: "Proposal", own: "T. Schmidt", close: "15 Nov 2026", status: "Open", mm: true, sol: "SAP S/4 Migration", prob: 65, comp: "Accenture", pid: "PRS-DE-00042" },
  { id: "0061t00000CyzL9", n: "Midland Life Sciences — Digital Quality Platform", acct: "Midland Life Sciences", bu: "UK", ind: "Life Sciences", val: 7.5, stage: "Closed Won", own: "R. Patel", close: "20 Aug 2026", status: "Won", mm: true, sol: "Quality & Compliance Accelerator", prob: 100, comp: "—", pid: "PRS-UK-00019" },
  { id: "0061t00000DfeM3", n: "Nordkraft Energy — Grid Modernization", acct: "Nordkraft Energy", bu: "NO", ind: "E&U", val: 5.1, stage: "Discovery", own: "L. Berg", close: "10 Dec 2026", status: "Open", mm: false, sol: "—", prob: 30, comp: "TCS", country: "Norway" },
  { id: "0061t00000EghN4", n: "Delta Retail Group — Commerce Platform Renewal", acct: "Delta Retail Group", bu: "UK", ind: "Retail", val: 3.2, stage: "Qualify", own: "R. Patel", close: "28 Feb 2027", status: "Open", mm: false, sol: "Retail Commerce Accelerator", prob: 20, comp: "—" },
  { id: "0061t00000FhiO5", n: "Amstel Transport Group — Fleet Analytics", acct: "Amstel Transport Group", bu: "NL", ind: "Transport", val: 2.0, stage: "Negotiation", own: "M. de Vries", close: "30 Sep 2026", status: "Open", mm: true, sol: "Transport Analytics Suite", prob: 75, comp: "Infosys" },
];

export const SOLUTIONS: Solution[] = [
  { n: "SAP S/4 Migration", cls: "Cross-Business Line", tag: "ADM · CIS", mat: "Industrialized", cert: "Certified & Published", reuse: 18 },
  { n: "Quality & Compliance Accelerator", cls: "Industry", tag: "Life Sciences", mat: "Industrialized", cert: "Certified & Published", reuse: 11 },
  { n: "Retail Commerce Accelerator", cls: "Industry", tag: "Retail · CPG", mat: "In-Development", cert: "Submitted", reuse: 4 },
  { n: "Transport Analytics Suite", cls: "Industry", tag: "Transport", mat: "Industrialized", cert: "Certified & Published", reuse: 7 },
  { n: "Cyber Baseline", cls: "Cross-Business Line", tag: "Invent · CIS", mat: "Draft", cert: "Draft", reuse: 0 },
  { n: "Application Estate Modernization", cls: "Business Line", tag: "ADM", mat: "Industrialized", cert: "Certified & Published", reuse: 14 },
  { n: "Cost Takeout Diagnostic", cls: "Cross-Business Line", tag: "Invent", mat: "Industrialized", cert: "Certified & Published", reuse: 22 },
];

export const ASSETS: Asset[] = [
  { n: "S/4 migration blueprint", type: "Blueprint", ver: "v5", cert: "Certified & Published", sol: "SAP S/4 Migration", carve: true },
  { n: "SAP data migration accelerator", type: "Reusable template", ver: "v3", cert: "Certified & Published", sol: "SAP S/4 Migration", carve: true },
  { n: "Rheinwerk cost takeout case study", type: "Case study", ver: "v1", cert: "Certified & Published", sol: "Cost Takeout Diagnostic", carve: false },
  { n: "Quality accelerator solution deck", type: "Deck", ver: "v4", cert: "Certified & Published", sol: "Quality & Compliance Accelerator", carve: true },
  { n: "Retail commerce workshop pack", type: "Deck", ver: "v2", cert: "Submitted", sol: "Retail Commerce Accelerator", carve: false },
  { n: "Transport analytics RFP response", type: "RFP response", ver: "v1", cert: "Certified & Published", sol: "Transport Analytics Suite", carve: true },
  { n: "Application estate diagnostic template", type: "Reusable template", ver: "v2", cert: "Certified & Published", sol: "Application Estate Modernization", carve: true },
];

export const PLAY_TEMPLATES: PlayTemplate[] = [
  { n: "Cost Takeout Outreach", ch: "Email", steps: 5, sol: "Cost Takeout Diagnostic", status: "Active" },
  { n: "SAP Modernization Executive Play", ch: "Direct", steps: 4, sol: "SAP S/4 Migration", status: "Active" },
  { n: "Retail Commerce Webinar Series", ch: "Webinar", steps: 3, sol: "Retail Commerce Accelerator", status: "Active" },
  { n: "Quality Accelerator Reference Play", ch: "Direct", steps: 4, sol: "Quality & Compliance Accelerator", status: "Active" },
  { n: "Transport Analytics Nurture", ch: "Email", steps: 6, sol: "Transport Analytics Suite", status: "Active" },
];

export const CAMPAIGNS: Campaign[] = [
  { n: "DE Industrial — Cost Takeout Q3", bu: "DE", status: "Active", sol: "Cost Takeout Diagnostic", engine: "DE · Industrial", owner: "T. Schmidt", approver: "DE MM Leader", start: "15 Jul 2026", end: "30 Sep 2026", accts: 24, m: { reached: 18, outreach: 42, meetings: 11, pipe: 9.4, oppsGen: 3, wins: 0 }, signalDriven: true },
  { n: "UK Retail Commerce Push", bu: "UK", status: "Active", sol: "Retail Commerce Accelerator", engine: "—", owner: "R. Patel", approver: "UK MM Leader", start: "01 Aug 2026", end: "31 Oct 2026", accts: 16, m: { reached: 9, outreach: 20, meetings: 4, pipe: 3.2, oppsGen: 1, wins: 0 }, signalDriven: false },
  { n: "NL FoodCo Consolidation Tender", bu: "NL", status: "Review", sol: "Transport Analytics Suite", engine: "NL · Transport", owner: "M. de Vries", approver: "NL MM Leader", start: "01 Jun 2026", end: "31 Aug 2026", accts: 8, m: { reached: 8, outreach: 15, meetings: 6, pipe: 4.1, oppsGen: 2, wins: 2.0 }, signalDriven: true },
  { n: "Nordics ERP Modernization", bu: "NO", status: "Approved", sol: "SAP S/4 Migration", engine: "NO · Industrial", owner: "L. Berg", approver: "Nordics MM Leader", start: "10 Sep 2026", end: "20 Dec 2026", accts: 20, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0 }, signalDriven: true, country: "Norway" },
  { n: "UK Life Sciences Quality Play", bu: "UK", status: "Closed", sol: "Quality & Compliance Accelerator", engine: "—", owner: "R. Patel", approver: "UK MM Leader", start: "01 Mar 2026", end: "31 Jul 2026", accts: 10, m: { reached: 10, outreach: 24, meetings: 9, pipe: 7.5, oppsGen: 1, wins: 7.5 }, signalDriven: false },
  { n: "DE TMT Application Modernization", bu: "DE", status: "Planned", sol: "Application Estate Modernization", engine: "—", owner: "K. Weber", approver: "DE MM Leader", start: "15 Sep 2026", end: "15 Dec 2026", accts: 12, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0 }, signalDriven: false },
  { n: "Nordics Cyber Baseline Draft", bu: "NO", status: "Draft", sol: "Cyber Baseline", engine: "—", owner: "N. Holm", approver: "—", start: "—", end: "—", accts: 0, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0 }, signalDriven: false, country: "Denmark" },
  { n: "NL Transport Analytics Nurture", bu: "NL", status: "Paused", sol: "Transport Analytics Suite", engine: "NL · Transport", owner: "M. de Vries", approver: "NL MM Leader", start: "01 May 2026", end: "31 Oct 2026", accts: 14, m: { reached: 6, outreach: 11, meetings: 2, pipe: 2.0, oppsGen: 1, wins: 0 }, signalDriven: true },
];

export const UPLOADED_ACCTS: UploadedAcct[] = [
  { n: "Ruhr Chemicals", bu: "DE", sector: "Manufacturing", camp: "DE Industrial — Cost Takeout Q3", owner: "T. Schmidt", sf: "Not in Salesforce", conf: "High" },
  { n: "Weser Logistik", bu: "DE", sector: "Transport", camp: "DE Industrial — Cost Takeout Q3", owner: "T. Schmidt", sf: "Linked — 0011t00000XyZ12", conf: "Medium" },
  { n: "Elbe Retail", bu: "DE", sector: "Retail", camp: "DE Industrial — Cost Takeout Q3", owner: "T. Schmidt", sf: "Not in Salesforce", conf: "Low" },
  { n: "Spree Manufacturing", bu: "DE", sector: "Manufacturing", camp: "DE Industrial — Cost Takeout Q3", owner: "T. Schmidt", sf: "Not in Salesforce", conf: "High" },
  { n: "Aarhus Components", bu: "NO", sector: "Automotive", camp: "Nordics ERP Modernization", owner: "N. Holm", sf: "Not in Salesforce", conf: "Medium", country: "Denmark" },
];

export const CAMP_HISTORY: CampHistory[] = [
  { c: "DE Industrial — Cost Takeout Q3", when: "28 Aug 2026", who: "T. Schmidt", what: "Added 4 accounts from BATCH-0004 upload" },
  { c: "DE Industrial — Cost Takeout Q3", when: "14 Aug 2026", who: "DE MM Leader", what: "Status Planned → Approved → Active" },
  { c: "UK Retail Commerce Push", when: "01 Aug 2026", who: "R. Patel", what: "Campaign created and approved" },
  { c: "NL FoodCo Consolidation Tender", when: "29 Aug 2026", who: "BU Factory Leader", what: "Decision: bid taken, moved to Review" },
  { c: "Nordics ERP Modernization", when: "05 Sep 2026", who: "Nordics MM Leader", what: "Approved for launch 10 Sep 2026" },
];

export const PLAYBOOK_PARTS: [string, string][] = [
  ["Campaign Brief", "Why now, market context, objective and target segment"],
  ["Messaging & Narrative", "Story arc, proof points, three things a seller must land"],
  ["Buyer Personas", "Who buys, who blocks, what they care about, how they're measured"],
  ["Value Proposition", "Quantified outcome, value case model, reference wins"],
  ["Objection Handling", "Eight recurring objections and answers"],
];

export const ENGINES: Engine[] = [
  { n: "DE · Industrial", bu: "DE", clients: 24, rules: 5, sched: "Daily", signals: 31 },
  { n: "NL · Transport", bu: "NL", clients: 14, rules: 5, sched: "Daily", signals: 12 },
  { n: "NO · Industrial", bu: "NO", clients: 20, rules: 5, sched: "Weekly", signals: 9 },
  { n: "UK · Retail", bu: "UK", clients: 16, rules: 4, sched: "Daily", signals: 15 },
];

export const SIGNALS: Signal[] = [
  { bu: "DE", acct: "Rheinwerk Industrial", engine: "DE · Industrial", title: "Rheinwerk announces group-wide cost programme", src: "Press release", score: 94, sev: "High", status: "New", sum: "Public statement references an opex reduction target of 12% by FY27, aligned to our cost-takeout narrative." },
  { bu: "DE", acct: "Ruhr Chemicals", engine: "DE · Industrial", title: "SAP ECC end-of-support exposure flagged", src: "News", score: 88, sev: "High", status: "New", sum: "Trade press coverage of unmigrated SAP ECC estate ahead of 2027 support deadline." },
  { bu: "NL", acct: "FoodCo Rotterdam", engine: "NL · Transport", title: "Rotterdam consolidation tender published", src: "Tender database", score: 91, sev: "High", status: "Reviewed", sum: "Tender for logistics network consolidation published above €1M threshold; closes end of September." },
  { bu: "NO", acct: "Nordkraft Energy", engine: "NO · Industrial", title: "Nordkraft hiring surge in digital roles", src: "Job boards", score: 76, sev: "Medium", status: "New", sum: "15+ digital/IT roles posted in past 90 days, indicating an in-flight modernization programme." },
  { bu: "NO", acct: "Helsinki Financial Services", engine: "NO · Industrial", title: "New CIO appointed at Helsinki Financial Services", src: "Leadership changes", score: 72, sev: "Medium", status: "New", sum: "Leadership change increases likelihood of new technology mandate within first two quarters." },
  { bu: "UK", acct: "Delta Retail Group", engine: "UK · Retail", title: "Delta Retail Group Q2 earnings cite margin pressure", src: "Earnings call", score: 83, sev: "Medium", status: "Dismissed", sum: "Earnings call transcript references commerce platform investment to protect margin." },
  { bu: "DE", acct: "Bergstrasse TMT", engine: "DE · Industrial", title: "Bergstrasse TMT regulatory filing flags legacy ERP risk", src: "Regulator", score: 70, sev: "Medium", status: "New", sum: "Regulatory filing discloses application estate risk consistent with legacy ERP constraint pattern." },
];

export const CONNECTORS: Connector[] = [
  { n: "Open web search", type: "public_web", cred: "—", lic: "Public sources", active: true, used: "Radar · Agents" },
  { n: "Company news & press releases", type: "public_web", cred: "—", lic: "Public sources", active: true, used: "Radar" },
  { n: "Regulatory filings", type: "public_web", cred: "—", lic: "Public sources", active: true, used: "Radar" },
  { n: "Tender database (EU/TED)", type: "subscription", cred: "kv://mmf/ted-api-key", lic: "Seat-limited; no redistribution", active: true, used: "Radar" },
  { n: "Job boards / hiring feed", type: "subscription", cred: "kv://mmf/hiring-feed", lic: "Pending procurement review", active: false, used: "Radar" },
  { n: "Leadership change monitor", type: "public_web", cred: "—", lic: "Public sources", active: true, used: "Radar" },
  { n: "Salesforce (CRM)", type: "crm", cred: "kv://mmf/sfdc-jwt", lic: "Internal", active: true, used: "Data model · Agents" },
  { n: "Solutions & Assets index", type: "in_house", cred: "kv://mmf/sharepoint-app", lic: "Internal", active: true, used: "Agents (RAG)" },
];

export const AGENTS: Agent[] = [
  { n: "Client Intelligence", stage: "Prospecting", ic: "🔎", type: "Internal", status: "Published", ver: "v2.1", d: "Account briefing built from Salesforce, Radar signals and the open web.", grounding: ["Salesforce", "Radar signals", "Public web"] },
  { n: "Meeting Preparation", stage: "Engagement", ic: "📋", type: "Internal", status: "Published", ver: "v1.4", d: "Pre-meeting brief: context, attendees, talking points and likely objections.", grounding: ["Salesforce", "Solutions & Assets (RAG)", "Radar signals"] },
  { n: "RFP / Bid Summary", stage: "Bidding", ic: "📄", type: "External", status: "Published", ver: "v3.0", d: "Summarizes an RFP into requirements, fit assessment, risks and response outline.", grounding: ["Uploaded RFP", "Solutions & Assets (RAG)"] },
  { n: "Solutioning", stage: "Shaping", ic: "🧩", type: "Internal", status: "Published", ver: "v2.0", d: "Proposes a solution shape from Factory offers and certified assets.", grounding: ["Solutions & Assets (RAG)"] },
  { n: "Pre-Tender", stage: "Prospecting", ic: "⏳", type: "External", status: "In-Test", ver: "v0.9", d: "Positions ahead of an upcoming tender using public procurement signals.", grounding: ["Public web (tenders)", "Radar signals"] },
  { n: "Case Study", stage: "Shaping / Bidding", ic: "🏆", type: "Internal", status: "Published", ver: "v1.2", d: "Surfaces the most relevant proof points and drafts a tailored reference story.", grounding: ["Solutions & Assets (RAG)"] },
];

export const AGENT_USAGE: AgentUsage[] = [
  { n: "Client Intelligence", inv: 412, users: 61, rating: 4.4, outputs: 298, byBu: { UK: 120, DE: 140, NL: 60, NO: 92 }, lastUsed: "02 Sep 2026 08:10", byCountry: { Sweden: 30, Finland: 22, Norway: 25, Denmark: 15 }, byRole: { "Seller / Client Partner": 340, "Campaign Lead": 40, "BU MM (Business) Leader": 32 }, trend: "+18%", fb: "Cuts my pre-call research from an hour to ten minutes." },
  { n: "Meeting Preparation", inv: 355, users: 58, rating: 4.5, outputs: 270, byBu: { UK: 100, DE: 130, NL: 55, NO: 70 }, lastUsed: "01 Sep 2026 17:44", byCountry: { Sweden: 20, Finland: 18, Norway: 20, Denmark: 12 }, byRole: { "Seller / Client Partner": 300, "Solution Architect / SME": 35, "Campaign Lead": 20 }, trend: "+24%", fb: "The objection-handling section is spot on for CFO conversations." },
  { n: "Solutioning", inv: 190, users: 34, rating: 4.1, outputs: 140, byBu: { UK: 40, DE: 80, NL: 30, NO: 40 }, lastUsed: "31 Aug 2026 12:05", byCountry: { Sweden: 12, Finland: 10, Norway: 10, Denmark: 8 }, byRole: { "Solution Architect / SME": 120, "Seller / Client Partner": 50, "Campaign Lead": 20 }, trend: "+31%", fb: "Good starting shape, still needs SME polish before client use." },
  { n: "RFP / Bid Summary", inv: 88, users: 22, rating: 3.9, outputs: 60, byBu: { UK: 30, DE: 28, NL: 10, NO: 20 }, lastUsed: "29 Aug 2026 09:30", byCountry: { Sweden: 6, Finland: 4, Norway: 6, Denmark: 4 }, byRole: { "Seller / Client Partner": 40, "Solution Architect / SME": 30, "Campaign Lead": 18 }, trend: "+9%", fb: "Saves real time on long RFPs, requirement extraction is reliable." },
  { n: "Case Study", inv: 61, users: 19, rating: 4.0, outputs: 44, byBu: { UK: 15, DE: 20, NL: 8, NO: 18 }, lastUsed: "27 Aug 2026 15:12", byCountry: { Sweden: 5, Finland: 4, Norway: 5, Denmark: 4 }, byRole: { "Seller / Client Partner": 35, "Campaign Lead": 26 }, trend: "new", fb: "Found a reference I didn't know we had — very useful." },
  { n: "Pre-Tender", inv: 14, users: 6, rating: 3.6, outputs: 9, byBu: { UK: 4, DE: 5, NL: 2, NO: 3 }, lastUsed: "20 Aug 2026 10:02", byCountry: { Sweden: 1, Finland: 1, Norway: 1, Denmark: 0 }, byRole: { "Seller / Client Partner": 10, "Campaign Lead": 4 }, trend: "new", fb: "Promising for tender positioning but still In-Test — outputs need review." },
];

export const COUNCILS: Council[] = [
  { n: "Quarterly SBU Steering", cad: "Quarterly", scope: "SBU", next: "02 Oct 2026", chair: "SBU Factory Leader", dec: 4, act: 6 },
  { n: "Monthly BU GTM Squad", cad: "Monthly", scope: "BU", next: "05 Sep 2026", chair: "BU MM Leader", dec: 3, act: 8 },
  { n: "Weekly Deal & Solutions Review", cad: "Weekly", scope: "BU", next: "05 Sep 2026", chair: "BU Factory Leader", dec: 2, act: 5 },
];

export const MEETINGS: Meeting[] = [
  { council: "Monthly BU GTM Squad", date: "05 Aug 2026", att: "BU MM Leader, BU Factory Leader, Campaign Lead, 3 sellers", notes: "Reviewed Q3 campaign pipeline. Cost Takeout ahead of plan; Commerce Push behind on meetings. Agreed to move two sellers onto the tender response.", dec: 2, act: 3 },
  { council: "Weekly Deal & Solutions Review", date: "29 Aug 2026", att: "Solution Architect, 4 sellers, BU Factory Leader", notes: "Rheinwerk workshop pack reviewed and approved. Rotterdam tender: bid/no-bid taken as bid, subject to partner confirmation.", dec: 1, act: 2 },
  { council: "Quarterly SBU Steering", date: "03 Jul 2026", att: "SBU Factory Leader, 4 BU MM Leaders", notes: "Q3 objectives set per BU. Agreed the daily Salesforce sync cadence for MVP and deferred the Cyber Baseline solution to Q4.", dec: 3, act: 4 },
];

export const DECISIONS: Decision[] = [
  { d: "Approve SAP S/4 Wave 1 campaign for UK CPG", o: "UK MM Leader", dt: "28 Aug 2026", s: "Ratified", ref: "Campaign" },
  { d: "Certify Retail Commerce Accelerator at In-Development", o: "Factory S&A Lead", dt: "21 Aug 2026", s: "Ratified", ref: "Solution" },
  { d: "Bid on the Rotterdam FoodCo consolidation tender", o: "BU Factory Leader", dt: "29 Aug 2026", s: "Ratified", ref: "Prospect" },
  { d: "Defer Cyber Baseline solution to Q4", o: "SBU Factory Leader", dt: "03 Jul 2026", s: "Open", ref: "Solution" },
  { d: "Adopt daily Salesforce sync cadence for MVP", o: "SBU Factory Leader", dt: "03 Jul 2026", s: "Ratified", ref: "—" },
];

export const ACTIONS: ActionItem[] = [
  { a: "Finalize Q4 target accounts for the Industrial engine", o: "BU MM Leader", due: "12 Sep 2026", s: "Open" },
  { a: "Certify Retail Commerce Accelerator assets", o: "Factory S&A Lead", due: "19 Sep 2026", s: "Open" },
  { a: "Register the tender-database subscription source", o: "Factory Agentic Lead", due: "26 Sep 2026", s: "Open" },
  { a: "Confirm sector/segment taxonomy as reference data", o: "Admin", due: "30 Sep 2026", s: "Open" },
  { a: "Assemble the Rotterdam tender bid team", o: "BU Factory Leader", due: "04 Sep 2026", s: "Open" },
  { a: "Configure E&U engine subscription source", o: "Factory Agentic Lead", due: "22 Aug 2026", s: "Closed" },
];

export const RACI: [string, string, string, string, string][] = [
  ["Set BU quarterly objectives & targets", "BU MM Leader", "SBU Factory Leader", "BU Factory Leader", "Sellers"],
  ["Create & upload target prospects", "Seller", "BU MM Leader", "Campaign Lead", "BU Factory Leader"],
  ["Qualify & convert a prospect", "Seller", "BU MM Leader", "Solution Architect", "Campaign Lead"],
  ["Build & industrialize solutions/assets", "Solution Architect", "Factory S&A Lead", "BU Factory Leader", "BU MM Leader"],
  ["Certify & publish solution/asset", "Factory S&A Lead", "Factory S&A Lead", "Solution Architect", "BUs"],
  ["Configure radar engines & rules", "Factory Agentic Lead", "BU Factory Leader", "Sellers", "BU MM Leader"],
  ["Plan & approve a campaign", "Campaign Lead", "BU MM Leader", "Solution Architect", "Sellers"],
  ["Execute campaign / work accounts", "Seller", "Campaign Lead", "Factory Agentic Lead", "BU MM Leader"],
  ["Author/register & govern agents", "Factory Agentic Lead", "Factory Agentic Lead", "Admin", "Sellers"],
  ["Manage users, roles & connectors", "Admin", "Admin", "—", "All"],
];

export const MVP_OUTCOMES: [string, string][] = [
  ["MVP clearly supports the overall mid-market growth objectives, and the MVP scope is signed off by leadership", "Open"],
  ["Data quality, compliance and launch readiness confirmed", "Open"],
  ["No critical issues or gaps at go-live", "Open"],
];

export const REFDATA: [string, string, string][] = [
  ["Business Line", "CCA · PBS · ADM · CIS · Invent · DCX · I&D · Sogeti", "Locked"],
  ["Industry / sector", "Manufacturing · Retail · CPG · Automotive · TMT · E&U · Transport · Financial Services · Life Sciences", "Open — action A4"],
  ["Segment", "Mid-market revenue bands within €500M–€3B", "Open — action A4"],
  ["Prospect lifecycle stage", "Target Identified · Research · Outreach · Meetings Scheduled / Delivered · Qualified Lead · Converted to Opportunity", "Locked"],
  ["Prospect source", "Single form · Excel upload · Radar signal · Campaign", "Locked"],
  ["Campaign status", "Draft · Planned · Approved · Active · Paused · Closed · Review", "Locked"],
  ["Solution class", "Industry · Business Line · Cross-Business Line", "Locked"],
  ["Certification status", "Draft · Submitted · Certified & Published", "Locked"],
  ["Signal status", "New · Reviewed · Dismissed", "Locked"],
];

export const KPI_DEFS: [string, string, string, string][] = [
  ["Qualified pipeline", "€", "Sum of open MM-Factory-classified opportunities in scope", "BU · Country · Campaign"],
  ["Revenue booked", "€", "Sum of closed-won MM-Factory-classified opportunities in scope", "BU · Country · Campaign"],
  ["Coverage", "%", "Target accounts with an interaction or open opportunity ÷ target accounts", "BU · Country"],
  ["% Industrialized", "%", "Reuse events on certified assets ÷ total asset usage", "BU · SBU"],
  ["Outreach activities completed", "#", "ProspectInteraction records of type outreach or call in the period", "BU · Country · Campaign · Seller"],
  ["Meetings secured", "#", "ProspectInteraction records of type meeting scheduled or delivered", "BU · Country · Campaign · Seller"],
  ["Opportunities created", "#", "ProspectOpportunityLink records created in the period", "BU · Country · Campaign"],
  ["Campaign stage conversion", "%", "CampaignAccount progression between adjacent stages", "Campaign"],
  ["Signal → opportunity conversion", "%", "Signals whose account opened an opportunity within the attribution window", "BU · Engine"],
  ["Agent adoption", "#", "Distinct users invoking an agent in the period", "BU · Country · Agent"],
];

export const AUDIT: { t: string; u: string; a: string; e: string }[] = [
  { t: "02 Sep 2026 09:14", u: "R. Patel", a: "Upload validated", e: "BATCH-0007 · 38 accepted, 6 rejected" },
  { t: "01 Sep 2026 16:42", u: "K. Weber", a: "Prospect converted", e: "PRS-DE-00042 → 0061t00000AbdK2" },
  { t: "01 Sep 2026 11:07", u: "System", a: "Salesforce sync", e: "Accounts 412 upserted · Opportunities 268 upserted" },
  { t: "31 Aug 2026 17:55", u: "T. Schmidt", a: "Campaign edited", e: "DE Industrial — Cost Takeout Q3 · 4 accounts added" },
  { t: "29 Aug 2026 14:20", u: "Factory S&A Lead", a: "Asset published", e: "S/4 migration blueprint v5" },
  { t: "28 Aug 2026 08:31", u: "Admin", a: "Connector deactivated", e: "Job boards / hiring feed — pending procurement review" },
];

export const KPI: Record<string, KpiSet> = {
  UK: { pipeline: 18.4, revenue: 9.1, coverage: 61, reuse: 48, signals: 15, conv: 22, outreach: 96, meetings: 34, oppsCreated: 9, stageConv: 38, pTarget: 22, rTarget: 12, cTarget: 70 },
  DE: { pipeline: 26.7, revenue: 12.3, coverage: 58, reuse: 54, signals: 31, conv: 26, outreach: 142, meetings: 47, oppsCreated: 13, stageConv: 41, pTarget: 28, rTarget: 15, cTarget: 65 },
  NL: { pipeline: 10.2, revenue: 6.4, coverage: 66, reuse: 39, signals: 12, conv: 19, outreach: 58, meetings: 21, oppsCreated: 6, stageConv: 33, pTarget: 12, rTarget: 7, cTarget: 70 },
  NO: { pipeline: 15.9, revenue: 5.8, coverage: 49, reuse: 31, signals: 9, conv: 17, outreach: 71, meetings: 26, oppsCreated: 7, stageConv: 29, pTarget: 20, rTarget: 9, cTarget: 60 },
};

export const KPI_COUNTRY: Record<string, KpiSet> = {
  Sweden: { pipeline: 5.1, revenue: 1.8, coverage: 52, reuse: 28, signals: 3, conv: 15, outreach: 22, meetings: 8, oppsCreated: 2, stageConv: 27, pTarget: 6, rTarget: 3, cTarget: 60 },
  Finland: { pipeline: 3.9, revenue: 1.4, coverage: 47, reuse: 26, signals: 2, conv: 14, outreach: 17, meetings: 6, oppsCreated: 2, stageConv: 25, pTarget: 5, rTarget: 2, cTarget: 60 },
  Norway: { pipeline: 4.4, revenue: 1.7, coverage: 51, reuse: 33, signals: 3, conv: 19, outreach: 20, meetings: 8, oppsCreated: 2, stageConv: 31, pTarget: 5, rTarget: 2.5, cTarget: 60 },
  Denmark: { pipeline: 2.5, revenue: 0.9, coverage: 45, reuse: 30, signals: 1, conv: 18, outreach: 12, meetings: 4, oppsCreated: 1, stageConv: 30, pTarget: 4, rTarget: 1.5, cTarget: 60 },
};

export const NAV: { id: string; label: string; ico: string; sect?: string }[] = [
  { id: "dashboard", label: "Dashboard", ico: "📊" },
  { id: "prospects", label: "Prospects", ico: "🎯" },
  { id: "campaigns", label: "Campaigns", ico: "📣" },
  { id: "solutions", label: "Solutions & Assets", ico: "🧩" },
  { id: "radar", label: "Triggers Radar", ico: "📡" },
  { id: "agents", label: "Smart Agents", ico: "🤖" },
  { id: "governance", label: "Governance", ico: "🏛️" },
  { id: "admin", label: "Admin", ico: "⚙️" },
  { id: "scope", label: "MVP scope", ico: "ℹ️", sect: "About" },
];

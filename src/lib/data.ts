import type {
  BU, Role, PortalView, Account, Prospect, Interaction, Batch, BatchRecord, Opp, Solution, Asset,
  PlayTemplate, Campaign, UploadedAcct, CampHistory, Engine, Signal, Connector, Agent, AgentUsage,
  Council, Meeting, Decision, ActionItem, KpiSet, PartnerPlay,
} from "./types";

export const BUS: BU[] = [
  { code: "UK", name: "UK", hasCountries: false },
  { code: "DE", name: "Germany", hasCountries: false },
  { code: "NL", name: "Netherlands", hasCountries: false },
  { code: "NO", name: "Nordics", hasCountries: true, countries: ["Sweden", "Finland", "Norway", "Denmark"] },
];

export const ROLES: Role[] = [
  { n: "SBU Factory Leader", rights: "Full read across all BUs and countries; approves SBU-level decisions; no write access to BU-level operational records.", view: "Leadership" },
  { n: "Country MM Leader", rights: "Owns country mid-market objectives, target accounts and campaign outcomes.", view: "Leadership" },
  { n: "Seller / Client Partner", rights: "Read/write on own prospects, accounts, interactions and Smart Agents; read on campaigns/solutions/radar in their BU.", view: "Seller" },
  { n: "Campaign Lead", rights: "Read/write on campaigns and playbooks; read on prospects, solutions, radar.", view: "Factory / Operations" },
  { n: "Factory Agentic Lead", rights: "Read/write on Triggers Radar and Smart Agents; registers data sources.", view: "Factory / Operations" },
  { n: "Factory S&A Lead", rights: "Read/write on solutions and assets; exclusive right to certify and publish.", view: "Factory / Operations" },
];

export const PVIEWS: Record<string, PortalView> = {
  "Leadership": { d: "Executive performance, country roll-ups, objectives and pipeline outcomes.", nav: ["dashboard", "pipeline", "campaigns"] },
  "Factory / Operations": { d: "Campaign, prospect, asset, trigger and agent operations.", nav: ["dashboard", "pipeline", "campaigns", "solutions", "radar", "agents"] },
  "Seller": { d: "Assigned prospects/accounts, signals, interactions, campaigns, opportunities and Smart Agents.", nav: ["dashboard", "pipeline", "campaigns", "solutions", "radar", "agents"] },
};

export const MODULES = ["Prospects", "Campaigns", "Solutions & Assets", "Triggers Radar", "Dashboard", "Smart Agents"];

export const PERMS: Record<string, string[]> = {
  "SBU Factory Leader": ["R", "R", "R", "R", "R", "R"],
  "Country MM Leader": ["RW", "RW", "R", "R", "R", "R"],
  "Seller / Client Partner": ["RW", "R", "R", "R", "R", "RW"],
  "Campaign Lead": ["R", "RW", "R", "R", "R", "R"],
  "Factory Agentic Lead": ["R", "R", "R", "RW", "R", "RW"],
  "Factory S&A Lead": ["R", "R", "RW", "R", "R", "R"],
};

export const PSTAGES = ["Target / Identified", "Research", "Outreach", "Meeting Scheduled", "Meeting Delivered", "Qualified Lead", "Converted to CRM"];
export const PSOURCES = ["Upload", "Radar trigger", "Manual", "Campaign"];
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
  { n: "Van Oord Logistics", bu: "NL", sector: "Transport", tier: 1, owner: "J. Bakker", src: "Portal upload" },
  { n: "Delft Mobility", bu: "NL", sector: "Automotive", tier: 2, owner: "M. Jansen", src: "Salesforce" },
  { n: "Rotterdam FoodCo", bu: "NL", sector: "CPG", tier: 1, owner: "S. de Vries", src: "Portal upload" },
  { n: "Amstel Retail Group", bu: "NL", sector: "Retail", tier: 2, owner: "J. Bakker", src: "Salesforce" },
  { n: "BavariaTech GmbH", bu: "DE", sector: "TMT", tier: 2, owner: "K. Weber", src: "Salesforce" },
  { n: "NordChem", bu: "DE", sector: "E&U", tier: 1, owner: "T. Schmidt", src: "Salesforce" },
  { n: "Munich Retail Group", bu: "DE", sector: "Retail", tier: 2, owner: "T. Schmidt", src: "Salesforce" },
  { n: "Thames Utilities", bu: "UK", sector: "E&U", tier: 1, owner: "R. Patel", src: "Salesforce" },
  { n: "Pennine Manufacturing", bu: "UK", sector: "Manufacturing", tier: 2, owner: "R. Patel", src: "Salesforce" },
  { n: "Nordic Steel AB", bu: "NO", sector: "Manufacturing", tier: 1, owner: "A. Lindqvist", src: "Salesforce", country: "Sweden" },
  { n: "Vasa Retail AB", bu: "NO", sector: "Retail", tier: 2, owner: "A. Lindqvist", src: "Salesforce", country: "Sweden" },
  { n: "Suomi Paper Oyj", bu: "NO", sector: "Manufacturing", tier: 1, owner: "M. Virtanen", src: "Salesforce", country: "Finland" },
  { n: "Helsinki HealthTech", bu: "NO", sector: "Life Sciences", tier: 2, owner: "M. Virtanen", src: "Salesforce", country: "Finland" },
  { n: "Fjord Energy ASA", bu: "NO", sector: "E&U", tier: 1, owner: "E. Hansen", src: "Salesforce", country: "Norway" },
  { n: "Copenhagen Logistics", bu: "NO", sector: "Transport", tier: 2, owner: "N. Sørensen", src: "Salesforce", country: "Denmark" },
];

export const PROSPECTS: Prospect[] = [
  { id: "PRS-UK-00013", n: "Delta Retail Group", bu: "UK", ind: "Retail", tcv: 3.2, st: 4, own: "R. Patel", sign: "Q1-2027", src: "Manual", batch: "—", qual: "Qualified" },
  { id: "PRS-DE-00042", n: "Rheinwerk Industrial", bu: "DE", ind: "Manufacturing", tcv: 6.8, st: 6, own: "T. Schmidt", sign: "Q4-2026", src: "Campaign", batch: "—", qual: "Converted", oppId: "0061t00000AbdK2" },
  { id: "PRS-NL-00007", n: "FoodCo Rotterdam", bu: "NL", ind: "CPG", tcv: 4.1, st: 3, own: "M. de Vries", sign: "Q1-2027", src: "Radar trigger", batch: "—", qual: "Engaged" },
  { id: "PRS-DE-00058", n: "Bergstrasse TMT", bu: "DE", ind: "TMT", tcv: 1.9, st: 1, own: "K. Weber", sign: "Q2-2027", src: "Upload", batch: "BATCH-0007", qual: "In research" },
  { id: "PRS-NO-00021", n: "Nordkraft Energy", bu: "NO", ind: "E&U", tcv: 5.4, st: 2, own: "L. Berg", sign: "Q1-2027", src: "Upload", batch: "BATCH-0004", qual: "Contacted", country: "Norway" },
  { id: "PRS-NO-00033", n: "Baltic Freight Lines", bu: "NO", ind: "Transport", tcv: 2.6, st: 0, own: "S. Lindqvist", sign: "Q3-2027", src: "Manual", batch: "—", qual: "Identified", country: "Sweden" },
  { id: "PRS-NO-00045", n: "Helsinki Financial Services", bu: "NO", ind: "Financial Services", tcv: 3.9, st: 4, own: "A. Koskinen", sign: "Q4-2026", src: "Radar trigger", batch: "—", qual: "Qualified", country: "Finland" },
  { id: "PRS-NO-00051", n: "CopenTech Automotive", bu: "NO", ind: "Automotive", tcv: 2.1, st: 1, own: "N. Holm", sign: "Q2-2027", src: "Upload", batch: "BATCH-0004", qual: "In research", country: "Denmark" },
  { id: "PRS-UK-00019", n: "Midland Life Sciences", bu: "UK", ind: "Life Sciences", tcv: 7.5, st: 6, own: "R. Patel", sign: "Q3-2026", src: "Campaign", batch: "—", qual: "Converted", oppId: "0061t00000CyzL9" },
  { id: "PRS-NL-00012", n: "Amstel Transport Group", bu: "NL", ind: "Transport", tcv: 1.4, st: 2, own: "M. de Vries", sign: "Q2-2027", src: "Manual", batch: "—", qual: "Contacted" },
  { id: "PRS-NL-00021", n: "Van Oord Logistics", bu: "NL", ind: "Transport", tcv: 2.4, st: 0, own: "J. Bakker", sign: "Q1-2027", src: "Upload", batch: "BATCH-0005", qual: "Identified" },
  { id: "PRS-NL-00022", n: "Amstel Retail Group", bu: "NL", ind: "Retail", tcv: 1.8, st: 2, own: "J. Bakker", sign: "Q4-2026", src: "Campaign", batch: "—", qual: "Contacted" },
  { id: "PRS-NL-00024", n: "Rotterdam FoodCo", bu: "NL", ind: "CPG", tcv: 3.1, st: 4, own: "S. de Vries", sign: "Q4-2026", src: "Radar trigger", batch: "—", qual: "Engaged" },
  { id: "PRS-NL-00027", n: "Zuid Water Board", bu: "NL", ind: "E&U", tcv: 1.2, st: 1, own: "S. de Vries", sign: "Q2-2027", src: "Upload", batch: "BATCH-0005", qual: "In research" },
  { id: "PRS-NL-00029", n: "Haarlem Insurance", bu: "NL", ind: "Financial Services", tcv: 2.9, st: 5, own: "J. Bakker", sign: "Q4-2026", src: "Manual", batch: "—", qual: "Qualified" },
  { id: "PRS-NL-00030", n: "Eindhoven Devices BV", bu: "NL", ind: "Manufacturing", tcv: 4.2, st: 3, own: "M. Jansen", sign: "Q1-2027", src: "Campaign", batch: "—", qual: "Engaged" },
  { id: "PRS-DE-00045", n: "BavariaTech GmbH", bu: "DE", ind: "TMT", tcv: 2.1, st: 2, own: "K. Weber", sign: "Q1-2027", src: "Upload", batch: "BATCH-0004", qual: "Contacted" },
  { id: "PRS-DE-00048", n: "Sachsen Logistik", bu: "DE", ind: "Transport", tcv: 1.7, st: 0, own: "T. Schmidt", sign: "Q2-2027", src: "Upload", batch: "BATCH-0004", qual: "Identified" },
  { id: "PRS-DE-00051", n: "Munich Retail Group", bu: "DE", ind: "Retail", tcv: 3.4, st: 4, own: "T. Schmidt", sign: "Q4-2026", src: "Campaign", batch: "—", qual: "Engaged" },
  { id: "PRS-UK-00016", n: "Thames Utilities", bu: "UK", ind: "E&U", tcv: 4.8, st: 5, own: "R. Patel", sign: "Q4-2026", src: "Radar trigger", batch: "—", qual: "Qualified" },
  { id: "PRS-UK-00019", n: "Mersey Care Group", bu: "UK", ind: "Life Sciences", tcv: 1.4, st: 3, own: "L. Murray", sign: "Q2-2027", src: "Manual", batch: "—", qual: "Engaged" },
  { id: "PRS-SE-00007", n: "Vasa Retail AB", bu: "NO", ind: "Retail", tcv: 2.0, st: 2, own: "A. Lindqvist", sign: "Q1-2027", src: "Upload", batch: "BATCH-0006", qual: "Contacted", country: "Sweden" },
  { id: "PRS-SE-00009", n: "Nordic Steel AB", bu: "NO", ind: "Manufacturing", tcv: 3.6, st: 4, own: "A. Lindqvist", sign: "Q4-2026", src: "Campaign", batch: "—", qual: "Engaged", country: "Sweden" },
  { id: "PRS-FI-00004", n: "Suomi Paper Oyj", bu: "NO", ind: "Manufacturing", tcv: 2.8, st: 5, own: "M. Virtanen", sign: "Q4-2026", src: "Radar trigger", batch: "—", qual: "Qualified", country: "Finland" },
  { id: "PRS-FI-00006", n: "Helsinki HealthTech", bu: "NO", ind: "Life Sciences", tcv: 1.1, st: 1, own: "M. Virtanen", sign: "Q2-2027", src: "Upload", batch: "BATCH-0006", qual: "In research", country: "Finland" },
  { id: "PRS-NO-00003", n: "Fjord Energy ASA", bu: "NO", ind: "E&U", tcv: 3.9, st: 3, own: "E. Hansen", sign: "Q1-2027", src: "Manual", batch: "—", qual: "Engaged", country: "Norway" },
  { id: "PRS-DK-00002", n: "Copenhagen Logistics", bu: "NO", ind: "Transport", tcv: 1.6, st: 2, own: "N. Sørensen", sign: "Q1-2027", src: "Upload", batch: "BATCH-0006", qual: "Contacted", country: "Denmark" },
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
  { id: "OPP-4471203", n: "Rheinwerk — SAP S/4 migration", acct: "Rheinwerk AG", bu: "DE", ind: "Manufacturing", val: 8.2, stage: "Proposal", own: "K. Weber", close: "12 Dec 2026", status: "Open", mm: true, sol: "SAP S/4 Migration", prob: 60, comp: "Accenture", pid: "PRS-DE-00042" },
  { id: "OPP-4471884", n: "Rheinwerk — IT cost takeout", acct: "Rheinwerk AG", bu: "DE", ind: "Manufacturing", val: 3.4, stage: "Discovery", own: "K. Weber", close: "28 Feb 2027", status: "Open", mm: true, sol: "Application Managed Services", prob: 35, comp: "—" },
  { id: "OPP-4472019", n: "BavariaTech — Cloud migration", acct: "BavariaTech GmbH", bu: "DE", ind: "TMT", val: 4.1, stage: "Qualify", own: "K. Weber", close: "30 Apr 2027", status: "Open", mm: false, sol: "Cloud Landing Zone", prob: 20, comp: "Capita" },
  { id: "OPP-4470551", n: "NordChem — Data platform", acct: "NordChem", bu: "DE", ind: "E&U", val: 6.0, stage: "Proposal", own: "T. Schmidt", close: "15 Nov 2026", status: "Open", mm: true, sol: "Data & AI Platform", prob: 75, comp: "Atos" },
  { id: "OPP-4469902", n: "NordChem — Managed services", acct: "NordChem", bu: "DE", ind: "E&U", val: 5.2, stage: "Closed Won", own: "T. Schmidt", close: "02 Jul 2026", status: "Won", mm: true, sol: "Application Managed Services", prob: 100, comp: "—" },
  { id: "OPP-4473310", n: "Delft Mobility — ADM reboot", acct: "Delft Mobility", bu: "NL", ind: "Automotive", val: 4.7, stage: "Negotiation", own: "M. Jansen", close: "20 Jan 2027", status: "Open", mm: true, sol: "Application Managed Services", prob: 45, comp: "Sopra Steria" },
  { id: "OPP-4473455", n: "Amstel Retail — Commerce revamp", acct: "Amstel Retail Group", bu: "NL", ind: "Retail", val: 2.9, stage: "Discovery", own: "J. Bakker", close: "15 Mar 2027", status: "Open", mm: true, sol: "Commerce", prob: 30, comp: "Valtech" },
  { id: "OPP-4473501", n: "Rotterdam FoodCo — Vendor consolidation", acct: "Rotterdam FoodCo", bu: "NL", ind: "CPG", val: 3.3, stage: "Qualify", own: "S. de Vries", close: "30 Apr 2027", status: "Open", mm: true, sol: "Vendor Consolidation", prob: 20, comp: "—", pid: "PRS-NL-00024" },
  { id: "OPP-4468120", n: "Albion — SAP S/4", acct: "Albion Foods", bu: "UK", ind: "CPG", val: 5.5, stage: "Negotiation", own: "R. Patel", close: "10 Feb 2027", status: "Open", mm: true, sol: "ERP Modernization", prob: 45, comp: "IBM" },
  { id: "OPP-4468344", n: "Thames — Grid analytics", acct: "Thames Utilities", bu: "UK", ind: "E&U", val: 3.8, stage: "Qualify", own: "R. Patel", close: "28 May 2027", status: "Open", mm: true, sol: "Data & AI Platform", prob: 20, comp: "—", pid: "PRS-UK-00016" },
  { id: "OPP-4466780", n: "Nordic Steel — Smart factory", acct: "Nordic Steel AB", bu: "NO", ind: "Manufacturing", val: 4.4, stage: "Proposal", own: "A. Lindqvist", close: "18 Dec 2026", status: "Open", mm: true, sol: "Smart Factory", prob: 60, comp: "Tietoevry", country: "Sweden" },
  { id: "OPP-4466991", n: "Suomi Paper — ADM consolidation", acct: "Suomi Paper Oyj", bu: "NO", ind: "Manufacturing", val: 3.0, stage: "Qualify", own: "M. Virtanen", close: "12 Jun 2027", status: "Open", mm: true, sol: "Application Managed Services", prob: 20, comp: "Tietoevry", country: "Finland", pid: "PRS-FI-00004" },
  { id: "OPP-4467220", n: "Fjord Energy — Cloud foundation", acct: "Fjord Energy ASA", bu: "NO", ind: "E&U", val: 2.6, stage: "Discovery", own: "E. Hansen", close: "22 Mar 2027", status: "Open", mm: false, sol: "Cloud Landing Zone", prob: 35, comp: "Sopra Steria", country: "Norway" },
  { id: "OPP-4467401", n: "Copenhagen Logistics — Modernization", acct: "Copenhagen Logistics", bu: "NO", ind: "Transport", val: 2.1, stage: "Negotiation", own: "N. Sørensen", close: "05 Feb 2027", status: "Open", mm: true, sol: "Enterprise Technology Modernization", prob: 45, comp: "—", country: "Denmark" },
];

export const SOLUTIONS: Solution[] = [
  { n: "IT Cost Takeout", cls: "Cross-BL", tag: "ADM · CIS", mat: "Industrialized", cert: "Certified & Published", reuse: 34 },
  { n: "ADM Reboot Play", cls: "Business Line", tag: "ADM", mat: "Industrialized", cert: "Certified & Published", reuse: 26 },
  { n: "SAP S/4 Rapid Migration", cls: "Business Line", tag: "ADM", mat: "Industrialized", cert: "Certified & Published", reuse: 41 },
  { n: "Hyperscaler Landing Zone", cls: "Cross-BL", tag: "CIS · I&D", mat: "Industrialized", cert: "Certified & Published", reuse: 28 },
  { n: "Manufacturing Smart Factory", cls: "Industry", tag: "CIS", mat: "Industrialized", cert: "Certified & Published", reuse: 22 },
  { n: "Retail Commerce Accelerator", cls: "Industry", tag: "DCX", mat: "In-Development", cert: "Submitted", reuse: 9 },
  { n: "E&U Grid Data Platform", cls: "Industry", tag: "I&D", mat: "Industrialized", cert: "Certified & Published", reuse: 15 },
  { n: "Vendor Consolidation Play", cls: "Cross-BL", tag: "ADM · CIS", mat: "In-Development", cert: "Submitted", reuse: 12 },
  { n: "Cyber Baseline for Mid-Market", cls: "Cross-BL", tag: "CIS", mat: "Draft", cert: "Draft", reuse: 3 },
];

export const ASSETS: Asset[] = [
  { n: "IT Cost Takeout — value case model", type: "Template", ver: "v3", cert: "Certified & Published", sol: "IT Cost Takeout", carve: true, bl: "ADM", th: "IT Cost Takeout", repo: "TLC", reuse: 34 },
  { n: "ADM Reboot — solution blueprint", type: "Blueprint", ver: "v2", cert: "Certified & Published", sol: "ADM Reboot Play", carve: true, bl: "ADM", th: "Enterprise Technology Modernization", repo: "Export", reuse: 21 },
  { n: "Vendor consolidation battle card", type: "Battle card", ver: "v1", cert: "Certified & Published", sol: "Vendor Consolidation Play", carve: false, bl: "ADM", th: "Vendor Consolidation", repo: "MSDT", reuse: 12 },
  { n: "SAP S/4 rapid migration — pitch deck", type: "Deck", ver: "v4", cert: "Certified & Published", sol: "SAP S/4 Rapid Migration", carve: true, bl: "ADM", th: "SAP / Cloud", repo: "TLC", reuse: 41 },
  { n: "Mid-market ADM sales kit", type: "Sales kit", ver: "v2", cert: "Submitted", sol: "ADM Reboot Play", carve: false, bl: "ADM", th: "Enterprise Technology Modernization", repo: "Marketing", reuse: 6 },
  { n: "Hyperscaler landing zone — blueprint", type: "Blueprint", ver: "v3", cert: "Certified & Published", sol: "Hyperscaler Landing Zone", carve: true, bl: "CIS", th: "SAP / Cloud", repo: "Export", reuse: 28 },
  { n: "Smart factory — reference architecture", type: "Blueprint", ver: "v2", cert: "Certified & Published", sol: "Manufacturing Smart Factory", carve: true, bl: "CIS", th: "Sector play", repo: "Export", reuse: 22 },
  { n: "Cyber baseline for mid-market — offer 1-pager", type: "Template", ver: "v1", cert: "Draft", sol: "Cyber Baseline for Mid-Market", carve: false, bl: "CIS", th: "Cybersecurity", repo: "Marketing", reuse: 3 },
  { n: "Grid data platform — case study", type: "Case study", ver: "v1", cert: "Certified & Published", sol: "E&U Grid Data Platform", carve: true, bl: "I&D", th: "Data & AI", repo: "Proposal", reuse: 15 },
  { n: "Data & AI readiness assessment", type: "Template", ver: "v2", cert: "Certified & Published", sol: "E&U Grid Data Platform", carve: true, bl: "I&D", th: "Data & AI", repo: "TLC", reuse: 18 },
  { n: "Commerce accelerator — demo pack", type: "Deck", ver: "v2", cert: "Certified & Published", sol: "Retail Commerce Accelerator", carve: false, bl: "DCX", th: "Sector play", repo: "MSDT", reuse: 9 },
  { n: "Retail commerce — RFP response library", type: "RFP response", ver: "v3", cert: "Certified & Published", sol: "Retail Commerce Accelerator", carve: true, bl: "DCX", th: "Sector play", repo: "Proposal", reuse: 11 },
  { n: "Mid-market transformation thesis", type: "Deck", ver: "v1", cert: "Submitted", sol: "ADM Reboot Play", carve: false, bl: "Invent", th: "Enterprise Technology Modernization", repo: "Export", reuse: 4 },
  { n: "Customer experience diagnostic", type: "Template", ver: "v1", cert: "Certified & Published", sol: "Retail Commerce Accelerator", carve: true, bl: "CCA", th: "Sector play", repo: "TLC", reuse: 7 },
  { n: "Managed testing for mid-market", type: "Deck", ver: "v2", cert: "Certified & Published", sol: "ADM Reboot Play", carve: false, bl: "Sogeti", th: "Enterprise Technology Modernization", repo: "Marketing", reuse: 8 },
];

export const PARTNER_PLAYS: PartnerPlay[] = [
  { n: "SAP RISE for Mid-Market", p: "SAP", tier: "Platinum", bl: "ADM", th: "SAP / Cloud", countries: ["NL", "DE", "UK", "SE", "FI"], status: "Active", vp: "Fixed-scope RISE migration with Capgemini mid-market accelerators and SAP funding support.", pipe: 9.4, campaigns: 3, owner: "S. de Vries" },
  { n: "AWS Landing Zone Fast Start", p: "AWS", tier: "Premier", bl: "CIS", th: "SAP / Cloud", countries: ["DE", "UK", "NO", "DK"], status: "Active", vp: "Six-week landing zone with AWS MAP funding; ideal entry play for new logos.", pipe: 6.7, campaigns: 3, owner: "K. Weber" },
  { n: "Microsoft Data & AI Jumpstart", p: "Microsoft", tier: "Premier", bl: "I&D", th: "Data & AI", countries: ["NL", "DE", "UK", "SE", "FI", "NO", "DK"], status: "Active", vp: "Fabric-based data platform starter with joint Microsoft investment and a four-week proof of value.", pipe: 8.1, campaigns: 4, owner: "L. Murray" },
  { n: "Adobe Commerce for Mid-Market Retail", p: "Adobe", tier: "Gold", bl: "DCX", th: "Sector play", countries: ["NL", "DE", "SE"], status: "Active", vp: "Pre-configured commerce stack for mid-market retailers with Adobe co-marketing.", pipe: 4.2, campaigns: 3, owner: "J. Bakker" },
  { n: "Siemens Smart Factory Accelerator", p: "Siemens", tier: "Gold", bl: "CIS", th: "Sector play", countries: ["DE", "SE"], status: "Active", vp: "OT/IT convergence play for discrete manufacturers, co-delivered with Siemens.", pipe: 5.3, campaigns: 2, owner: "A. Lindqvist" },
  { n: "ServiceNow ITSM Consolidation", p: "ServiceNow", tier: "Gold", bl: "ADM", th: "Vendor Consolidation", countries: ["NL", "UK"], status: "Active", vp: "Consolidate fragmented tooling onto a single ITSM platform with a strong cost-takeout narrative.", pipe: 3.1, campaigns: 2, owner: "M. Jansen" },
  { n: "Google Cloud Modernization Sprint", p: "Google Cloud", tier: "Silver", bl: "CIS", th: "Enterprise Technology Modernization", countries: ["UK", "DK"], status: "Draft", vp: "Application modernization sprint with Google funding, pending the mid-market pricing model.", pipe: 0, campaigns: 0, owner: "R. Patel" },
];

export const PLAY_TEMPLATES: PlayTemplate[] = [
  { n: "Cost Takeout Outreach", ch: "Email", steps: 5, sol: "Cost Takeout Diagnostic", status: "Active" },
  { n: "SAP Modernization Executive Play", ch: "Direct", steps: 4, sol: "SAP S/4 Migration", status: "Active" },
  { n: "Retail Commerce Webinar Series", ch: "Webinar", steps: 3, sol: "Retail Commerce Accelerator", status: "Active" },
  { n: "Quality Accelerator Reference Play", ch: "Direct", steps: 4, sol: "Quality & Compliance Accelerator", status: "Active" },
  { n: "Transport Analytics Nurture", ch: "Email", steps: 6, sol: "Transport Analytics Suite", status: "Active" },
];

export const CAMPAIGNS: Campaign[] = [
  { n: "NL Industrial — IT Cost Takeout Q3", bu: "NL", status: "Active", sol: "IT Cost Takeout", engine: "NL · Industrial", owner: "S. de Vries", approver: "NL MM Leader", start: "01 Jul 2026", end: "23 Sep 2026", accts: 14, m: { reached: 9, outreach: 22, meetings: 7, pipe: 6.4, oppsGen: 3, wins: 0, targets: 14, engaged: 9, booked: 11, delivered: 7, qleads: 3, cxo: 5, inbound: 22, reach: 1800, bookings: 3.5, revenue: 1.5 }, signalDriven: true, bl: "ADM", theme: "IT Cost Takeout", partner: "—", duration: "12 weeks" },
  { n: "NL Retail — Commerce Acceleration", bu: "NL", status: "Active", sol: "Retail Commerce Accelerator", engine: "—", owner: "J. Bakker", approver: "NL BL Lead DCX", start: "15 Jul 2026", end: "23 Sep 2026", accts: 8, m: { reached: 5, outreach: 14, meetings: 4, pipe: 2.9, oppsGen: 2, wins: 0, targets: 8, engaged: 5, booked: 6, delivered: 4, qleads: 2, cxo: 2, inbound: 14, reach: 1200, bookings: 1.6, revenue: 0.7 }, signalDriven: false, bl: "DCX", theme: "Sector play", partner: "Adobe", duration: "10 weeks" },
  { n: "NL Cross-sector — Vendor Consolidation", bu: "NL", status: "Planned", sol: "Vendor Consolidation Play", engine: "—", owner: "M. Jansen", approver: "NL MM Leader", start: "01 Sep 2026", end: "27 Oct 2026", accts: 10, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 10, engaged: 0, booked: 0, delivered: 0, qleads: 0, cxo: 0, inbound: 0, reach: 0, bookings: 0, revenue: 0 }, signalDriven: true, bl: "ADM", theme: "Vendor Consolidation", partner: "—", duration: "8 weeks" },
  { n: "DE Manufacturing — Smart Factory", bu: "DE", status: "Active", sol: "Manufacturing Smart Factory", engine: "DE · Manufacturing", owner: "K. Weber", approver: "DE MM Leader", start: "10 Jun 2026", end: "16 Sep 2026", accts: 12, m: { reached: 8, outreach: 31, meetings: 6, pipe: 8.2, oppsGen: 4, wins: 0, targets: 12, engaged: 8, booked: 9, delivered: 6, qleads: 4, cxo: 6, inbound: 31, reach: 2400, bookings: 4.5, revenue: 2.0 }, signalDriven: true, bl: "CIS", theme: "Sector play", partner: "Siemens", duration: "14 weeks" },
  { n: "DE Industrial — Cost Takeout", bu: "DE", status: "Active", sol: "IT Cost Takeout", engine: "DE · Industrial", owner: "T. Schmidt", approver: "DE MM Leader", start: "01 Jul 2026", end: "23 Sep 2026", accts: 16, m: { reached: 11, outreach: 28, meetings: 9, pipe: 9.6, oppsGen: 5, wins: 0, targets: 16, engaged: 11, booked: 14, delivered: 9, qleads: 5, cxo: 7, inbound: 28, reach: 2100, bookings: 5.3, revenue: 2.3 }, signalDriven: true, bl: "ADM", theme: "IT Cost Takeout", partner: "—", duration: "12 weeks" },
  { n: "UK Manufacturing — ADM Reboot", bu: "UK", status: "Active", sol: "ADM Reboot Play", engine: "UK · Manufacturing", owner: "R. Patel", approver: "UK MM Leader", start: "20 Jun 2026", end: "12 Sep 2026", accts: 13, m: { reached: 7, outreach: 17, meetings: 5, pipe: 5.5, oppsGen: 3, wins: 0, targets: 13, engaged: 7, booked: 9, delivered: 5, qleads: 3, cxo: 4, inbound: 17, reach: 1600, bookings: 3.0, revenue: 1.3 }, signalDriven: true, bl: "ADM", theme: "Enterprise Technology Modernization", partner: "—", duration: "12 weeks" },
  { n: "SE Industrial — Smart Factory", bu: "NO", status: "Active", sol: "Manufacturing Smart Factory", engine: "SE · Industrial", owner: "A. Lindqvist", approver: "Nordics MM Leader", start: "01 Jul 2026", end: "23 Sep 2026", accts: 9, m: { reached: 6, outreach: 12, meetings: 4, pipe: 4.4, oppsGen: 2, wins: 0, targets: 9, engaged: 6, booked: 7, delivered: 4, qleads: 2, cxo: 3, inbound: 12, reach: 800, bookings: 2.4, revenue: 1.1 }, signalDriven: true, country: "Sweden", bl: "CIS", theme: "Sector play", partner: "Siemens", duration: "12 weeks" },
  { n: "FI Manufacturing — ADM Consolidation", bu: "NO", status: "Active", sol: "ADM Reboot Play", engine: "FI · Industrial", owner: "M. Virtanen", approver: "Nordics MM Leader", start: "15 Jun 2026", end: "07 Sep 2026", accts: 8, m: { reached: 5, outreach: 9, meetings: 4, pipe: 3.0, oppsGen: 2, wins: 0, targets: 8, engaged: 5, booked: 6, delivered: 4, qleads: 2, cxo: 3, inbound: 9, reach: 700, bookings: 1.7, revenue: 0.7 }, signalDriven: true, country: "Finland", bl: "ADM", theme: "Enterprise Technology Modernization", partner: "—", duration: "12 weeks" },
  { n: "NO Energy — Cloud Foundation", bu: "NO", status: "Active", sol: "Hyperscaler Landing Zone", engine: "NO · Energy", owner: "E. Hansen", approver: "Nordics MM Leader", start: "01 Jul 2026", end: "09 Sep 2026", accts: 7, m: { reached: 4, outreach: 8, meetings: 2, pipe: 2.6, oppsGen: 1, wins: 0, targets: 7, engaged: 4, booked: 4, delivered: 2, qleads: 1, cxo: 2, inbound: 8, reach: 600, bookings: 1.4, revenue: 0.6 }, signalDriven: true, country: "Norway", bl: "CIS", theme: "SAP / Cloud", partner: "AWS", duration: "10 weeks" },
  { n: "NL SAP — S/4 Readiness", bu: "NL", status: "Draft", sol: "SAP S/4 Rapid Migration", engine: "—", owner: "S. de Vries", approver: "TBC", start: "01 Oct 2026", end: "24 Dec 2026", accts: 6, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 6 }, signalDriven: false, bl: "ADM", theme: "SAP / Cloud", partner: "SAP", duration: "12 weeks" },
  { n: "DE TMT — Cloud Migration", bu: "DE", status: "Approved", sol: "Hyperscaler Landing Zone", engine: "—", owner: "K. Weber", approver: "DE BL Lead CIS", start: "01 Sep 2026", end: "10 Nov 2026", accts: 9, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 9 }, signalDriven: false, bl: "CIS", theme: "SAP / Cloud", partner: "AWS", duration: "10 weeks" },
  { n: "DE Retail — Commerce Push", bu: "DE", status: "Review", sol: "Retail Commerce Accelerator", engine: "—", owner: "T. Schmidt", approver: "DE MM Leader", start: "01 Apr 2026", end: "24 Jun 2026", accts: 7, m: { reached: 6, outreach: 19, meetings: 6, pipe: 4.1, oppsGen: 3, wins: 0, targets: 7, engaged: 6, booked: 8, delivered: 6, qleads: 3 }, signalDriven: false, bl: "DCX", theme: "Sector play", partner: "Adobe", duration: "12 weeks" },
  { n: "DE E&U — Grid Data Platform", bu: "DE", status: "Planned", sol: "E&U Grid Data Platform", engine: "—", owner: "K. Weber", approver: "DE BL Lead I&D", start: "15 Sep 2026", end: "24 Nov 2026", accts: 8, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 8 }, signalDriven: false, bl: "I&D", theme: "Data & AI", partner: "Microsoft", duration: "10 weeks" },
  { n: "UK E&U — Grid Analytics", bu: "UK", status: "Active", sol: "E&U Grid Data Platform", engine: "—", owner: "L. Murray", approver: "UK BL Lead I&D", start: "01 Jul 2026", end: "09 Sep 2026", accts: 7, m: { reached: 4, outreach: 11, meetings: 3, pipe: 3.8, oppsGen: 2, wins: 0, targets: 7, engaged: 4, booked: 5, delivered: 3, qleads: 2 }, signalDriven: true, bl: "I&D", theme: "Data & AI", partner: "Microsoft", duration: "10 weeks" },
  { n: "UK CPG — SAP S/4 Wave 1", bu: "UK", status: "Approved", sol: "SAP S/4 Rapid Migration", engine: "—", owner: "R. Patel", approver: "UK MM Leader", start: "01 Sep 2026", end: "08 Dec 2026", accts: 9, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 9 }, signalDriven: false, bl: "ADM", theme: "SAP / Cloud", partner: "SAP", duration: "14 weeks" },
  { n: "UK Cross-sector — Cyber Baseline", bu: "UK", status: "Draft", sol: "Cyber Baseline for Mid-Market", engine: "—", owner: "L. Murray", approver: "TBC", start: "15 Oct 2026", end: "10 Dec 2026", accts: 5, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 5 }, signalDriven: false, bl: "CIS", theme: "Cybersecurity", partner: "—", duration: "8 weeks" },
  { n: "SE Retail — Commerce", bu: "NO", status: "Planned", sol: "Retail Commerce Accelerator", engine: "—", owner: "A. Lindqvist", approver: "Nordics BL Lead DCX", start: "01 Sep 2026", end: "10 Nov 2026", accts: 6, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 6 }, signalDriven: false, country: "Sweden", bl: "DCX", theme: "Sector play", partner: "Adobe", duration: "10 weeks" },
  { n: "SE Cross-sector — Cost Takeout", bu: "NO", status: "Draft", sol: "IT Cost Takeout", engine: "—", owner: "A. Lindqvist", approver: "TBC", start: "15 Oct 2026", end: "24 Dec 2026", accts: 7, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 7 }, signalDriven: false, country: "Sweden", bl: "ADM", theme: "IT Cost Takeout", partner: "—", duration: "10 weeks" },
  { n: "FI Public — Data Platform", bu: "NO", status: "Planned", sol: "E&U Grid Data Platform", engine: "—", owner: "M. Virtanen", approver: "Nordics BL Lead I&D", start: "01 Oct 2026", end: "26 Nov 2026", accts: 5, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 5 }, signalDriven: false, country: "Finland", bl: "I&D", theme: "Data & AI", partner: "Microsoft", duration: "8 weeks" },
  { n: "NO Cross-sector — Cost Takeout", bu: "NO", status: "Draft", sol: "IT Cost Takeout", engine: "—", owner: "E. Hansen", approver: "TBC", start: "01 Nov 2026", end: "10 Jan 2027", accts: 5, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 5 }, signalDriven: false, country: "Norway", bl: "ADM", theme: "IT Cost Takeout", partner: "—", duration: "10 weeks" },
  { n: "DK Transport — Modernization", bu: "NO", status: "Active", sol: "ADM Reboot Play", engine: "—", owner: "N. Sørensen", approver: "Nordics MM Leader", start: "10 Jul 2026", end: "02 Oct 2026", accts: 6, m: { reached: 3, outreach: 7, meetings: 2, pipe: 2.1, oppsGen: 1, wins: 0, targets: 6, engaged: 3, booked: 4, delivered: 2, qleads: 1 }, signalDriven: true, country: "Denmark", bl: "ADM", theme: "Enterprise Technology Modernization", partner: "—", duration: "12 weeks" },
  { n: "DK Cross-sector — Cyber Baseline", bu: "NO", status: "Planned", sol: "Cyber Baseline for Mid-Market", engine: "—", owner: "N. Sørensen", approver: "Nordics BL Lead CIS", start: "15 Sep 2026", end: "10 Nov 2026", accts: 5, m: { reached: 0, outreach: 0, meetings: 0, pipe: 0, oppsGen: 0, wins: 0, targets: 5 }, signalDriven: false, country: "Denmark", bl: "CIS", theme: "Cybersecurity", partner: "—", duration: "8 weeks" },
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

export const TRIGGER_CATS = [
  { k: "Technology Initiatives", ic: "⚙️", ex: ["SAP", "Cloud", "AI", "Data", "Cyber"], agents: ["Intelio", "Nexus", "Knowledge SPOC"] },
  { k: "Strategic Initiatives", ic: "🧭", ex: ["Growth Strategy", "Operating Model Change", "Transformation Programme"], agents: ["Intelio", "Researcher", "Market Intel in a Box"] },
  { k: "Sustainability Announcements", ic: "🌱", ex: ["Net Zero", "ESG", "Green Energy"], agents: ["Researcher", "Nexus"] },
  { k: "Executive Changes", ic: "👤", ex: ["CIO", "CTO", "CFO", "COO"], agents: ["Rapport", "Stakeholder Profile", "LinkedIn CXO Voice"] },
  { k: "Organisational Resizing", ic: "📉", ex: ["Layoffs", "Hiring Freeze", "Shared Services", "Outsourcing"], agents: ["Financial Analyst", "Intelio"] },
  { k: "M&A / Acquisitions", ic: "🤝", ex: ["Merger", "Acquisition", "PE Investment", "Demerger"], agents: ["Financial Analyst", "Researcher", "Intelio"] },
  { k: "Financial Updates", ic: "💶", ex: ["Profit Warning", "Margin Pressure", "Cost Reduction"], agents: ["Financial Analyst", "Spend Scout"] },
];

export const RADAR_SOURCES = [
  { n: "Company websites", d: "Newsrooms, investor pages and strategy statements", active: true },
  { n: "Annual reports & filings", d: "Published financial statements and regulatory filings", active: true },
  { n: "Press releases", d: "Wire services and corporate announcements", active: true },
  { n: "News sources", d: "National and trade press in the country language", active: true },
  { n: "Public tenders", d: "National and EU tender portals", active: true },
  { n: "Job boards / hiring sites", d: "Role postings used as a technology-initiative proxy", active: true },
  { n: "Leadership announcements", d: "Executive appointment and board change notices", active: true },
  { n: "Partner & analyst feeds", d: "Partner alliance notes and analyst commentary", active: false },
  { n: "Social / LinkedIn signals", d: "Public executive posting activity", active: false },
];

export const SIGNALS: Signal[] = [
  { bu: "DE", acct: "Rheinwerk AG", engine: "DE · Industrial", title: "SAP S/4HANA transformation programme referenced in hiring activity", src: "Job boards", score: 88, sev: "High", status: "New", sum: "Concentrated SAP hiring indicates ERP modernisation being staffed internally.", cat: "Technology Initiatives", rel: "High", hyp: "A managed or assured delivery alternative may fit the programme window.", agents: ["Intelio", "Nexus", "Knowledge SPOC"], action: "Launch Intelio and prepare an SAP opportunity hypothesis", sc: { acct: 88, ind: 82, str: 74, camp: 79, pipe: 80, cred: 78 } },
  { bu: "NL", acct: "Amstel Retail Group", engine: "NL · Industrial", title: "Customer experience strategy refresh announced", src: "Press release", score: 72, sev: "Medium", status: "New", sum: "Omnichannel and loyalty initiatives may align to DCX and data offers.", cat: "Strategic Initiatives", rel: "Medium", hyp: "The refresh may create a campaign entry point ahead of the planning cycle.", agents: ["Market Intel in a Box", "Researcher", "Nexus"], action: "Save to account intelligence and review for the retail campaign", sc: { acct: 72, ind: 64, str: 60, camp: 64, pipe: 64, cred: 88 } },
  { bu: "FI", country: "Finland", acct: "Suomi Paper Oyj", engine: "FI · Industrial", title: "Group-wide efficiency and cost reduction programme announced", src: "Financial update", score: 91, sev: "Critical", status: "New", sum: "€60M efficiency target with shared services in scope.", cat: "Financial Updates", rel: "Critical", hyp: "ADM consolidation, automation and managed services plays all apply.", agents: ["Financial Analyst", "Spend Scout", "Intelio"], action: "Create a cost-takeout play and link it to Pipeline Explorer", sc: { acct: 94, ind: 87, str: 90, camp: 88, pipe: 85, cred: 92 } },
  { bu: "UK", acct: "Thames Utilities", engine: "UK · Retail", title: "New CIO appointed with a transformation background", src: "Leadership announcement", score: 86, sev: "High", status: "New", sum: "New technology leadership may reset transformation priorities.", cat: "Executive Changes", rel: "High", hyp: "Supplier relationships may reset within the first 100 days.", agents: ["Rapport", "LinkedIn CXO Voice", "Stakeholder Profile"], action: "Assign to account owner and prepare a stakeholder engagement brief", sc: { acct: 86, ind: 78, str: 80, camp: 80, pipe: 77, cred: 90 } },
  { bu: "NO", country: "Norway", acct: "Fjord Energy ASA", engine: "NO · Industrial", title: "Signs a strategic cloud agreement with a hyperscaler", src: "Press release", score: 82, sev: "High", status: "New", sum: "Commitment made, capability not yet built.", cat: "Technology Initiatives", rel: "High", hyp: "An immediate landing-zone and managed-service opportunity exists.", agents: ["Intelio", "Nexus", "Knowledge SPOC"], action: "Launch the AWS Landing Zone Fast Start partner play", sc: { acct: 86, ind: 80, str: 76, camp: 78, pipe: 78, cred: 85 } },
  { bu: "DK", country: "Denmark", acct: "Copenhagen Logistics", engine: "NO · Industrial", title: "Recruiting a Head of Enterprise Architecture", src: "Hiring sites", score: 72, sev: "Medium", status: "New", sum: "A senior EA hire usually precedes a modernization mandate.", cat: "Executive Changes", rel: "Medium", hyp: "Time outreach for 60–90 days after the appointment.", agents: ["Rapport", "Stakeholder Profile", "LinkedIn CXO Voice"], action: "Set a follow-up reminder and prepare a stakeholder profile", sc: { acct: 72, ind: 65, str: 58, camp: 63, pipe: 65, cred: 75 } },
  { bu: "DE", acct: "BavariaTech GmbH", engine: "DE · Industrial", title: "Shared services consolidation and workforce resizing programme announced", src: "Company update", score: 84, sev: "High", status: "New", sum: "The resizing programme may drive outsourcing and automation needs.", cat: "Organisational Resizing", rel: "High", hyp: "Operating model transformation needs may follow.", agents: ["Financial Analyst", "Intelio", "Spend Scout"], action: "Launch Financial Analyst and prepare an automation play", sc: { acct: 84, ind: 80, str: 82, camp: 79, pipe: 78, cred: 83 } },
  { bu: "NL", acct: "Rotterdam FoodCo", engine: "NL · Industrial", title: "Tender published to consolidate application support vendors", src: "Public tender", score: 91, sev: "Critical", status: "New", sum: "Open tender to consolidate five application support vendors into one.", cat: "Strategic Initiatives", rel: "Critical", hyp: "Direct match for the Vendor Consolidation play and a five-week procurement window.", agents: ["Intelio", "Researcher", "Knowledge SPOC"], action: "Add to the NL cost-takeout campaign and start pre-tender positioning", sc: { acct: 95, ind: 84, str: 96, camp: 91, pipe: 84, cred: 90 } },
  { bu: "DE", acct: "Munich Retail Group", engine: "DE · Industrial", title: "Incumbent SI contract expires Q1 2027", src: "Public filings", score: 84, sev: "High", status: "New", sum: "Competitor contract ends Q1 2027; the positioning window opens now.", cat: "Strategic Initiatives", rel: "High", hyp: "Procurement typically starts nine months ahead, creating a pre-tender opportunity.", agents: ["Researcher", "Intelio", "Market Intel in a Box"], action: "Open a pre-tender positioning plan and assign the account owner", sc: { acct: 87, ind: 85, str: 80, camp: 80, pipe: 82, cred: 85 } },
  { bu: "DE", acct: "NordChem", engine: "DE · Industrial", title: "New EU emissions reporting obligation from 2027", src: "Regulatory monitor", score: 72, sev: "Medium", status: "New", sum: "Reporting obligation requires plant-level data consolidation.", cat: "Sustainability Announcements", rel: "Medium", hyp: "The obligation extends the existing data platform engagement.", agents: ["Researcher", "Nexus"], action: "Save to account intelligence and brief the existing delivery team", sc: { acct: 74, ind: 72, str: 60, camp: 65, pipe: 69, cred: 90 } },
  { bu: "NL", acct: "Eindhoven Devices BV", engine: "NL · Industrial", title: "Hiring 25+ SAP and integration engineers", src: "Hiring sites", score: 75, sev: "High", status: "New", sum: "Concentrated SAP hiring suggests an S/4 programme being staffed internally.", cat: "Technology Initiatives", rel: "High", hyp: "The hiring pattern creates a positioning window for a managed alternative.", agents: ["Intelio", "Nexus", "Knowledge SPOC"], action: "Launch Intelio and prepare an SAP opportunity hypothesis", sc: { acct: 79, ind: 70, str: 65, camp: 70, pipe: 70, cred: 75 } },
  { bu: "NO", country: "Sweden", acct: "Nordic Steel AB", engine: "NO · Industrial", title: "RFI issued for an OT/IT integration partner", src: "Public tender", score: 86, sev: "Critical", status: "New", sum: "RFI closes in three weeks and directly fits the Siemens Smart Factory play.", cat: "Technology Initiatives", rel: "Critical", hyp: "The RFI is a direct partner-play opportunity for OT/IT convergence.", agents: ["Intelio", "Nexus", "Knowledge SPOC"], action: "Trigger the partner play and assign a solution architect", sc: { acct: 89, ind: 82, str: 90, camp: 85, pipe: 81, cred: 85 } },
  { bu: "NO", country: "Sweden", acct: "Vasa Retail AB", engine: "NO · Industrial", title: "Commerce platform outage reported in the trade press", src: "News sources", score: 68, sev: "Medium", status: "New", sum: "Public platform instability creates a credible commerce-resilience conversation.", cat: "Technology Initiatives", rel: "Medium", hyp: "A resilience conversation may open a commerce transformation path.", agents: ["Researcher", "Nexus"], action: "Save to account intelligence and prepare a resilience talk track", sc: { acct: 70, ind: 62, str: 75, camp: 68, pipe: 62, cred: 70 } },
  { bu: "NO", country: "Finland", acct: "Helsinki HealthTech", engine: "NO · Industrial", title: "EU MDR compliance deadline approaching", src: "Regulatory monitor", score: 68, sev: "Low", status: "New", sum: "Compliance-driven data and quality-system work is approaching.", cat: "Strategic Initiatives", rel: "Low", hyp: "A smaller ticket, but a credible data and quality-system door-opener.", agents: ["Researcher", "Knowledge SPOC"], action: "Save to account intelligence for the next campaign wave", sc: { acct: 68, ind: 52, str: 80, camp: 69, pipe: 56, cred: 90 } },
  { bu: "NL", acct: "Van Oord Logistics", engine: "NL · Industrial", title: "Announces a shared-services review across back office and IT", src: "Company update", score: 72, sev: "Medium", status: "New", sum: "A shared-services review is a precursor to outsourcing and automation decisions.", cat: "Organisational Resizing", rel: "Medium", hyp: "The review may create an outsourcing and automation hypothesis.", agents: ["Financial Analyst", "Intelio"], action: "Assign to the account owner and prepare an outsourcing hypothesis", sc: { acct: 75, ind: 68, str: 70, camp: 70, pipe: 67, cred: 80 } },
  { bu: "DK", country: "Denmark", acct: "Jutland Foods", engine: "NO · Industrial", title: "Acquires a regional competitor", src: "Market news", score: 82, sev: "High", status: "New", sum: "Post-merger integration typically creates ERP and data-consolidation demand.", cat: "M&A / Acquisitions", rel: "High", hyp: "A PMI agenda may create application rationalisation and data opportunities.", agents: ["Financial Analyst", "Researcher", "Intelio"], action: "Create a PMI hypothesis and add to the Nordics modernization campaign", sc: { acct: 81, ind: 83, str: 78, camp: 76, pipe: 78, cred: 86 } },
  { bu: "UK", acct: "Albion Foods", engine: "UK · Retail", title: "Issues a margin pressure warning in a trading update", src: "Financial update", score: 84, sev: "High", status: "New", sum: "IT and logistics are named as cost levers in the trading update.", cat: "Financial Updates", rel: "High", hyp: "Margin pressure creates a strong opening for IT cost takeout.", agents: ["Financial Analyst", "Spend Scout"], action: "Create a cost-takeout play and request a CFO conversation", sc: { acct: 88, ind: 79, str: 82, camp: 82, pipe: 79, cred: 92 } },
  { bu: "UK", acct: "Pennine Manufacturing", engine: "UK · Industrial", title: "Private-equity acquisition completed", src: "Market news", score: 82, sev: "High", status: "New", sum: "A new PE owner typically drives a 100-day transformation agenda.", cat: "M&A / Acquisitions", rel: "High", hyp: "Cost and operating-model transformation needs may follow the acquisition.", agents: ["Financial Analyst", "Researcher", "Intelio"], action: "Create a PE transformation hypothesis and assign seller follow-up", sc: { acct: 83, ind: 86, str: 84, camp: 79, pipe: 80, cred: 86 } },
  { bu: "UK", acct: "Thames Utilities", engine: "UK · Retail", title: "Digital twin and asset data programme announced", src: "Company website", score: 91, sev: "Critical", status: "New", sum: "Asset management, cloud and data-platform demand is funded through the capital plan.", cat: "Technology Initiatives", rel: "Critical", hyp: "The programme creates a multi-offer opportunity across asset management and data.", agents: ["Intelio", "Nexus", "Knowledge SPOC"], action: "Add to UK E&U campaign and create an opportunity candidate", sc: { acct: 92, ind: 91, str: 88, camp: 86, pipe: 87, cred: 94 } },
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
  { n: "Intelio", stage: "Client intelligence", ic: "🔎", type: "Internal", status: "Published", ver: "v2.1", d: "Creates a 360-degree client intelligence view including business context, sector trends, financials, technology priorities and opportunity hypotheses.", grounding: ["Salesforce", "Radar signals", "Public web"], owner: "Clients & Innovation", use: "Account planning, first outreach, meeting preparation and opportunity shaping.", launches: 64 },
  { n: "BritMap", stage: "Client intelligence", ic: "🗺️", type: "Internal", status: "Published", ver: "v1.0", d: "Builds UK-focused BuyerMaps, decision-maker context, business priorities and likely opportunity areas.", grounding: ["Salesforce", "Public web"], owner: "Clients & Innovation", use: "UK mid-market account intelligence and targeted sales engagement.", launches: 22 },
  { n: "Rapport", stage: "Client intelligence", ic: "👤", type: "Internal", status: "Published", ver: "v1.3", d: "Builds stakeholder intelligence profiles with priorities, talking points, discovery questions and engagement approaches.", grounding: ["Public web", "Salesforce"], owner: "Clients & Innovation", use: "Preparing for senior stakeholder conversations.", launches: 37 },
  { n: "Nexus", stage: "Origination & shaping", ic: "🧩", type: "Internal", status: "Published", ver: "v2.0", d: "Identifies relevant recent innovations and turns them into client-ready value stories.", grounding: ["Solutions & Assets (RAG)", "Radar signals"], owner: "Clients & Innovation", use: "Shaping innovation-led proposals and solution angles.", launches: 39 },
  { n: "Researcher", stage: "Origination & shaping", ic: "🔬", type: "Internal", status: "Published", ver: "v1.8", d: "Conducts deep research on competitors, markets, clients, partnerships and innovations with cited findings.", grounding: ["Public web", "Radar signals"], owner: "Clients & Innovation", use: "Market and competitor research during shaping.", launches: 47 },
  { n: "RFx Shredder", stage: "RFP / bid support", ic: "📄", type: "External", status: "Published", ver: "v1.1", d: "Extracts RFP and RFI requirements and identifies risks, gaps and evaluation criteria.", grounding: ["Uploaded RFP", "Solutions & Assets (RAG)"], owner: "Wincentre", use: "Day one of a bid or tender review.", launches: 46 },
];

export const AGENT_STAGES = [
  { k: "Client intelligence", ic: "🔎", sub: "Account understanding, BuyerMaps, stakeholder context and market intelligence" },
  { k: "Meeting preparation", ic: "📋", sub: "Briefing, conversation preparation and relevant talking points" },
  { k: "Opportunity qualification", ic: "✅", sub: "Trigger assessment, financial signals, qualification and risk view" },
  { k: "Origination & shaping", ic: "🧩", sub: "Solution shaping, pre-tender positioning, innovation and competitive intelligence" },
  { k: "RFP / bid support", ic: "📄", sub: "RFP analysis, bid support, proposal development and review" },
  { k: "Campaign support", ic: "📣", sub: "Campaign targeting, outreach, content, assets and follow-up support" },
];

const PROTOTYPE_AGENT_PLACEMENTS: [string, string, string, number, string, string][] = [
  ["Helder", "Client intelligence", "Clients & Innovation", 18, "Creates concise BuyerMaps for Netherlands mid-market clients including likely decision-makers and buying triggers.", "Netherlands teams preparing account meetings."],
  ["Stakeholder Profile", "Client intelligence", "Clients & Innovation", 15, "Structures stakeholder profiles from public and contextual inputs.", "Account or bid stakeholder mapping."],
  ["LinkedIn CXO Voice", "Client intelligence", "Clients & Innovation", 26, "Decodes leadership activity and public CXO voice to identify themes and engagement angles.", "When leadership signals or executive changes are identified."],
  ["Market Intel in a Box", "Client intelligence", "Clients & Innovation", 29, "Generates executive-ready market intelligence and client briefings with a Nordics lens.", "Leadership-ready account and market briefings."],
  ["Intelio", "Meeting preparation", "Clients & Innovation", 64, "Creates meeting-ready client intelligence and links client challenges to capabilities.", "Before first meetings or account reviews."],
  ["BritMap", "Meeting preparation", "Clients & Innovation", 22, "Turns UK account intelligence into practical outreach ideas and positioning themes.", "Before client meetings or industry events."],
  ["Rapport", "Meeting preparation", "Clients & Innovation", 37, "Recommends tailored talking points, opening lines and discovery questions.", "Before CXO or stakeholder meetings."],
  ["Knowledge SPOC", "Meeting preparation", "Knowledge Management", 51, "Finds relevant capability decks, case studies, sales kits and internal guidance.", "Preparing meeting materials or proof points."],
  ["Market Intel in a Box", "Meeting preparation", "Clients & Innovation", 29, "Provides macro, industry and competitive context for leadership conversations.", "Executive or senior stakeholder discussions."],
  ["Beacon", "Opportunity qualification", "Clients & Innovation", 33, "Identifies and scores buying signals using public data and a structured taxonomy.", "Validating whether a trigger is commercially meaningful."],
  ["Triggers Orchestrator", "Opportunity qualification", "Clients & Innovation", 12, "Processes trigger lists, categorises signals and applies regional governance rules.", "When batches of trigger signals need to be standardised."],
  ["Financial Analyst", "Opportunity qualification", "Clients & Innovation", 44, "Analyses financial stress and maps signals to IT services opportunities.", "Financial updates, margin pressure or restructuring signals."],
  ["Spend Scout", "Opportunity qualification", "Clients & Innovation", 20, "Identifies where clients may invest by analysing market expectations and company actions.", "Separating real opportunity from general market noise."],
  ["Sales TransFORM", "Opportunity qualification", "Sales Analytics Centre", 17, "Explains sales pipeline, bookings, forecasting and governance rules.", "Qualifying or progressing pipeline stages."],
  ["Deal Risk Sentinel", "Opportunity qualification", "Wincentre", 25, "Surfaces commercial, delivery, compliance and governance risks across deals.", "Qualification, go/no-go and deal review."],
  ["Nexus", "Origination & shaping", "Clients & Innovation", 39, "Identifies recent innovations and turns them into client-ready value stories.", "Shaping innovation-led proposals and solution angles."],
  ["Researcher", "Origination & shaping", "Clients & Innovation", 47, "Conducts deep research on competitors, markets, clients and partnerships with cited findings.", "Market and competitor research during shaping."],
  ["Horizon", "Origination & shaping", "Clients & Innovation", 14, "Anticipates public-sector tender opportunities before formal publication.", "Pre-tender positioning."],
  ["CompeteIQ", "Origination & shaping", "Clients & Innovation", 21, "Builds competitor overview, positioning insights and compete strategy.", "Strengthening differentiation and win themes."],
  ["GCC Advisor", "Origination & shaping", "Clients & Innovation", 8, "Provides GCC market intelligence, talent and operating model insights.", "GCC-related advisory opportunities."],
  ["Beat The Competition", "Origination & shaping", "Clients & Innovation", 16, "Creates competitive intelligence newsletters and market briefs.", "Competitive monitoring and strategy."],
  ["RFx Shredder", "RFP / bid support", "Wincentre", 46, "Extracts RFP and RFI requirements and identifies risks, gaps and evaluation criteria.", "Day one of a bid or tender review."],
  ["Bid Support Copilot", "RFP / bid support", "Wincentre", 34, "Guides bid lifecycle activities, checklists, prompts and compliance.", "Bid and presales teams during an RFx response."],
  ["Winplan Navigator", "RFP / bid support", "Wincentre", 28, "Builds win strategy, value proposition and competitive positioning.", "Pursuit strategy and win planning."],
  ["Deal Risk Sentinel", "RFP / bid support", "Wincentre", 25, "Provides deal risk posture and escalation insights.", "Before deal reviews and approvals."],
  ["RedTeam Review", "RFP / bid support", "Wincentre", 19, "Critically reviews tender and bid content from business, solution and client perspectives.", "Before formal proposal review."],
  ["Cognitive Review", "RFP / bid support", "Wincentre", 13, "Reviews proposals for clarity, logic, trust, empathy and decision effectiveness.", "Sharpening executive-ready proposal content."],
  ["Proposal Matcher", "RFP / bid support", "Proposal Centre", 23, "Compares RFx requirements with proposal content and highlights gaps.", "Validating proposal fit against customer requirements."],
  ["Final Checker", "RFP / bid support", "Proposal Centre", 30, "Checks RFP responses for consistency, formatting, compliance and severity.", "Before submission."],
  ["Proposal Development", "RFP / bid support", "Proposal Centre", 26, "Creates structured proposal documents from RFP content.", "Accelerating drafting."],
  ["FAQ / Response Draft – UK", "RFP / bid support", "Wincentre", 11, "Finds standard responses and bid essentials from approved UK sources.", "Questionnaires, FAQs and standard response drafting."],
  ["Knowledge SPOC", "Campaign support", "Knowledge Management", 51, "Finds relevant collateral, case studies, offer materials and playbooks.", "Building campaign assets or follow-up materials."],
  ["Market Intel in a Box", "Campaign support", "Clients & Innovation", 29, "Provides executive-ready industry and market insights for campaign narratives.", "Campaign positioning and market context."],
  ["Spend Scout", "Campaign support", "Clients & Innovation", 20, "Supports investment hypotheses and identifies likely spending areas.", "Campaign targeting and account prioritisation."],
  ["Nexus", "Campaign support", "Clients & Innovation", 39, "Maps innovations to client priorities and campaign themes.", "Innovation-led campaign plays."],
  ["BritMap", "Campaign support", "Clients & Innovation", 22, "Creates UK buyer insights and target account angles.", "UK campaign account preparation."],
  ["Beat The Competition", "Campaign support", "Clients & Innovation", 16, "Monitors competitor strategies, wins, partnerships and market moves.", "Competitive campaign angles."],
];

for (const [n, stage, owner, launches, description, use] of PROTOTYPE_AGENT_PLACEMENTS) {
  AGENTS.push({ n, stage, ic: "🤖", type: "Internal", status: "Published", ver: "v1.0", d: description, grounding: ["Radar signals", "Public web", "Solutions & Assets (RAG)"], owner, use, launches });
}

export const AGENT_USAGE: AgentUsage[] = [
  { n: "Intelio", inv: 412, users: 61, rating: 4.4, outputs: 298, byBu: { UK: 120, DE: 140, NL: 60, NO: 92 }, lastUsed: "02 Sep 2026 08:10", byCountry: { Sweden: 30, Finland: 22, Norway: 25, Denmark: 15 }, byRole: { "Seller / Client Partner": 340, "Campaign Lead": 40 }, trend: "+18%", fb: "Cuts my pre-call research from an hour to ten minutes." },
  { n: "BritMap", inv: 22, users: 12, rating: 4.2, outputs: 18, byBu: { UK: 18, DE: 2, NL: 1, NO: 1 }, lastUsed: "01 Sep 2026 14:20", byCountry: { Sweden: 0, Finland: 0, Norway: 0, Denmark: 0 }, byRole: { "Seller / Client Partner": 18, "Campaign Lead": 4 }, trend: "+12%", fb: "Useful UK buyer context for account planning." },
  { n: "Rapport", inv: 37, users: 18, rating: 4.3, outputs: 28, byBu: { UK: 12, DE: 10, NL: 8, NO: 7 }, lastUsed: "31 Aug 2026 16:10", byCountry: { Sweden: 4, Finland: 2, Norway: 3, Denmark: 2 }, byRole: { "Seller / Client Partner": 28, "Campaign Lead": 9 }, trend: "+16%", fb: "The stakeholder talking points are practical and specific." },
  { n: "Nexus", inv: 39, users: 21, rating: 4.1, outputs: 31, byBu: { UK: 10, DE: 14, NL: 8, NO: 7 }, lastUsed: "30 Aug 2026 11:30", byCountry: { Sweden: 4, Finland: 3, Norway: 2, Denmark: 2 }, byRole: { "Seller / Client Partner": 24, "Campaign Lead": 15 }, trend: "+21%", fb: "Strong starting point for innovation-led shaping." },
  { n: "Researcher", inv: 47, users: 24, rating: 4.2, outputs: 35, byBu: { UK: 12, DE: 16, NL: 10, NO: 9 }, lastUsed: "29 Aug 2026 09:30", byCountry: { Sweden: 5, Finland: 4, Norway: 4, Denmark: 3 }, byRole: { "Seller / Client Partner": 29, "Campaign Lead": 18 }, trend: "+19%", fb: "Cited market research makes the shaping conversation sharper." },
  { n: "RFx Shredder", inv: 46, users: 20, rating: 4.0, outputs: 32, byBu: { UK: 14, DE: 16, NL: 8, NO: 8 }, lastUsed: "28 Aug 2026 10:15", byCountry: { Sweden: 4, Finland: 3, Norway: 3, Denmark: 2 }, byRole: { "Seller / Client Partner": 20, "Campaign Lead": 26 }, trend: "+9%", fb: "Requirement extraction is reliable on long RFPs." },
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
  NL: { pipeline: 38.4, revenue: 45.0, coverage: 62, reuse: 71, signals: 92, conv: 7, outreach: 31, meetings: 12, oppsCreated: 12, stageConv: 31, pTarget: 50, rTarget: 60, cTarget: 70, clients: 150, targetAccounts: 50, activeAccounts: 31, campaigns: 4, partners: 12, assets: 55, agents: 9, qualifiedLeads: 7, tBookings: 60, tPipeline: 50, tCoverage: 70 },
  DE: { pipeline: 47.1, revenue: 52.6, coverage: 64, reuse: 68, signals: 118, conv: 11, outreach: 41, meetings: 18, oppsCreated: 18, stageConv: 36, pTarget: 64, rTarget: 70, cTarget: 70, clients: 210, targetAccounts: 64, activeAccounts: 41, campaigns: 5, partners: 9, assets: 62, agents: 9, qualifiedLeads: 11, tBookings: 70, tPipeline: 60, tCoverage: 70 },
  UK: { pipeline: 33.7, revenue: 38.2, coverage: 53, reuse: 64, signals: 87, conv: 8, outreach: 29, meetings: 14, oppsCreated: 14, stageConv: 34, pTarget: 55, rTarget: 55, cTarget: 65, clients: 180, targetAccounts: 55, activeAccounts: 29, campaigns: 4, partners: 8, assets: 48, agents: 9, qualifiedLeads: 8, tBookings: 55, tPipeline: 45, tCoverage: 65 },
  NO: { pipeline: 56.0, revenue: 54.6, coverage: 49, reuse: 57, signals: 162, conv: 15, outreach: 40, meetings: 24, oppsCreated: 18, stageConv: 32, pTarget: 130, rTarget: 72, cTarget: 60, clients: 285, targetAccounts: 100, activeAccounts: 50, campaigns: 9, partners: 19, assets: 108, agents: 9, qualifiedLeads: 15, tBookings: 96, tPipeline: 62, tCoverage: 60 },
};

export const KPI_COUNTRY: Record<string, KpiSet> = {
  Sweden: { pipeline: 16.2, revenue: 19.4, coverage: 53, reuse: 60, signals: 51, conv: 5, outreach: 17, meetings: 8, oppsCreated: 6, stageConv: 31, pTarget: 32, rTarget: 26, cTarget: 62 },
  Finland: { pipeline: 12.8, revenue: 14.1, coverage: 54, reuse: 58, signals: 44, conv: 4, outreach: 14, meetings: 7, oppsCreated: 5, stageConv: 29, pTarget: 26, rTarget: 18, cTarget: 60 },
  Norway: { pipeline: 9.6, revenue: 11.3, coverage: 45, reuse: 55, signals: 36, conv: 3, outreach: 10, meetings: 5, oppsCreated: 4, stageConv: 28, pTarget: 22, rTarget: 15, cTarget: 60 },
  Denmark: { pipeline: 8.4, revenue: 9.8, coverage: 45, reuse: 56, signals: 31, conv: 3, outreach: 9, meetings: 4, oppsCreated: 3, stageConv: 27, pTarget: 20, rTarget: 13, cTarget: 60 },
};

export const NAV: { id: string; label: string; ico: string; sect?: string }[] = [
  { id: "dashboard", label: "Dashboard", ico: "📊" },
  { id: "pipeline", label: "Pipeline Explorer", ico: "🎯" },
  { id: "campaigns", label: "Campaigns", ico: "📣" },
  { id: "solutions", label: "Solutions & Assets", ico: "🧩" },
  { id: "radar", label: "Triggers Radar", ico: "📡" },
  { id: "agents", label: "Smart Agents", ico: "🤖" },
];

// Core domain types for the MM Factory Portal mock data model

export type BU = { code: string; name: string; hasCountries: boolean; countries?: string[] };

export type Role = { n: string; rights: string; view: string };

export type PortalView = { d: string; nav: string[] };

export type Account = {
  n: string; bu: string; sector: string; tier: number; owner: string; src: string; country?: string;
};

export type Prospect = {
  id: string; n: string; bu: string; ind: string; tcv: number; st: number; own: string; sign: string;
  src: string; batch: string; qual: string; oppId?: string; country?: string;
};

export type Interaction = {
  pid: string; type: string; date: string; seller: string; notes: string; next: string; status: string; due: string;
};

export type Batch = {
  id: string; file: string; bu: string; by: string; when: string; rows: number; ok: number; bad: number; status: string;
};

export type BatchRecord = {
  batch: string; row: number; company: string; res: string; reason: string;
};

export type Opp = {
  id: string; n: string; acct: string; bu: string; ind: string; val: number; stage: string; own: string; close: string;
  status: string; mm: boolean; sol: string; prob: number; comp: string; pid?: string; country?: string;
};

export type Solution = {
  n: string; cls: string; tag: string; mat: string; cert: string; reuse: number;
};

export type Asset = {
  n: string; type: string; ver: string; cert: string; sol: string; carve: boolean;
};

export type PlayTemplate = { n: string; ch: string; steps: number; sol: string; status?: string };

export type CampaignMetrics = { reached: number; outreach: number; meetings: number; pipe: number; oppsGen: number; wins: number };

export type Campaign = {
  n: string; bu: string; status: string; sol: string; engine: string; owner: string; approver: string;
  start: string; end: string; accts: number; m: CampaignMetrics; signalDriven: boolean; country?: string;
};

export type UploadedAcct = {
  n: string; bu: string; sector: string; camp: string; owner: string; sf: string; conf: string; country?: string;
};

export type CampHistory = { c: string; when: string; who: string; what: string };

export type Engine = { n: string; bu: string; clients: number; rules: number; sched: string; signals: number };

export type Signal = {
  bu: string; acct: string; engine: string; title: string; src: string; score: number; sev: string; status: string; sum: string; country?: string;
};

export type Connector = { n: string; type: string; cred: string; lic: string; active: boolean; used: string };

export type Agent = {
  n: string; stage: string; ic: string; type: string; status: string; ver: string; d: string; grounding: string[];
};

export type AgentUsage = {
  n: string; inv: number; users: number; rating: number; outputs: number;
  byBu: Record<string, number>; lastUsed: string; byCountry: Record<string, number>;
  byRole: Record<string, number>; trend: string; fb: string;
};

export type Council = { n: string; cad: string; scope: string; next: string; chair: string; dec: number; act: number };
export type Meeting = { council: string; date: string; att: string; notes: string; dec: number; act: number };
export type Decision = { d: string; o: string; dt: string; s: string; ref: string };
export type ActionItem = { a: string; o: string; due: string; s: string };

export type KpiSet = {
  pipeline: number; revenue: number; coverage: number; reuse: number; signals: number; conv: number;
  outreach: number; meetings: number; oppsCreated: number; stageConv: number;
  pTarget: number; rTarget: number; cTarget: number;
};

export type Scope = { bu: string; country: string };

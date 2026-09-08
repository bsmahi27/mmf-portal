"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useApp } from "@/lib/state";
import { DrawerHost } from "@/lib/drawer";
import Dashboard from "./pages/Dashboard";
import Prospects from "./pages/Prospects";
import Campaigns from "./pages/Campaigns";
import Solutions from "./pages/Solutions";
import Radar from "./pages/Radar";
import Agents from "./pages/Agents";
import GovernancePage from "./pages/Governance";
import Admin from "./pages/Admin";
import Scope from "./pages/Scope";
import Login from "./Login";

const PAGES: Record<string, React.ComponentType> = {
  dashboard: Dashboard, prospects: Prospects, campaigns: Campaigns, solutions: Solutions,
  radar: Radar, agents: Agents, governance: GovernancePage, admin: Admin, scope: Scope,
};

export default function Shell() {
  const { current, isAuthed } = useApp();
  const Page = PAGES[current] || Dashboard;
  if (!isAuthed) return <Login />;
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <Page />
      </div>
      <DrawerHost />
    </div>
  );
}

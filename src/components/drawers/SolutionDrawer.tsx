"use client";

import React from "react";
import { ASSETS, CAMPAIGNS, PLAY_TEMPLATES } from "@/lib/data";
import { SolutionDto } from "@/lib/solutions-api";
import { can, useApp } from "@/lib/state";
import { Badge } from "../ui";

const certColor: Record<string, string> = {
    "Certified & Published": "green",
    Submitted: "amber",
    Draft: "gray",
};

export default function SolutionDrawer({ s }: { s: SolutionDto }) {
    const { role } = useApp();

    const isAssetLead =
        role === "Factory Solution & Assets Lead";

    const rw = can(role, "Solutions & Assets", true);

    const assets = ASSETS.filter((a) => a.sol === s.name);

    const plays = PLAY_TEMPLATES.filter(
        (p) => p.sol === s.name
    );

    const campaigns = CAMPAIGNS.filter(
        (c) => c.sol === s.name
    );

    return (
        <div>
            <div className="muted mb">
                {s.tags.join(", ")}
            </div>

            <div className="flex wrapf mb">
                <Badge
                    cls={
                        s.maturity === "Industrialized"
                            ? "green"
                            : s.maturity === "In-Development"
                                ? "amber"
                                : "gray"
                    }
                >
                    {s.maturity}
                </Badge>

                <Badge
                    cls={
                        certColor[s.certificationStatus] || "gray"
                    }
                >
                    {s.certificationStatus}
                </Badge>

                <span className="muted">
          Maintained by Solution Architect / SME
        </span>
            </div>

            <h3 className="mt">
                Assets ({assets.length})
            </h3>

            {assets.length ? (
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Version</th>
                        <th>Certification</th>
                    </tr>
                    </thead>

                    <tbody>
                    {assets.map((a) => (
                        <tr key={a.n}>
                            <td>
                                {a.n}
                                {a.carve && (
                                    <Badge cls="blue">
                                        reusable
                                    </Badge>
                                )}
                            </td>

                            <td>{a.type}</td>

                            <td>{a.ver}</td>

                            <td>
                                <Badge cls={certColor[a.cert]}>
                                    {a.cert}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="muted">
                    No assets attached yet.
                </div>
            )}

            <div className="legend mt6">
                Stored as SharePoint links with version history.
                Reuse is counted per link or download.
            </div>

            <h3 className="mt">Play templates</h3>

            {plays.length ? (
                plays.map((p) => (
                    <span key={p.n} className="chip">
            {p.n}
          </span>
                ))
            ) : (
                <span className="muted">None yet</span>
            )}

            <h3 className="mt">Used in campaigns</h3>

            {campaigns.length ? (
                campaigns.map((c) => (
                    <span key={c.n} className="chip">
            {c.n}
          </span>
                ))
            ) : (
                <span className="muted">—</span>
            )}

            <div className="legend mt6">
                Reused {s.reuseCount}× — feeds the %
                industrialized KPI.
            </div>

            <div className="flex mt wrapf">
                <button className="btn ghost sm">
                    Open in SharePoint ↗
                </button>

                {s.certificationStatus === "Submitted" && (
                    <button
                        className="btn sm"
                        disabled={!isAssetLead}
                        title={
                            !isAssetLead
                                ? "Only the Factory Solution & Assets Lead can publish."
                                : ""
                        }
                    >
                        Certify & publish
                    </button>
                )}

                {s.certificationStatus === "Draft" && (
                    <button
                        className="btn sm"
                        disabled={!rw}
                    >
                        Submit for certification
                    </button>
                )}
            </div>
        </div>
    );
}
"use client";
import React from "react";
import { BATCH_RECORDS } from "@/lib/data";
import type { Batch } from "@/lib/types";
import { buName } from "@/lib/state";
import { Badge } from "../ui";

export default function BatchDrawer({ b }: { b: Batch }) {
  const records = BATCH_RECORDS.filter((r) => r.batch === b.id);
  return (
    <div>
      <div className="flex wrapf mb">
        <span className="badge b-gray">{b.id}</span>
        <Badge cls={b.status === "Committed" ? "green" : "amber"}>{b.status}</Badge>
        <span className="muted">{buName(b.bu)}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi"><div className="lab">Rows read</div><div className="val">{b.rows}</div></div>
        <div className="kpi"><div className="lab">Accepted</div><div className="val">{b.ok}</div></div>
        <div className="kpi"><div className="lab">Rejected</div><div className="val">{b.bad}</div></div>
      </div>
      <h3 className="mt">Batch metadata</h3>
      <table>
        <tbody>
          <tr><td className="muted">Uploaded by</td><td>{b.by}</td></tr>
          <tr><td className="muted">When</td><td>{b.when}</td></tr>
          <tr><td className="muted">Batch status</td><td>{b.status}</td></tr>
        </tbody>
      </table>
      <h3 className="mt">Record-level results</h3>
      <table>
        <thead><tr><th>Row</th><th>Company</th><th>Result</th><th>Reason</th></tr></thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.row}</td><td>{r.company}</td>
              <td><Badge cls={r.res === "Accepted" ? "green" : "red"}>{r.res}</Badge></td>
              <td className={r.res === "Rejected" ? "" : "legend"}>{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend mt6">Rejected records display an actionable validation reason so the uploader can fix and resubmit.</div>
      {b.status !== "Committed" && (
        <div className="flex mt wrapf">
          <button className="btn sm">Approve & commit</button>
          <button className="btn gray sm">Download rejects</button>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { ASSETS, SOLUTIONS } from "@/lib/data";
import {listPartnerPlays, PartnerPlayDto, createPartnerPlay, PartnerPlayInput, PARTNER_PLAY_STATUSES ,deletePartnerPlay,updatePartnerPlay} from "@/api/partner-plays-api";
import { useApp } from "@/lib/state";
import { Badge, Chip, Tabs } from "@/components/ui";
import { useDrawer } from "@/lib/drawer";
import SolutionDrawer from "@/components/drawers/SolutionDrawer";
import PartnerPlayDrawer from "@/components/drawers/PartnerPlayDrawer";

const TABS = ["Assets by Business Line", "Solutions", "Partner Plays"];
const certColor: Record<string, string> = { "Certified & Published": "green", "Submitted": "amber", "Draft": "gray" };
const clsColor: Record<string, string> = { "Industry": "teal", "Business Line": "violet", "Cross-BL": "blue", "Cross-Business Line": "blue" };

export default function Solutions() {
  const { subview, setSub, role } = useApp();
  const tab = subview["solutions"] || TABS[0];
  const setTab = (t: string) => setSub("solutions", t);

  return (
    <div className="wrap">
      <h2 className="page">Solutions & Assets</h2>
      <p className="sub">Grouped by Business Line first · tagged to themes and campaigns · partner plays linkable into campaigns</p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "Assets by Business Line" && <AssetLibrary />}
      {tab === "Solutions" && <Catalog role={role} />}
      {tab === "Partner Plays" && <Plays />}
    </div>
  );
}

function Catalog({ role }: { role: string }) {
  const drawer = useDrawer();
  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const filterKeys = ["Industry", "Business Line", "Cross-Business Line", "Industrialized", "Certified & Published"];
  const active = Object.keys(filters).filter((k) => filters[k]);
  const filtered = SOLUTIONS.filter((s) => !active.length || active.includes(s.cls) || active.includes(s.mat) || active.includes(s.cert));
  const isAssetLead = role === "Factory Solution & Assets Lead";

  return (
    <>
      <div className="mb wrapf flex"><span className="muted" style={{ marginRight: 4 }}>Filter:</span>
        {filterKeys.map((k) => <Chip key={k} on={!!filters[k]} onClick={() => setFilters((v) => ({ ...v, [k]: !v[k] }))}>{k}</Chip>)}
      </div>
      <div className="cols">
        {filtered.map((s) => (
          <div key={s.n} className="card" style={{ cursor: "pointer" }} onClick={() => drawer.open(s.n, <span className="muted">{s.tag}</span>, <SolutionDrawer s={s} />)}>
            <div className="flex wrapf mb"><Badge cls={clsColor[s.cls]}>{s.cls}</Badge><Badge cls={s.mat === "Industrialized" ? "green" : s.mat === "In-Development" ? "amber" : "gray"}>{s.mat}</Badge></div>
            <b>{s.n}</b>
            <div className="legend">{s.tag}</div>
            <div className="legend mt6">{ASSETS.filter((a) => a.sol === s.n).length} assets · reused {s.reuse}×</div>
            <div className="mt6"><Badge cls={certColor[s.cert]}>{s.cert}</Badge></div>
          </div>
        ))}
      </div>
      <div className="legend mt">Certification workflow: Draft → Submitted → Certified & Published. Signed off by Factory Solution & Assets Lead. Published means reusable by every BU. Files live in SharePoint; portal stores metadata, link, version pointer. {isAssetLead ? "You hold publishing rights." : `Publishing unavailable to ${role}.`}</div>
    </>
  );
}

function AssetLibrary() {
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("All");
  const themes = [...new Set(ASSETS.map((asset) => asset.th || "Other"))];
  const filtered = ASSETS.filter((a) => JSON.stringify(a).toLowerCase().includes(q.toLowerCase()) && (theme === "All" || a.th === theme));
  const groups = [...new Set(filtered.map((a) => a.bl || "Other"))];
  const owners = ["S. de Vries", "K. Weber", "R. Patel", "A. Lindqvist", "M. Jansen", "T. Schmidt"];
  const maintenance = ASSETS.map((asset, index) => {
    const cycle = asset.type === "Battle card" ? 6 : asset.type === "Deck" || asset.type === "Sales kit" ? 9 : asset.type === "Case study" ? 18 : 12;
    const reviewMonth = (index * 2) % 12;
    const lastReview = new Date(2026, reviewMonth, 10);
    const nextReview = new Date(lastReview.getFullYear(), lastReview.getMonth() + cycle, 10);
    const month = nextReview.toLocaleString("en-US", { month: "short" });
    return { asset, cycle, owner: owners[index % owners.length], lastReview: `${lastReview.toLocaleString("en-US", { month: "short" })} ${lastReview.getFullYear()}`, nextReview: `${month} ${nextReview.getFullYear()}`, due: nextReview <= new Date(2026, 11, 31) };
  });
  const certified = ASSETS.filter((asset) => asset.cert === "Certified" || asset.cert === "Certified & Published").length;
  const refreshDue = maintenance.filter((item) => item.due).length;
  const lifecycle = [
    ["1 · Draft", "Created, not yet submitted"],
    ["2 · Submitted", "Owner submits for certification"],
    ["3 · Certified", "Approved by the BL asset owner and reusable across countries"],
    ["4 · In refresh", "Review date passed and the owner updates content"],
    ["5 · Re-certified", "Refreshed asset re-approved and version incremented"],
    ["6 · Retired", "Superseded or no longer relevant; link retained"],
  ];
  return (
    <>
      <div className="flex wrapf mb">
        <div className="muted">{ASSETS.length} assets · <Badge cls="green">{certified} certified</Badge> <Badge cls="amber">{refreshDue} due for refresh</Badge></div>
        <div className="flex wrapf" style={{ marginLeft: "auto" }}><button className="btn sm">⬆ Upload asset</button><button className="btn ghost sm">🔗 Add external / repository link</button></div>
      </div>
      <input className="t mb" placeholder="Search assets…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
      <div className="mb"><span className="legend">Filter by theme: </span><Chip on={theme === "All"} onClick={() => setTheme("All")}>All</Chip>{themes.map((item) => <Chip key={item} on={theme === item} onClick={() => setTheme(theme === item ? "All" : item)}>{item}</Chip>)}</div>
      {groups.map((group) => <div className="card mb" key={group}>
        <div className="flex between mb"><h3 style={{ margin: 0 }}>{group}</h3><span className="legend">{filtered.filter((a) => (a.bl || "Other") === group).length} assets</span></div>
        <table><thead><tr><th>Asset</th><th>Theme</th><th>Type</th><th>Source repository</th><th>Ver</th><th>Certification</th><th>Reuse</th></tr></thead>
          <tbody>{filtered.filter((a) => (a.bl || "Other") === group).map((a) => <tr key={a.n}>
            <td><b>{a.n}</b></td><td><span className="chip">{a.th || a.sol}</span></td><td>{a.type}</td><td className="muted">{a.repo || "Repository link"}</td><td>{a.ver}</td>
            <td><Badge cls={certColor[a.cert]}>{a.cert === "Certified & Published" ? "Certified" : a.cert}</Badge></td><td>{a.reuse ?? (a.carve ? "Yes" : "—")}×</td>
          </tr>)}</tbody>
        </table>
      </div>)}
      <div className="card mt">
        <h3>Asset refresh &amp; maintenance lifecycle</h3>
        <p className="muted" style={{ fontSize: 12.5 }}>Every asset carries a named owner and a refresh cycle. Assets that pass their review date move to <b>In refresh</b> and stay out of the certified reuse count until re-certified.</p>
        <div className="flow">{lifecycle.map(([name, detail]) => <div className="fs" key={name}><b>{name}</b><span className="legend">{detail}</span></div>)}</div>
        <h3 className="mt">Maintenance queue — assets due for refresh</h3>
        <table><thead><tr><th>Asset</th><th>BL</th><th>Owner</th><th>Cycle</th><th>Last review</th><th>Next review</th><th>Lifecycle state</th><th /></tr></thead>
          <tbody>{maintenance.filter((item) => item.due).map(({ asset, cycle, owner, lastReview, nextReview }) => <tr key={asset.n}><td><b>{asset.n}</b></td><td>{asset.bl}</td><td>{owner}</td><td>{cycle} mo</td><td className="muted">{lastReview}</td><td>{nextReview}</td><td><Badge cls="amber">In refresh</Badge></td><td><button className="btn ghost sm">Request refresh</button></td></tr>)}</tbody>
        </table>
        <div className="legend mt">Reminders are raised to the asset owner before the review date. Retired assets stay searchable with a clear Retired badge so historical proposals remain traceable.</div>
      </div>
      <div className="card mt"><b>Harvesting sources</b><div className="mt6">{["Exports", "TLC", "MSDT portal", "Proposal assets", "Case studies", "Sales kits", "Battle cards", "Marketing collateral"].map((source) => <span className="chip" key={source}>{source}</span>)}</div><div className="legend mt">Files stay in SharePoint or their existing repository; the portal stores metadata and the link.</div></div>
    </>
  );
}

function Plays() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const drawer = useDrawer();
    const [isEditing, setIsEditing] = useState(false);
    const [plays, setPlays] = useState<PartnerPlayDto[]>([]);
    const [form, setForm] = useState<PartnerPlayDto>({
        id:0,
        name: "",
        partnerName: "",
        partnerTier: "",
        businessLine: "",
        theme: "",
        eligibleCountryCodes: [],
        status: "Draft",
        valueProposition: "",
        influencedPipelineMillions: 0,
        linkedCampaignCount: 0,
        ownerName: ""
    });
    const handleDeletePartnerPlay = async (
        id: number | undefined,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        if (!window.confirm("Delete this Partner Play?")) {
            return;
        }

        try {
            await deletePartnerPlay(id);

            setPlays((prev) =>
                prev.filter((play) => String(play.id) !== String(id))
            );
        } catch (err) {
            console.error(err);
            alert("Failed to delete Partner Play");
        }
    };

    const resetForm = () => {
        setForm({
            id: 0,
            name: "",
            partnerName: "",
            partnerTier: "",
            businessLine: "",
            theme: "",
            eligibleCountryCodes: [],
            status: "Draft",
            valueProposition: "",
            influencedPipelineMillions: 0,
            linkedCampaignCount: 0,
            ownerName: ""
        });

        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            if (
                !form.name ||
                !form.partnerName ||
                !form.businessLine
            ) {
                alert("Please fill required fields");
                return;
            }

            if (isEditing) {
                await updatePartnerPlay(form.id, form);
            } else {
                await createPartnerPlay(form);
            }

            const data = await listPartnerPlays();
            setPlays(data);

            resetForm();

            setShowCreateModal(false);
            setIsEditing(false);
        } catch (err) {
            console.error(err);

            alert(
                isEditing
                    ? "Failed to update partner play"
                    : "Failed to save partner play"
            );
        }
    };

    const handleEdit = (play: PartnerPlayDto, e: React.MouseEvent) => {
        e.stopPropagation();

        setForm({
            ...play
        });

        setIsEditing(true);
        setShowCreateModal(true);
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const data = await listPartnerPlays();
                console.log("Partner Plays Response", data);

                setPlays(Array.isArray(data) ? data : []);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || "Failed to load partner plays");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);
    if (loading) {
        return <div className="legend">Loading partner plays...</div>;
    }

    if (error) {
        return (
            <div className="card">
                <div style={{ color: "red" }}>
                    Failed to load partner plays
                </div>
                <div className="legend">
                    {error}
                </div>
            </div>
        );
    }

    {plays.length === 0 && (
        <div className="legend">No partner plays found.</div>
    )}

    return (
        <>
            <div className="flex between wrapf mb">
        <span className="legend">
          {plays.filter((p) => p.status === "Active").length}
            {" "}active partner plays · €
            {plays
                .reduce(
                    (sum, p) => sum + (p.influencedPipelineMillions || 0),
                    0
                )
                .toFixed(1)}
            M influenced pipeline
        </span>

                <button
                    className="btn sm"
                    onClick={() => setShowCreateModal(true)}
                >
                    + New partner play
                </button>
            </div>

            <div className="cols">
                {plays.map((play) => (
                    <div
                        className="card"
                        key={play.id}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            drawer.open(
                                play.name,
                                <span className="muted">
                {play.partnerName} • {play.partnerTier}
            </span>,
                                <PartnerPlayDrawer play={play} />
                            )
                        }
                    >
                        <div className="flex between mb">
                            <Badge cls="amber">
                                🤝 {play.partnerName}
                            </Badge>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <Badge
                                    cls={
                                        play.status === "Active"
                                            ? "green"
                                            : play.status === "Paused"
                                                ? "amber"
                                                : "gray"
                                    }
                                >
                                    {play.status}
                                </Badge>
                                <button className="btn ghost sm" onClick={(e) => handleEdit(play, e)}>✎ Edit
                                </button>

                                <div
                                    className="x"
                                    title="Delete Partner Play"
                                    onClick={(e) => {
                                        console.log("Deleting play", play);
                                        console.log("Deleting id", play.id);
                                        handleDeletePartnerPlay(play.id, e);
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        lineHeight: 1
                                    }}
                                >
                                    ×
                                </div>
                            </div>
                        </div>

                        <b>{play.name}</b>

                        <div className="legend mt6">
                            {play.businessLine} · {play.partnerTier} partner ·{" "}
                            {play.ownerName}
                        </div>

                        <p style={{ fontSize: 12.2 }}>
                            {play.valueProposition}
                        </p>

                        <div className="legend">
                            {play.linkedCampaignCount} campaigns · €
                            {play.influencedPipelineMillions?.toFixed(1)}M influenced ·{" "}
                            {play.eligibleCountryCodes?.join(", ")}
                        </div>
                    </div>
                ))}
            </div>

            <div className="legend mt">
                Partner plays are packaged joint motions linked into campaigns;
                they are not copied into campaign records.
            </div>
            {showCreateModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="partner-play-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>
                                {isEditing
                                    ? "Edit Partner Play"
                                    : "Create Partner Play"}
                            </h2>

                            <button
                                className="close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <p className="required-text">
                            Fields marked with <span>*</span> are required
                        </p>

                        <div className="card">
                            <h3>Partner Information</h3>

                            <div className="f2">
                                <div>
                                    <label className="fl">Play Name *</label>
                                    <input
                                        className="t"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="fl">Partner Name *</label>
                                    <input
                                        className="t"
                                        value={form.partnerName}
                                        onChange={(e) =>
                                            setForm({ ...form, partnerName: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="fl">Partner Tier *</label>
                                    <select
                                        className="t"
                                        value={form.partnerTier}
                                        onChange={(e) =>
                                            setForm({ ...form, partnerTier: e.target.value })
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Bronze">Bronze</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card mt">
                            <h3>Business Information</h3>

                            <div className="f2">
                                <div>
                                    <label className="fl">Theme *</label>
                                    <input
                                        className="t"
                                        value={form.theme}
                                        onChange={(e) =>
                                            setForm({ ...form, theme: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="fl">Business Line *</label>
                                    <input
                                        className="t"
                                        value={form.businessLine}
                                        onChange={(e) =>
                                            setForm({ ...form, businessLine: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="fl">Owner Name *</label>
                                    <input
                                        className="t"
                                        value={form.ownerName}
                                        onChange={(e) =>
                                            setForm({ ...form, ownerName: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="fl">Status</label>
                                    <select
                                        className="t"
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                status: e.target.value as PartnerPlayDto["status"],
                                            })
                                        }
                                    >
                                        {PARTNER_PLAY_STATUSES.map((s) => (
                                            <option key={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card mt">
                            <h3>Coverage Information</h3>

                            <label className="fl">Countries</label>

                            <input
                                className="t"
                                placeholder="IN, DE, UK"
                                value={form.eligibleCountryCodes.join(",")}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        eligibleCountryCodes: e.target.value
                                            .split(",")
                                            .map((c) => c.trim())
                                            .filter(Boolean),
                                    })
                                }
                            />
                        </div>

                        <div className="card mt">
                            <h3>Value Proposition</h3>

                            <label className="fl">Description</label>

                            <textarea
                                className="t"
                                rows={4}
                                value={form.valueProposition}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        valueProposition: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="card mt">
                            <h3>Financial Information</h3>

                            <div className="f2">
                                <div>
                                    <label className="fl">Pipeline (€M)</label>
                                    <input
                                        type="number"
                                        className="t"
                                        value={form.influencedPipelineMillions}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                influencedPipelineMillions: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="fl">Campaign Count</label>
                                    <input
                                        type="number"
                                        className="t"
                                        value={form.linkedCampaignCount}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                linkedCampaignCount: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt">
                            <button className="btn" onClick={handleSave}>
                                {isEditing
                                    ? "Update Partner Play"
                                    : "Save Partner Play"}
                            </button>

                            <button
                                className="btn ghost"
                                style={{ marginLeft: 8 }}
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        </div>
                    </div>
            )}
        </>
    );
}


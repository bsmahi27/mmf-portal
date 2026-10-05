import { Badge } from "@/components/ui";
import { PartnerPlayDto ,getLinkedCampaigns} from "@/api/partner-plays-api";
import {useState, useEffect} from "react";


export default function PartnerPlayDrawer({play,}: {
    play: PartnerPlayDto;

}) {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [showCampaigns, setShowCampaigns] = useState(false);
    const handleViewCampaigns = async () => {
        try {
            const data = await getLinkedCampaigns(play.id!);

            setCampaigns(data);
            setShowCampaigns(true);
        } catch (err) {
            console.error(err);
            alert("Failed to load campaigns");
        }
    };

    return (
        <div>
            <div className="">
                <Badge cls="amber">
                    🤝 {play.partnerName} • {play.partnerTier}
                </Badge>

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
            </div>

            <p
                style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    marginBottom: "24px",
                }}
            >
                {play.valueProposition}
            </p>

            <table>
                <tbody>
                <tr>
                    <td><b>BUSINESS LINE</b></td>
                    <td>{play.businessLine}</td>
                </tr>

                <tr>
                    <td><b>THEME</b></td>
                    <td>{play.theme}</td>
                </tr>

                <tr>
                    <td><b>ELIGIBLE COUNTRIES</b></td>
                    <td>
                        {play.eligibleCountryCodes?.join(", ")}
                    </td>
                </tr>

                <tr>
                    <td><b>OWNER</b></td>
                    <td>{play.ownerName}</td>
                </tr>

                <tr>
                    <td><b>LINKED CAMPAIGNS</b></td>
                    <td>{play.linkedCampaignCount}</td>
                </tr>

                <tr>
                    <td><b>INFLUENCED PIPELINE</b></td>
                    <td>
                        €
                        {(
                            play.influencedPipelineMillions || 0
                        ).toFixed(1)}
                        M
                    </td>
                </tr>
                </tbody>
            </table>

            <div style={{ marginTop: 24 }}>
                <h3>Campaigns carrying this play</h3>

                <div className="chip">
                    {play.linkedCampaignCount} linked campaign(s)
                </div>

                <div className="card">

                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                        }}
                    >
                        {/* Always visible */}
                        <div className="card">
                            <button className="btn ghost">
                                Link to Campaign
                            </button>
                        </div>

                        {/* Toggle only this section */}
                        <div className="card">
                            {!showCampaigns ? (
                                <button
                                    className="btn ghost"
                                    onClick={handleViewCampaigns}
                                >
                                    View Campaigns
                                </button>
                            ) : (
                                <>
                                    <div className="flex between mb">
                                        <b>Linked Campaigns</b>

                                        <div
                                            className="x"
                                            title="Close"
                                            onClick={() => {
                                                setShowCampaigns(false);
                                                setCampaigns([]);
                                            }}
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                lineHeight: 1,
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>

                                    <table>
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Owner</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign.id}>
                                                <td>{campaign.id}</td>
                                                <td>{campaign.name}</td>
                                                <td>{campaign.status}</td>
                                                <td>{campaign.ownerName}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}



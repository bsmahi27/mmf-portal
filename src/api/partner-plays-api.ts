export const PARTNER_PLAY_STATUSES = [
  "Draft",
  "Active",
  "Paused",
  "Closed",
] as const;

export type PartnerPlayStatus =
    (typeof PARTNER_PLAY_STATUSES)[number];
console.log(
    "API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL
);

export type PartnerPlayDto = {
    id?: number;
  name: string;
  partnerName: string;
  partnerTier: string;
  businessLine: string;
  theme: string;
  eligibleCountryCodes: string[];
  status: PartnerPlayStatus;
  valueProposition: string;
  influencedPipelineMillions: number;
  linkedCampaignCount: number;
  ownerName: string;
};

export type PartnerPlayInput = Omit<
    PartnerPlayDto,
    "influencedPipelineMillions" | "linkedCampaignCount"
>;

const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:9004"
).replace(/\/$/, "");

async function request<T>(
    path: string,
    init?: RequestInit
): Promise<T> {

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            ...init,
            headers: {
                Accept: "application/json",
                ...(init?.body
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...init?.headers,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
    }

    // Handle DELETE/204 responses
    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();

    return text ? JSON.parse(text) : (undefined as T);
}

export function listPartnerPlays(
    countryName?: string,
    signal?: AbortSignal
) {
  const params = new URLSearchParams();

  if (countryName) {
    params.set("countryName", countryName);
  }

  const query = params.size
      ? `?${params.toString()}`
      : "";

  return request<PartnerPlayDto[]>(
      `/api/v1/partner-plays${query}`,
      { signal }
  );
}

export async function createPartnerPlay(payload: any) {
    return request(
        "/api/v1/partner-plays",
        {
            method: "POST",
            body: JSON.stringify(payload)
        }
    );
}

export async function deletePartnerPlay(
    id: number | undefined
) {
    return request<void>(
        `/api/v1/partner-plays/${id}`,
        {
            method: "DELETE",
        }
    );
}

export async function updatePartnerPlay(
    id: number,
    payload: PartnerPlayInput
) {
    return request(
        `/api/v1/partner-plays/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(payload),
        }
    );
}

export function retirePartnerPlay(name: string) {
  return request<void>(
      `/partner-plays/${encodeURIComponent(name)}`,
      {
        method: "DELETE",
      }
  );
}

export async function getLinkedCampaigns(
    partnerPlayId: number
) {
    return request<any[]>(
        `/api/v1/partner-plays/${partnerPlayId}/campaigns`
    );
}
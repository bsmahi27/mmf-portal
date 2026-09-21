export const PARTNER_PLAY_STATUSES = ["Draft", "Active", "Paused", "Closed"] as const;

export type PartnerPlayStatus = (typeof PARTNER_PLAY_STATUSES)[number];

export type PartnerPlayDto = {
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

export type PartnerPlayInput = Omit<PartnerPlayDto, "influencedPipelineMillions" | "linkedCampaignCount">;

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const error = await response.json() as { message?: string };
      if (error.message) message = error.message;
    } catch {
      // Keep the HTTP status when the backend does not return an API error body.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function listPartnerPlays(countryName?: string, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (countryName) params.set("countryName", countryName);
  const query = params.size ? `?${params.toString()}` : "";
  return request<PartnerPlayDto[]>(`/partner-plays${query}`, { signal });
}

export function createPartnerPlay(input: PartnerPlayInput) {
  return request<PartnerPlayDto>("/partner-plays", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePartnerPlay(originalName: string, input: PartnerPlayInput) {
  return request<PartnerPlayDto>(`/partner-plays/${encodeURIComponent(originalName)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function retirePartnerPlay(name: string) {
  return request<void>(`/partner-plays/${encodeURIComponent(name)}`, { method: "DELETE" });
}

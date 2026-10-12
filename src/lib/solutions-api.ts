export type SolutionDto = {
    id: number;
    name: string;
    solutionClass: string;
    tags: string[];
    maturity: string;
    certificationStatus: string;
    reuseCount: number;
};

export type SolutionInput = SolutionDto;

const API_BASE_URL = "http://localhost:8080/api/v1";

console.log("API_BASE_URL =", API_BASE_URL);

async function request<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            ...(init?.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...init?.headers,
        },
    });

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        try {
            const error = (await response.json()) as {
                message?: string;
            };

            if (error.message) {
                message = error.message;
            }
        } catch {
            // ignore response parsing errors
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export function listSolutions(
    signal?: AbortSignal
) {
    return request<SolutionDto[]>(
        "/solutions",
        { signal }
    );
}

export function createSolution(
    input: SolutionInput
) {
    return request<SolutionDto>(
        "/solutions",
        {
            method: "POST",
            body: JSON.stringify(input),
        }
    );
}

export function updateSolution(
    originalName: string,
    input: SolutionInput
) {
    return request<SolutionDto>(
        `/solutions/${encodeURIComponent(originalName)}`,
        {
            method: "PUT",
            body: JSON.stringify(input),
        }
    );
}

export function retireSolution(
    name: string
) {
    return request<void>(
        `/solutions/${encodeURIComponent(name)}`,
        {
            method: "DELETE",
        }
    );
}
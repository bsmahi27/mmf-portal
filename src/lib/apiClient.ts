/*
 *
 * Enterprise-grade Axios client with full MSAL integration:
 *  - Silent token acquisition
 *  - Auto attach Bearer token
 *  - Request cancellation
 *  - Global error normalization
 *  - Retry logic for expired tokens
 *  - Handles InteractionRequired errors
 */

import axios, { AxiosInstance } from "axios";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import {  msalInstance } from "../auth/msalConfig";

// ----------------------------------
// Axios Instance Setup
// ----------------------------------
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 15000,  // 15s timeout (industry standard)
    headers: {
        "Content-Type": "application/json"
    },
});

// ----------------------------------
// Token Acquisition Helper
// ----------------------------------
export async function acquireAccessToken() {
    const accounts = msalInstance.getAllAccounts();
    const account = accounts[0];
    const tokenRequest = {
        scopes: [`api://${process.env.NEXT_PUBLIC_API_CLIENT_ID}/access_as_user`]
    };


    if (!account) {
        console.warn("No user account found. User likely not authenticated.");
        return null;
    }

    try {
        const tokenResponse = await msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account,
        });

        return tokenResponse.accessToken;

    } catch (error) {
        const isInteractionError =
            error instanceof InteractionRequiredAuthError ||
            error.errorCode === "interaction_required" ||
            error.errorCode === "login_required" ||
            error.errorCode === "consent_required" ||
            error.errorCode === "monitor_window_timeout";

        if (isInteractionError) {
            console.warn("Interaction required — redirecting user for login.");
            msalInstance.acquireTokenRedirect({
                ...tokenRequest,
                account,
            });
            return;
        }

        if (error.errorCode === "monitor_window_timeout") {
            console.error("Silent iframe blocked by browser.");
        }
        console.error("Silent token acquisition failed:", error);
        throw error;
    }
}

// ----------------------------------
// Request Interceptor
// ----------------------------------
apiClient.interceptors.request.use(
    async (config) => {
        const token = await acquireAccessToken();
        config.headers = config.headers || {};
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Preserve per-request content negotiation so non-JSON endpoints can opt in.
        if (!config.headers['Content-Type'] && config.data !== undefined) {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// ----------------------------------
// Response Interceptor (Error Normalization)
// ----------------------------------
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // --------------------------------------
        // Retry once if token expired (401)
        // --------------------------------------
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.info("Token expired — retrying request with new token");
                const token = await acquireAccessToken();

                if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }

                return apiClient(originalRequest);

            } catch (retryError) {
                console.error("Token refresh retry failed:", retryError);
            }
        }

        // --------------------------------------
        // Normalize network / timeout errors
        // --------------------------------------
        if (error.code === "ECONNABORTED") {
            return Promise.reject({
                message: "Request timeout — please try again.",
                code: "TIMEOUT",
            });
        }

        if (!error.response) {
            return Promise.reject({
                message: "Network error — check your connection.",
                code: "NETWORK_ERROR",
            });
        }

        // --------------------------------------
        // Normalize API Errors
        // --------------------------------------
        return Promise.reject({
            status: error.response.status,
            data: error.response.data,
            message:
                error.response.data?.message ||
                "An unexpected error occurred while processing your request.",
        });
    }
);

// ----------------------------------
// Cancellation Token Wrapper
// ----------------------------------
export const createCancelableRequest = () => {
    const controller = new AbortController();
    return {
        signal: controller.signal,
        cancel: () => controller.abort(),
    };
};


"use client";

import {
    PublicClientApplication,
    Configuration,
    AuthenticationResult,
} from "@azure/msal-browser";

const msalConfig: Configuration = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID ?? "",
        authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
        redirectUri:
            process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000"
    },
    cache: {
        cacheLocation: "localStorage",
    },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export async function initializeMsal() {
    try {
        await msalInstance.initialize();

        const response: AuthenticationResult | null =
            await msalInstance.handleRedirectPromise();

        if (response?.account) {
            msalInstance.setActiveAccount(response.account);
            return;
        }

        const accounts = msalInstance.getAllAccounts();

        if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
        }
    } catch (error) {
        console.error("MSAL initialization error:", error);
    }
}
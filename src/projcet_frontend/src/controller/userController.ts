import { AuthClient } from "@dfinity/auth-client";

import { user } from "../../../declarations/user";
import { session } from "../../../declarations/session";
import { HttpAgent } from "@dfinity/agent";

const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, ...valueParts] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }
    return null;
};


export const loginBtnClick = async (): Promise<boolean> => {
    try {
        const authClient = await AuthClient.create();

        await new Promise((resolve) => {
            authClient.login({
                identityProvider: process.env.II_URL || "https://identity.ic0.app/",
                onSuccess: resolve,
            });
        });

        const identity = authClient.getIdentity();
        const principalId = identity.getPrincipal().toString();

        const agent = new HttpAgent({ identity });

        // 🌟 Only fetch root key in local development
        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }

        console.log("Authenticated Principal:", principalId);

        // 🔥 Call backend login function
        const res = await user.login(principalId);
        if (!res) {
            console.log("Login Failed");
            return false;
        }

        console.log("Login successful:", res);

        // 🍪 Store session ID in a secure cookie
        document.cookie = `sessionId=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure; SameSite=Strict`;

        return true;
    } catch (err) {
        console.error("Login request failed:", err);
        return false;
    }
};

export const validateSession = async (): Promise<boolean> => {
    try {
        const sessionId = getCookie("sessionId");
        if (!sessionId) {
            console.log("No sessionId found in cookies.");
            return false;
        }

        // Create a new agent with the current identity
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });

        // Add root key fetching for local development
        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }

        const cleanSession = sessionId.replace(/^"|"$/g, '');
        const isValid = await session.validateSession(cleanSession);

        if (!isValid) {
            document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
        }

        return Boolean(isValid);
    } catch (error) {
        console.error("Session validation failed:", error);
        return false;
    }
};

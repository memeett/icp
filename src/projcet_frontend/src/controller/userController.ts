import { AuthClient } from "@dfinity/auth-client";
import { user } from "../../../declarations/user";
import { session } from "../../../declarations/session";

const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
};


export const loginBtnClick = async () => {
    try {
        let authClient = await AuthClient.create();

        await new Promise((resolve) => {
            authClient.login({
                identityProvider: process.env.II_URL,
                onSuccess: resolve,
            });
        });

        const identity = authClient.getIdentity();
        const principalId = identity.getPrincipal().toString();

        const res = await user.login(principalId);
        if (!res) {
            console.log("Login Failed");
        } else {
            console.log(res);
            document.cookie = `sessionId=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure`;
        }
    } catch (err) {
        console.error("Login request failed:", err);
    }
};

export const validateSession = async (): Promise<boolean> => {
    try {
        const sessionId = getCookie("sessionId");

        if (!sessionId) {
            console.log("No sessionId found in cookies.");
            return false;
        }
        const cleanSession = sessionId.replace(/^"|"$/g, '');
        
        const isValid = await session.validateSession(cleanSession);
        
        return isValid; // Ensure it returns a boolean
    } catch (error) {
        console.error("Session validation failed:", error);
        return false;
    }
};

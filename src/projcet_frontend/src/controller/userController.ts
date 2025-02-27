import { AuthClient } from "@dfinity/auth-client";
import { UpdateUserPayload, User } from "../interface/User";
import { user } from "../../../declarations/user";
import { session } from "../../../declarations/session";
import { HttpAgent } from "@dfinity/agent";
import { useState } from "react";

export const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, ...valueParts] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }
    return null;
    
};


export const loginWithInternetIdentity = async (): Promise<boolean> => {
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

        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }

        console.log("Authenticated Principal:", principalId);
        const res = await user.login(principalId);
        if (!res) {
            console.log("Login Failed");
            return false;
        }

        const userIdResult = await session.getUserIdBySession(res);
        console.log(userIdResult)
        if ("ok" in userIdResult) {
            const userId = userIdResult.ok;  
            const userDetail = await user.getUserById(userId);
            localStorage.setItem("current_user", JSON.stringify(userDetail))
            console.log(userDetail);
        } else {
            console.error("Error fetching user ID:", userIdResult.err);
            return false;
        }
        

        console.log("Login successful:", res);
        document.cookie = `cookie=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure; SameSite=Strict`;
        localStorage.setItem("session", JSON.stringify(res));
        return true;
    } catch (err) {
        console.error("Login request failed:", err);
        return false;
    }
};

export const validateCookie = async (): Promise<boolean> => {
    try {
        const cookie = getCookie("cookie");
        if (!cookie) {
            console.log("No cookie found.");
            return false;
        }

        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });

        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }

        const cleanSession = cookie.replace(/^"|"$/g, '');
        const isValid = await session.validateSession(cleanSession);

        if (!isValid) {
            document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
            localStorage.removeItem("session"); 
        } else {
            localStorage.setItem("session", cleanSession);
        }

        return Boolean(isValid);
    } catch (error) {
        console.error("Session validation failed:", error);
        return false;
    }
};

export const logout = async (): Promise<void> => {
    try {
        const sessionId = localStorage.getItem("session");
        if (!sessionId) {
            console.log("No session found in local storage.");
            return;
        }
        await session.logout(sessionId);
        localStorage.removeItem("session");
        document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
        console.log("Logged out successfully.");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};


export const fetchUserBySession = async (): Promise<User | null> => {
    try {
        const currSession = localStorage.getItem("session");
        if (!currSession) {
            throw new Error("No session found in local storage");
        }

        const result = await session.getUserIdBySession(JSON.parse(currSession));

        if ("ok" in result) {
            const principalId = result.ok;
            console.log("Principal ID:", principalId);

            const userRes = await user.getUserById(principalId);

            if ("ok" in userRes) {
                const userData = userRes.ok;

                const profilePictureData =
                    userData.profilePicture instanceof Uint8Array
                        ? userData.profilePicture
                        : new Uint8Array(userData.profilePicture);

                const profilePictureBlob = new Blob([profilePictureData], { type: "image/jpeg" });

                const user: User = {
                    ...userData,
                    profilePicture: profilePictureBlob,
                    createdAt: new Date(Number(userData.createdAt)),
                    updatedAt: new Date(Number(userData.updatedAt)),
                };

                console.log("User fetched:", user);
                return user;
            } else {
                console.error("Error fetching user:", userRes.err);
                return null;
            }
        } else {
            console.error("Error:", result.err);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by session:", error);
        return null;
    }
};


export const updateUserProfile = async (username: string, description: string): Promise<void> => {
    const cookie = getCookie("cookie");
    if (cookie) {
        try {
            const formattedPayload :UpdateUserPayload = {
                username: username ? [username] : [],
                email: [],
                description: description ? [description] : [],
            };

            await user.updateUser(cookie, formattedPayload);
        } catch (err) {
            console.error("Error updating user profile:", err);
        }
    }
};

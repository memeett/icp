import { AuthClient } from "@dfinity/auth-client";
import { UpdateUserPayload, User } from "../interface/User";
import { user } from "../../../declarations/user";
import { session } from "../../../declarations/session";
import { HttpAgent } from "@dfinity/agent";
import { useState } from "react";
import { get } from "http";

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

export const login = async (principalId: string): Promise<boolean> => {
    const defaultImagePath = "/assets/profilePicture/default_profile_pict.jpg";
    const response = await fetch(defaultImagePath);
    const imageBlob = await response.blob();

    const arrayBuffer = await imageBlob.arrayBuffer();
    const profilePicBlob = new Uint8Array(arrayBuffer);

    const res = await user.login(principalId, profilePicBlob);
    if (!res) {
        console.log("Login Failed");
        return false;
    }
    console.log("Login successful:", res);
    document.cookie = `cookie=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure; SameSite=Strict`;
    localStorage.setItem("session", JSON.stringify(res));
    const userIdResult = await session.getUserIdBySession(res);
    console.log(userIdResult);
    if ("ok" in userIdResult) {
      const userId = userIdResult.ok;
      const userDetail = await user.getUserById(userId);
      localStorage.setItem(
        "current_user",
        JSON.stringify(userDetail, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      console.log(userDetail);
    } else {
      console.error("Error fetching user ID:", userIdResult.err);
      return false;
    }
    return true;
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
        const defaultImagePath = "/assets/profilePicture/default_profile_pict.jpg";
        const response = await fetch(defaultImagePath);
        const imageBlob = await response.blob();

        const arrayBuffer = await imageBlob.arrayBuffer();
        const profilePicBlob = new Uint8Array(arrayBuffer);

        const res = await user.login(principalId, profilePicBlob);
        if (!res) {
            console.log("Login Failed");
            return false;
        }
        console.log("Login successful:", res);


        const userIdResult = await session.getUserIdBySession(res);
        console.log(userIdResult)
        if ("ok" in userIdResult) {
            const userId = userIdResult.ok;
            const userDetail = await user.getUserById(userId);
            localStorage.setItem("current_user", JSON.stringify(userDetail, (_, value) =>
                typeof value === "bigint" ? value.toString() : value
            ));
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
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
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
            await session.logout(cleanSession)
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
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        localStorage.removeItem("session");
        document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
        localStorage.removeItem("current_user");
    } catch (error) {
        console.error("Logout failed:", error);
    }
};


export const fetchUserBySession = async (): Promise<User | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }

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

                let profilePictureBlob: Blob;
                if (userData.profilePicture) {
                    const uint8Array = new Uint8Array(userData.profilePicture);
                    profilePictureBlob = new Blob([uint8Array.buffer], {
                        type: 'image/jpeg' // Adjust type as needed
                    });
                } else {
                    profilePictureBlob = new Blob([], { type: 'image/jpeg' });
                }

                const convertedUser: User = {
                    ...userData,
                    profilePicture: profilePictureBlob,
                    createdAt: new Date(Number(userData.createdAt)),
                    updatedAt: new Date(Number(userData.updatedAt)),
                };

                console.log("User fetched:", {
                    ...convertedUser,
                    profilePicture: convertedUser.profilePicture
                });

                return convertedUser;
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
        return null;
    }
};



export const updateUserProfile = async (payload: UpdateUserPayload): Promise<void> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }

    const cookie = localStorage.getItem("session");
    if (cookie) {
        try {
            const cleanSession = cookie.replace(/^"|"$/g, '');
            await user.updateUser(cleanSession, payload);
        } catch (err) {
            console.error("Error updating user profile:", err);
        }
    }
};

export const getAllUsers = async (): Promise<User[] | null> => {
    try {
        const result = await user.getAllUser();

        if (!result || !Array.isArray(result)) {
            console.error("Invalid response format:", result);
            return null;
        }

        const currentUserString = localStorage.getItem("current_user");
        if (!currentUserString) {
            console.error("Current user not found in localStorage");
            return null;
        }

        const currentUser = JSON.parse(currentUserString).ok;

        const otherUsers = result.filter((userData) => userData.id !== currentUser.id);

        const usersWithProfilePictures = await Promise.all(otherUsers.map(async (userData) => {
            let profilePictureBlob: Blob;
            if (userData.profilePicture) {
                const uint8Array = new Uint8Array(userData.profilePicture);
                profilePictureBlob = new Blob([uint8Array.buffer], {
                    type: 'image/jpeg' 
                });
            } else {
                profilePictureBlob = new Blob([], { type: 'image/jpeg' });
            }

            return {
                ...userData,
                profilePicture: profilePictureBlob,
                createdAt: new Date(Number(userData.createdAt)),
                updatedAt: new Date(Number(userData.updatedAt)),
            };
        }));

        console.log("Users with profile pictures (excluding current user):", usersWithProfilePictures);
        return usersWithProfilePictures;
    } catch (error) {
        console.error("Failed to get all users:", error);
        return null;
    }
};

export const topUp = async (amount: number): Promise<void> =>{
    const userData = localStorage.getItem("current_user");
    if (userData){
        console.log(userData)
        const parsedData = JSON.parse(userData).ok;
        const principalId = parsedData.id
        console.log(principalId)
        user.topUpCkBTC(principalId, amount)
    }
    
}
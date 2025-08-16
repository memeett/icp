import { AuthClient } from "@dfinity/auth-client";
import { job } from "../../../declarations/job";
import { User } from "../shared/types/User";
import { UpdateUserPayload } from "../../../declarations/user/user.did";
import { user } from "../../../declarations/user";
import { session } from "../../../declarations/session";
import { HttpAgent } from "@dfinity/agent";
import { JobCategory } from "../shared/types/Job";
import { CashFlowHistory } from "../../../declarations/user/user.did";
import { agentService } from "../singleton/agentService";
import { storage } from "../utils/storage";

interface ProfilePictureCache {
  [userId: string]: {
    url: string;
    timestamp: number;
    blob: Blob;
  };
}

const profilePictureCache: ProfilePictureCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Profile picture caching functions
export const getProfilePictureUrl = (userId: string, blob: Blob): string => {
  const cached = profilePictureCache[userId];
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.url;
  }

  const url = URL.createObjectURL(blob);
  
  if (cached) {
    URL.revokeObjectURL(cached.url);
  }

  profilePictureCache[userId] = {
    url,
    timestamp: now,
    blob,
  };

  return url;
};

export const clearProfilePictureCache = (): void => {
  Object.values(profilePictureCache).forEach(cached => {
    URL.revokeObjectURL(cached.url);
  });
  Object.keys(profilePictureCache).forEach(key => {
    delete profilePictureCache[key];
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!storage.getSession() && !!storage.getUser();
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  return storage.getUser();
};

// Check if profile completion is needed
export const needsProfileCompletion = (): boolean => {
  const user = getCurrentUser();
  return user ? !user.isProfileCompleted : false;
};

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
    try {
        const defaultImagePath = "/assets/profilePicture/default_profile_pict.jpg";
        const response = await fetch(defaultImagePath);
        const imageBlob = await response.blob();

        const arrayBuffer = await imageBlob.arrayBuffer();
        const profilePicBlob = new Uint8Array(arrayBuffer);

        const res = await user.login(principalId, profilePicBlob, process.env.CANISTER_ID_SESSION!);
        if (!res) {
            return false;
        }

        const userIdResult = await session.getUserIdBySession(res);
        if ("ok" in userIdResult) {
            const userId = userIdResult.ok;
            const userDetailResult = await user.getUserById(userId);

            if ("ok" in userDetailResult) {
                const userData = userDetailResult.ok;
                storage.clear(); // Clear existing storage
                storage.setSession(res); // Set new session

                // Convert to frontend User format
                const convertedUser: User = {
                    id: userData.id,
                    profilePicture: userData.profilePicture ? new Blob([new Uint8Array(userData.profilePicture)], { type: 'image/jpeg' }) : null,
                    username: userData.username,
                    dob: userData.dob,
                    preference: userData.preference.map((pref: any) => ({
                        id: pref.id.toString(),
                        jobCategoryName: pref.jobCategoryName
                    })),
                    description: userData.description,
                    wallet: userData.wallet,
                    rating: userData.rating,
                    createdAt: BigInt(userData.createdAt),
                    updatedAt: BigInt(userData.updatedAt),
                    isFaceRecognitionOn: userData.isFaceRecognitionOn,
                    isProfileCompleted: (userData as any).isProfileCompleted || false,
                    subAccount: [new Uint8Array()]
                };
                storage.setUser({ ok: convertedUser }); // Store converted user data

                document.cookie = `cookie=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure; SameSite=Strict`;
                return true;
            } else {
                console.error("Error fetching user details:", userDetailResult.err);
                return false;
            }
        } else {
            console.error("Error fetching user ID:", userIdResult.err);
            return false;
        }
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
};


export const loginWithInternetIdentity = async (): Promise<{ success: boolean; user?: User; needsProfileCompletion?: boolean }> => {
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

        const defaultImagePath = "/assets/profilePicture/default_profile_pict.jpg";
        const response = await fetch(defaultImagePath);
        const imageBlob = await response.blob();

        const arrayBuffer = await imageBlob.arrayBuffer();
        const profilePicBlob = new Uint8Array(arrayBuffer);
        
        const res = await user.login(principalId, profilePicBlob, process.env.CANISTER_ID_SESSION!);
        if (!res) {
            return { success: false };
        }

        const userIdResult = await session.getUserIdBySession(res);
        if ("ok" in userIdResult) {
            const userId = userIdResult.ok;
            const userDetail = await user.getUserById(userId);
            
            if ("ok" in userDetail) {
                const userData = userDetail.ok;
                storage.clear();
                storage.setUser(userDetail);
                storage.setSession(res);

                // Convert to frontend User format
                const convertedUser: User = {
                    id: userData.id,
                    profilePicture: userData.profilePicture ? new Blob([new Uint8Array(userData.profilePicture)], { type: 'image/jpeg' }) : null,
                    username: userData.username,
                    dob: userData.dob,
                    preference: userData.preference.map((pref: any) => ({
                        id: pref.id.toString(),
                        jobCategoryName: pref.jobCategoryName
                    })),
                    description: userData.description,
                    wallet: userData.wallet,
                    rating: userData.rating,
                    createdAt: BigInt(userData.createdAt),
                    updatedAt: BigInt(userData.updatedAt),
                    isFaceRecognitionOn: userData.isFaceRecognitionOn,
                    isProfileCompleted: (userData as any).isProfileCompleted || false,
                    subAccount: [new Uint8Array()] // Ensure subAccount is set to an array of Uint8Array
                };

                document.cookie = `cookie=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure; SameSite=Strict`;

                const needsCompletion = !((userData as any).isProfileCompleted || false);
                console.log('🎯 Profile completion needed:', needsCompletion);

                return {
                    success: true,
                    user: convertedUser,
                    needsProfileCompletion: needsCompletion,
                };
            } else {
                console.error("Error fetching user details:", userDetail.err);
                return { success: false };
            }
        } else {
            console.error("Error fetching user ID:", userIdResult.err);
            return { success: false };
        }
    } catch (err) {
        console.error("Login request failed:", err);
        return { success: false };
    }
};



export const validateCookie = async (): Promise<boolean> => {
    const agent = await agentService.getAgent();
    try {
        const cookie = getCookie("cookie");
        if (!cookie) {
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
            storage.clear();
            await session.logout(cleanSession)
        } else {
            storage.setSession(cleanSession);
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
        const storedSession = storage.getSession();
        if (storedSession) {
            try {
                await session.logout(storedSession);
            } catch (error) {
                console.error('Failed to logout from backend:', error);
            }
        }

        await authClient.logout();
        storage.clear();
        document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
        clearProfilePictureCache();
    } catch (error) {
        console.error("Logout failed:", error);
        storage.clear();
        clearProfilePictureCache();
    }
};


let userCache: { user: User | null, timestamp: number } = { user: null, timestamp: 0 };
const USER_CACHE_DURATION = 60 * 1000; // 1 minute

export const fetchUserBySession = async (): Promise<User | null> => {
    const agent = await agentService.getAgent();
    const now = Date.now();
    if (userCache.user && now - userCache.timestamp < USER_CACHE_DURATION) {
        console.log('Returning cached user data');
        return userCache.user;
    }

    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    // const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }

    try {
        const sessionValue = storage.getSession();
        if (!sessionValue) {
            throw new Error("No session found in local storage");
        }

        const result = await session.getUserIdBySession(sessionValue);

        if ("ok" in result) {
            const principalId = result.ok;
            const userRes = await user.getUserById(principalId);

            if ("ok" in userRes) {
                const userData = userRes.ok;
                const profilePictureBlob = userData.profilePicture
                    ? new Blob([new Uint8Array(userData.profilePicture)], { type: 'image/jpeg' })
                    : new Blob([], { type: 'image/jpeg' });

                const convertedUser: User = {
                    ...userData,
                    profilePicture: profilePictureBlob,
                    createdAt: BigInt(userData.createdAt),
                    updatedAt: BigInt(userData.updatedAt),
                    isProfileCompleted: (userData as any).isProfileCompleted || false,
                    subAccount: [new Uint8Array()] // Ensure subAccount is set to an array of Uint8Array
                };
                
                userCache = { user: convertedUser, timestamp: now };
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

export const updateUserProfile = async (payload: Partial<User>): Promise<boolean> => {
    try {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });

        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }

        const cleanSession = storage.getSession();
        if (!cleanSession) {
            throw new Error('No active session');
        }

        const backendPayload: UpdateUserPayload = {
            dob: [],
            username: [],
            isProfileCompleted: [],
            description: [],
            preference: [],
            profilePicture: []
        };
        
        if (payload.username !== undefined) backendPayload.username = [payload.username];
        if (payload.description !== undefined) backendPayload.description = [payload.description];
        if (payload.dob !== undefined) {
            if (typeof payload.dob === 'string') {
                backendPayload.dob = [payload.dob];
            } else {
                backendPayload.dob = [(payload.dob as any).format('YYYY-MM-DD')];
            }
        }
        if (payload.isProfileCompleted !== undefined) backendPayload.isProfileCompleted = [payload.isProfileCompleted];
        if (payload.preference !== undefined) backendPayload.preference = [payload.preference];
        
        if (payload.profilePicture && payload.profilePicture instanceof Blob && payload.profilePicture.size > 0) {
            const arrayBuffer = await payload.profilePicture.arrayBuffer();
            backendPayload.profilePicture = [new Uint8Array(arrayBuffer)];
        }

        if(payload.preference && payload.preference.length > 0){
            for (const tag of payload.preference) {
                console.log(tag.jobCategoryName)
                let existingCategory = await job.findJobCategoryByName(tag.jobCategoryName as string );
                console.log(existingCategory)
                if (!("ok" in existingCategory)) {
                    existingCategory = await job.createJobCategory(tag.jobCategoryName as string);
                    
                }
                
            }
                    
        }

        if (process.env.CANISTER_ID_SESSION) {
            await user.updateUser(cleanSession, backendPayload, process.env.CANISTER_ID_SESSION);
        } else {
            throw new Error('CANISTER_ID_SESSION not found');
        }

        userCache = { user: null, timestamp: 0 };
        const updatedUser = await fetchUserBySession();
        
        if (updatedUser) {
            const sessionString = storage.getSession();
            storage.clear();
            storage.setUser({ ok: updatedUser });
            if (sessionString) {
                storage.setSession(sessionString);
            }
        }

        return true;
    } catch (err) {
        console.error("Error updating user profile:", err);
        return false;
    }
};


export const getAllUsers = async (): Promise<User[] | null> => {
    try {
        const result = await user.getAllUsers();

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
                createdAt: BigInt(userData.createdAt),
                updatedAt: BigInt(userData.updatedAt),
                isProfileCompleted: (userData as any).isProfileCompleted || false,
                preference: userData.preference.map((pref: JobCategory) => ({
                    ...pref,
                    id: pref.id.toString()
                })),
                subAccount: [new Uint8Array()]
            };
        }));

        return usersWithProfilePictures;
    } catch (error) {
        console.error("Failed to get all users:", error);
        return null;
    }
};

export const topUp = async (amount: number): Promise<void> =>{
    const userData = localStorage.getItem("current_user");
    if (userData){
        const parsedData = JSON.parse(userData).ok;
        const principalId = parsedData.id
        user.topUpICP(principalId, amount)
    }
    
}

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const result = await user.getUserById(userId);

        if ("ok" in result) {
            const userData = result.ok;

            let profilePictureBlob: Blob;
            if (userData.profilePicture) {
                const uint8Array = new Uint8Array(userData.profilePicture);
                profilePictureBlob = new Blob([uint8Array.buffer], {
                    type: 'image/jpeg' 
                });
            } else {
                profilePictureBlob = new Blob([], { type: 'image/jpeg' });
            }

            const convertedUser: User = {
                ...userData,
                profilePicture: profilePictureBlob,
                createdAt: BigInt(userData.createdAt),
                updatedAt: BigInt(userData.updatedAt),
                isProfileCompleted: (userData as any).isProfileCompleted || false,
                subAccount: [new Uint8Array()]
            };

            return convertedUser;
        } else {
            console.error("Error fetching user:", result.err);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export const getUserByName = async (username: string): Promise<User | null> => {
    try {
      const result = await user.getUserByName(username);
  
      if ("ok" in result) {
        const userData = result.ok;
        let profilePictureBlob: Blob;
        if (userData.profilePicture) {
          const uint8Array = new Uint8Array(userData.profilePicture);
          profilePictureBlob = new Blob([uint8Array.buffer], {
            type: "image/jpeg",
          });
        } else {
          profilePictureBlob = new Blob([], { type: "image/jpeg" });
        }
  
        const convertedUser: User = {
          ...userData,
          profilePicture: profilePictureBlob,
          createdAt: BigInt(userData.createdAt),
          updatedAt: BigInt(userData.updatedAt),
          isProfileCompleted: (userData as any).isProfileCompleted || false,
          subAccount: [new Uint8Array()]
        };

  
        return convertedUser;
      } else {
        console.error("Error fetching user:", result.err);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  };
  
export const getUserTransaction = async (userId: string): Promise<CashFlowHistory[] | null> => {
    try {
        const result = await user.getUserTransactions(userId);
        return result;
    } catch (error) {
        console.error("Failed to get user transaction:", error);
        return null;
    }
}
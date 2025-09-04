import { AuthClient } from "@dfinity/auth-client";
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { User } from "../shared/types/User";
import { UpdateUserPayload, CashFlowHistory, User as BackendUser, JobCategory } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { HttpAgent } from "@dfinity/agent";
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
  return !!storage.getUser();
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

const convertBackendUserToFrontend = (userData: BackendUser): User => {
    const profilePictureBlob = userData.profilePicture && userData.profilePicture.length > 0
        ? new Blob([new Uint8Array(userData.profilePicture)], { type: 'image/jpeg' })
        : null;

    return {
        id: userData.id,
        profilePicture: profilePictureBlob,
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
        isProfileCompleted: userData.isProfileCompleted,
        subAccount: userData.subAccount[0] ? [new Uint8Array(userData.subAccount[0])] : [],
    };
}


export const loginWithInternetIdentity = async (): Promise<{ success: boolean; user?: User; needsProfileCompletion?: boolean }> => {
    try {
        const authClient = await AuthClient.create();

        await new Promise((resolve, reject) => {
            authClient.login({
                identityProvider: "https://identity.ic0.app/",
                onSuccess: resolve,
                onError: reject,
            });
        });

        const identity = authClient.getIdentity();
        const principalId = identity.getPrincipal().toString();
        
        const defaultImagePath = "/assets/profilePicture/default_profile_pict.jpg";
        const response = await fetch(defaultImagePath);
        const imageBlob = await response.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const profilePicBlob = new Uint8Array(arrayBuffer);
        
        let userDetailResult = await projcet_backend_single.getUserById(principalId);

        if (!("ok" in userDetailResult)) {
            // Create user if not found
            await projcet_backend_single.createUser(principalId, profilePicBlob);
            userDetailResult = await projcet_backend_single.getUserById(principalId);
        }

        if ("ok" in userDetailResult) {
            const userData = userDetailResult.ok;
            const convertedUser = convertBackendUserToFrontend(userData);
            
            storage.clear();
            storage.setUser(convertedUser);

            const needsCompletion = !convertedUser.isProfileCompleted;
            return {
                success: true,
                user: convertedUser,
                needsProfileCompletion: needsCompletion,
            };
        } else {
            console.error("Error fetching or creating user:", userDetailResult.err);
            return { success: false };
        }
    } catch (err) {
        console.error("Login request failed:", err);
        return { success: false };
    }
};

export const logout = async (): Promise<void> => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    storage.clear();
    clearProfilePictureCache();
};


export const fetchUserBySession = async (): Promise<User | null> => {
    const authClient = await AuthClient.create();
    if (!await authClient.isAuthenticated()) {
        return null;
    }
    const identity = authClient.getIdentity();
    const principalId = identity.getPrincipal().toString();

    const userRes = await projcet_backend_single.getUserById(principalId);

    if ("ok" in userRes) {
        const convertedUser = convertBackendUserToFrontend(userRes.ok);
        storage.setUser(convertedUser);
        return convertedUser;
    } else {
        console.error("Error fetching user:", userRes.err);
        return null;
    }
};

export const updateUserProfile = async (payload: Partial<User>): Promise<boolean> => {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) throw new Error("User not authenticated");

        const backendPayload: UpdateUserPayload = {
            dob: payload.dob ? [payload.dob.toString()] : [],
            username: payload.username ? [payload.username] : [],
            isProfileCompleted: payload.isProfileCompleted !== undefined ? [payload.isProfileCompleted] : [],
            description: payload.description ? [payload.description] : [],
            preference: payload.preference ? [payload.preference] : [],
            profilePicture: []
        };
        
        if (payload.profilePicture && payload.profilePicture instanceof Blob && payload.profilePicture.size > 0) {
            const arrayBuffer = await payload.profilePicture.arrayBuffer();
            backendPayload.profilePicture = [new Uint8Array(arrayBuffer)];
        }

        if(payload.preference && payload.preference.length > 0){
            for (const tag of payload.preference) {
                let existingCategory = await projcet_backend_single.findJobCategoryByName(tag.jobCategoryName as string);
                if (!("ok" in existingCategory)) {
                    existingCategory = await projcet_backend_single.createJobCategory(tag.jobCategoryName as string);
                }
            }
        }

        const updateResult = await projcet_backend_single.updateUser(currentUser.id, backendPayload);
        
        if ("ok" in updateResult) {
            await fetchUserBySession(); // Refresh user data in storage
            return true;
        } else {
            console.error("Error updating user profile:", updateResult.err);
            return false;
        }
    } catch (err) {
        console.error("Error updating user profile:", err);
        return false;
    }
};


export const getAllUsers = async (): Promise<User[] | null> => {
    try {
        const result = await projcet_backend_single.getAllUsers();
        const currentUser = getCurrentUser();
        if (!currentUser) return null;

        const otherUsers = result.filter((userData) => userData.id !== currentUser.id);

        return otherUsers.map(convertBackendUserToFrontend);
    } catch (error) {
        console.error("Failed to get all users:", error);
        return null;
    }
};


export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const result = await projcet_backend_single.getUserById(userId);

        if ("ok" in result) {
            return convertBackendUserToFrontend(result.ok);
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
      const result = await projcet_backend_single.getUserByName(username);
  
      if ("ok" in result) {
        return convertBackendUserToFrontend(result.ok);
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
        const result = await projcet_backend_single.getUserTransactions(userId);
        return result;
    } catch (error) {
        console.error("Failed to get user transaction:", error);
        return null;
    }
}
import { AuthClient } from "@dfinity/auth-client";
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { User } from "../shared/types/User";
import { UpdateUserPayload, CashFlowHistory, User as BackendUser, JobCategory } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { HttpAgent } from "@dfinity/agent";
import { agentService } from "../singleton/agentService";
import { storage } from "../utils/storage";

// Helper untuk membuat URL gambar dan menyimpannya di objek pengguna
const processProfilePicture = (picture: BackendUser['profilePicture']): string | null => {
  if (picture && picture.length > 0) {
    // Konversi eksplisit ke ArrayBuffer yang kompatibel
    const buffer = new ArrayBuffer(picture.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < picture.length; i++) {
        view[i] = picture[i];
    }
    const blob = new Blob([view], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  return null;
};

const convertBackendUserToFrontend = (userData: BackendUser): User => {
    return {
        id: userData.id,
        profilePictureUrl: processProfilePicture(userData.profilePicture),
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

export const validateCookie = async (): Promise<boolean> => {
    // Implementasi validateCookie Anda di sini jika diperlukan, atau kembalikan true/false
    // Untuk saat ini, kita asumsikan sesi valid jika ada.
    return !!storage.getSession();
};

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
            await projcet_backend_single.createUser(principalId, profilePicBlob);
            userDetailResult = await projcet_backend_single.getUserById(principalId);
        }

        if ("ok" in userDetailResult) {
            const userData = userDetailResult.ok;
            const convertedUser = convertBackendUserToFrontend(userData);
            
            storage.clear();
            storage.setUser(convertedUser);
            // Simulasikan sesi sederhana
            storage.setSession(principalId);

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
    // Implementasi updateUserProfile Anda di sini
    return true;
};

export const isAuthenticated = (): boolean => {
  return !!storage.getSession() && !!storage.getUser();
};

export const getCurrentUser = (): User | null => {
  return storage.getUser();
};

export const needsProfileCompletion = (): boolean => {
  const user = getCurrentUser();
  return user ? !user.isProfileCompleted : false;
};

// Fungsi lain yang mungkin Anda perlukan dari kode lama Anda
export const getAllUsers = async (): Promise<User[] | null> => {
    return [];
};
export const getUserById = async (userId: string): Promise<User | null> => {
    return null;
}
export const getUserByName = async (username: string): Promise<User | null> => {
    return null;
};
export const getUserTransaction = async (userId: string): Promise<CashFlowHistory[] | null> => {
    return [];
}
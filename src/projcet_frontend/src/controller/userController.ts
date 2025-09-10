import { AuthClient } from "@dfinity/auth-client";
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { User } from "../shared/types/User";
import { UpdateUserPayload, CashFlowHistory, User as BackendUser, JobCategory } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { HttpAgent } from "@dfinity/agent";
import { agentService } from "../singleton/agentService";
import { storage } from "../utils/storage";

// Helper untuk membuat URL gambar dan menyimpannya di objek pengguna
const processProfilePicture = (picture: BackendUser['profilePicture']): string | null => {
  try {
    if (picture && picture.length > 0) {
      console.log('Processing profile picture, size:', picture.length);
      
      // Konversi eksplisit ke ArrayBuffer yang kompatibel
      const buffer = new ArrayBuffer(picture.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < picture.length; i++) {
          view[i] = picture[i];
      }
      
      // Detect image type from header bytes
      let mimeType = 'image/jpeg'; // default
      if (picture.length >= 4) {
        const header = picture.slice(0, 4);
        console.log('Image header bytes:', header);
        
        // PNG signature: 137, 80, 78, 71
        if (header[0] === 137 && header[1] === 80 && header[2] === 78 && header[3] === 71) {
          mimeType = 'image/png';
          console.log('Detected PNG image');
        }
        // JPEG signature: 255, 216, 255
        else if (header[0] === 255 && header[1] === 216 && header[2] === 255) {
          mimeType = 'image/jpeg';
          console.log('Detected JPEG image');
        }
        // WebP signature: 82, 73, 70, 70
        else if (header[0] === 82 && header[1] === 73 && header[2] === 70 && header[3] === 70) {
          mimeType = 'image/webp';
          console.log('Detected WebP image');
        }
      }
      
      const blob = new Blob([view], { type: mimeType });
      const url = URL.createObjectURL(blob);
      console.log('Generated profile picture URL:', url);
      return url;
    }
    console.log('No profile picture data');
    return null;
  } catch (error) {
    console.error('Error processing profile picture:', error);
    return null;
  }
};

// Export untuk ProfilePage
export const getProfilePictureUrl = processProfilePicture;

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
        const authClient = await AuthClient.create({
            idleOptions: {
                idleTimeout: 1000 * 60 * 60 * 8, // 8 hours session
                disableDefaultIdleCallback: true,
            },
        });

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
    const authClient = await AuthClient.create({
        idleOptions: {
            idleTimeout: 1000 * 60 * 60 * 8, // 8 hours session
            disableDefaultIdleCallback: true,
        },
    });
    await authClient.logout();
    storage.clear();
};

export const fetchUserBySession = async (): Promise<User | null> => {
    const authClient = await AuthClient.create({
        idleOptions: {
            idleTimeout: 1000 * 60 * 60 * 8, // 8 hours session
            disableDefaultIdleCallback: true,
        },
    });
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
        console.log('updateUserProfile called with payload:', payload);
        
        // Get current user session
        const session = storage.getSession();
        const currentUser = storage.getUser();
        
        if (!session || !currentUser) {
            console.error('No valid session or user found');
            return false;
        }

        const updatePayload: UpdateUserPayload = {};
        
        if (payload.username !== undefined) {
            updatePayload.username = [payload.username];
        }
        
        if (payload.dob !== undefined) {
            updatePayload.dob = [payload.dob];
        }
        
        if (payload.description !== undefined) {
            updatePayload.description = [payload.description];
        }
        
        if (payload.preference !== undefined && payload.preference.length > 0) {
            console.log('Processing preferences:', payload.preference);
            // Convert JobCategory array to backend format
            const backendPreferences = payload.preference.map(pref => {
                console.log('Processing preference:', pref);
                return {
                    id: String(pref.id), // Ensure string conversion
                    jobCategoryName: pref.jobCategoryName
                };
            });
            console.log('Backend preferences prepared:', backendPreferences);
            updatePayload.preference = [backendPreferences];
        }
        
        if (payload.isProfileCompleted !== undefined) {
            updatePayload.isProfileCompleted = [payload.isProfileCompleted];
        }

        // Handle profile picture if provided
        if (payload.profilePicture) {
            try {
                const arrayBuffer = await (payload.profilePicture as any).arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                updatePayload.profilePicture = [Array.from(uint8Array)];
                console.log('Profile picture processed, size:', uint8Array.length);
            } catch (error) {
                console.error('Error processing profile picture:', error);
                // Continue without profile picture
            }
        }

        console.log('Sending update payload to backend:', JSON.stringify(updatePayload, null, 2));
        
        // Get authenticated agent
        const agent = await agentService.getAgent();
        
        // Call backend updateUser function
        const result = await projcet_backend_single.updateUser(currentUser.id, updatePayload);
        
        console.log('Backend update result:', result);
        
        if ('ok' in result) {
            console.log('Profile updated successfully');
            
            // Update local storage with new data
            const updatedUser = convertBackendUserToFrontend(result.ok);
            storage.setUser(updatedUser);
            
            return true;
        } else {
            console.error('Backend update failed:', result.err);
            return false;
        }
        
    } catch (error) {
        console.error('updateUserProfile error:', error);
        return false;
    }
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
export const getUserById = async (userId: string): Promise<{ ok: User } | { err: string } | null> => {
    try {
        console.log('🔍 Fetching user by ID:', userId);
        const userResult = await projcet_backend_single.getUserById(userId);
        
        if ("ok" in userResult) {
            const convertedUser = convertBackendUserToFrontend(userResult.ok);
            console.log('✅ User fetched successfully:', convertedUser.username);
            return { ok: convertedUser };
        } else {
            console.warn('⚠️ User not found:', userId, userResult.err);
            return { err: userResult.err };
        }
    } catch (error) {
        console.error('❌ Error fetching user by ID:', error);
        return null;
    }
}
export const getUserByName = async (username: string): Promise<User | null> => {
    return null;
};
export const getUserTransaction = async (userId: string): Promise<CashFlowHistory[] | null> => {
    return [];
}
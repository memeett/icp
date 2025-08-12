import { loginWithInternetIdentity as controllerLogin, validateCookie, fetchUserBySession, logout as controllerLogout, updateUserProfile as controllerUpdateProfile } from '../../controller/userController';
class AuthService {
    profilePictureCache = {};
    CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    async loginWithInternetIdentity() {
        try {
            const success = await controllerLogin();
            if (success) {
                // Get user data from localStorage (set by controller)
                const userData = this.getStoredUser();
                if (userData) {
                    return {
                        success: true,
                        user: userData,
                        needsProfileCompletion: !userData.isProfileCompleted,
                    };
                }
            }
            return { success: false };
        }
        catch (error) {
            console.error('Internet Identity login failed:', error);
            return { success: false };
        }
    }
    async logout() {
        try {
            await controllerLogout();
            this.clearProfilePictureCache();
        }
        catch (error) {
            console.error('Logout failed:', error);
            // Force clear local data even if backend call fails
            this.clearSession();
            this.clearUser();
            this.clearProfilePictureCache();
        }
    }
    async validateSession() {
        try {
            const isValid = await validateCookie();
            if (isValid) {
                const userData = await fetchUserBySession();
                if (userData) {
                    this.storeUser(userData);
                    return { isValid: true, user: userData };
                }
            }
            return { isValid: false };
        }
        catch (error) {
            console.error('Session validation failed:', error);
            return { isValid: false };
        }
    }
    async updateUserProfile(payload) {
        try {
            await controllerUpdateProfile(payload);
            // Update cached user data
            const currentUser = this.getStoredUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...payload };
                this.storeUser(updatedUser);
            }
            return true;
        }
        catch (error) {
            console.error('Failed to update user profile:', error);
            return false;
        }
    }
    // Profile picture caching for efficiency
    getProfilePictureUrl(userId, blob) {
        const cached = this.profilePictureCache[userId];
        const now = Date.now();
        if (cached && now - cached.timestamp < this.CACHE_DURATION) {
            return cached.url;
        }
        // Create new URL and cache it
        const url = URL.createObjectURL(blob);
        // Clean up old URL if exists
        if (cached) {
            URL.revokeObjectURL(cached.url);
        }
        this.profilePictureCache[userId] = {
            url,
            timestamp: now,
            blob,
        };
        return url;
    }
    clearProfilePictureCache() {
        Object.values(this.profilePictureCache).forEach(cached => {
            URL.revokeObjectURL(cached.url);
        });
        this.profilePictureCache = {};
    }
    // Session management
    getStoredSession() {
        try {
            const stored = localStorage.getItem('session');
            if (!stored)
                return null;
            return {
                sessionId: stored,
                userId: '', // Will be populated when needed
                expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                isValid: true,
            };
        }
        catch {
            return null;
        }
    }
    clearSession() {
        localStorage.removeItem('session');
        localStorage.removeItem('auth_session');
    }
    // User data management
    storeUser(user) {
        // Store user without blob data for localStorage
        const userForStorage = {
            ...user,
            profilePicture: null, // Don't store blob in localStorage
        };
        localStorage.setItem('current_user', JSON.stringify(userForStorage, (_, value) => typeof value === "bigint" ? value.toString() : value));
    }
    getStoredUser() {
        try {
            const stored = localStorage.getItem('current_user');
            if (!stored)
                return null;
            const parsed = JSON.parse(stored);
            // Handle both old and new format
            if (parsed.ok) {
                const userData = parsed.ok;
                return {
                    ...userData,
                    createdAt: BigInt(userData.createdAt),
                    updatedAt: BigInt(userData.updatedAt),
                    profilePicture: null, // Will be loaded separately
                };
            }
            else {
                return {
                    ...parsed,
                    createdAt: BigInt(parsed.createdAt),
                    updatedAt: BigInt(parsed.updatedAt),
                    profilePicture: null, // Will be loaded separately
                };
            }
        }
        catch {
            return null;
        }
    }
    clearUser() {
        localStorage.removeItem('current_user');
    }
    // Check if user is authenticated
    isAuthenticated() {
        const session = this.getStoredSession();
        const user = this.getStoredUser();
        return session !== null && user !== null;
    }
    // Get current user
    getCurrentUser() {
        return this.getStoredUser();
    }
    // Check if profile is completed
    needsProfileCompletion() {
        const user = this.getCurrentUser();
        return user ? !user.isProfileCompleted : false;
    }
}
export const authService = new AuthService();

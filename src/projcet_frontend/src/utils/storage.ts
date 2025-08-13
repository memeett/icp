import { User } from '../shared/types/User';

const CURRENT_USER_KEY = 'current_user';
const SESSION_KEY = 'session';

// Helper to handle BigInt serialization
const replacer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

export const storage = {
  setUser: (user: any) => {
    try {
      const userString = JSON.stringify(user, replacer);
      localStorage.setItem(CURRENT_USER_KEY, userString);
    } catch (error) {
      console.error("Failed to set user in localStorage:", error);
    }
  },
  getUser: (): User | null => {
    try {
      const userString = localStorage.getItem(CURRENT_USER_KEY);
      if (!userString) return null;
      
      console.log('Raw user string from localStorage:', userString);
      
      const parsed = JSON.parse(userString);
      console.log('Parsed user data:', parsed);
      
      // Handle different possible structures
      const userData = parsed.ok || parsed;
      console.log('User data after ok check:', userData);
      
      // Ensure the id field exists
      if (!userData.id) {
        console.error('User data is missing id field:', userData);
        
        // Try to get the ID from another field or path
        if (userData.userId) {
          userData.id = userData.userId;
        } else if (userData.principal) {
          userData.id = userData.principal;
        } else if (userData.user && userData.user.id) {
          userData.id = userData.user.id;
        }
        
        if (!userData.id) {
          return null;
        }
      }
      
      return {
        ...userData,
        id: String(userData.id), // Ensure ID is a string
        createdAt: BigInt(userData.createdAt || '0'),
        updatedAt: BigInt(userData.updatedAt || '0'),
        profilePicture: null,
      };
    } catch (error) {
      console.error("Failed to get user from localStorage:", error);
      return null;
    }
  },
  setSession: (session: any) => {
    try {
      const sessionString = JSON.stringify(session);
      localStorage.setItem(SESSION_KEY, sessionString);
    } catch (error) {
      console.error("Failed to set session in localStorage:", error);
    }
  },
  getSession: (): string | null => {
    try {
      const sessionString = localStorage.getItem(SESSION_KEY);
      if (!sessionString) return null;
      const parsed = JSON.parse(sessionString);
      return typeof parsed === 'string' ? parsed.replace(/^"|"$/g, '') : sessionString.replace(/^"|"$/g, '');
    } catch (error) {
      return localStorage.getItem(SESSION_KEY)?.replace(/^"|"$/g, '') || null;
    }
  },
  clear: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};
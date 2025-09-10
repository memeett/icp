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
<<<<<<< HEAD
      // Hapus gambar profil sebelum menyimpan untuk menghindari penyimpanan data biner
      const { profilePicture, ...userToStore } = user;
      const userString = JSON.stringify(userToStore, replacer);
=======
      const userString = JSON.stringify(user, replacer);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      localStorage.setItem(CURRENT_USER_KEY, userString);
    } catch (error) {
      console.error("Failed to set user in localStorage:", error);
    }
  },
  getUser: (): User | null => {
    try {
      const userString = localStorage.getItem(CURRENT_USER_KEY);
      if (!userString) return null;
      
<<<<<<< HEAD
      const userData = JSON.parse(userString);
      
      // Kembalikan data pengguna tanpa gambar profil; ini akan diambil secara terpisah
      return {
        ...userData,
        id: String(userData.id),
        createdAt: BigInt(userData.createdAt || '0'),
        updatedAt: BigInt(userData.updatedAt || '0'),
        profilePicture: null, // Selalu null dari localStorage
=======
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
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      };
    } catch (error) {
      console.error("Failed to get user from localStorage:", error);
      return null;
    }
  },
  setSession: (session: any) => {
    try {
      // If session is already a string, store it directly. Otherwise, stringify it.
      const sessionToStore = typeof session === 'string' ? session : JSON.stringify(session);
      localStorage.setItem(SESSION_KEY, sessionToStore);
    } catch (error) {
      console.error("Failed to set session in localStorage:", error);
    }
  },
  getSession: (): string | null => {
    try {
      const sessionString = localStorage.getItem(SESSION_KEY);
      if (!sessionString) return null;
      let cleanedSession = sessionString;
      // Repeatedly unescape and unquote until the string no longer changes
      while (true) {
        const prevCleanedSession = cleanedSession;
        try {
          // Try to parse if it's a JSON string (e.g., "\"abc\"")
          const parsed = JSON.parse(cleanedSession);
          if (typeof parsed === 'string') {
            cleanedSession = parsed;
          } else {
            // If it's not a string after parsing, revert and break
            cleanedSession = prevCleanedSession;
            break;
          }
        } catch (e) {
          // If JSON.parse fails, it's not a JSON string, so just remove outer quotes/backslashes
          cleanedSession = cleanedSession.replace(/^"|"$/g, '').replace(/^\\|\\$/g, '');
        }
        if (cleanedSession === prevCleanedSession) {
          break; // No more changes, stop
        }
      }
      return cleanedSession;
    } catch (error) {
      console.error("Failed to get session from localStorage:", error);
      // Fallback to a simpler cleanup if parsing fails
      return localStorage.getItem(SESSION_KEY)?.replace(/^"|"$/g, '').replace(/^\\|\\$/g, '') || null;
    }
  },
  clear: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};
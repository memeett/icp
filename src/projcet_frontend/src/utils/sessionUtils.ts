import { fetchUserBySession } from '../controller/userController';
import { storage } from './storage';

/**
 * Ensures that the user data is loaded and stored in localStorage
 * whenever there is a valid session but no user data.
 * 
 * @returns Promise<boolean> - Whether user data is available
 */
export const ensureUserData = async (): Promise<boolean> => {
  try {
    // Check if we have session but no user data
    const hasSession = !!storage.getSession();
    const hasUserData = !!storage.getUser();
    
    console.log('Session check:', { hasSession, hasUserData });
    
    if (hasSession && !hasUserData) {
      console.log('Session exists but no user data, attempting to fetch user...');
      const userData = await fetchUserBySession();
      
      if (userData) {
        console.log('Successfully fetched user data from session');
<<<<<<< HEAD
        await storage.setUser({ ok: userData });
=======
        storage.setUser({ ok: userData });
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return true;
      } else {
        console.error('Failed to fetch user data from session');
        return false;
      }
    }
    
    return hasUserData;
  } catch (error) {
    console.error('Error ensuring user data:', error);
    return false;
  }
};

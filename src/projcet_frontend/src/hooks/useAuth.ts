<<<<<<< HEAD
import { message } from 'antd';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  authStatusAtom,
  userAtom,
  authActionsAtom,
  isLoadingAtom,
  isAuthenticatedAtom,
  isUnauthenticatedAtom,
  sessionAtom,
  needsProfileCompletionAtom,
  isProfileCompletedAtom
} from '../app/store/auth';
import { notificationActionsAtom } from '../app/store/ui';
import { User } from '../shared/types/User';
import {
  loginWithInternetIdentity as controllerLogin,
  validateCookie,
  fetchUserBySession,
  logout as controllerLogout,
  updateUserProfile as controllerUpdateProfile,
  isAuthenticated as controllerIsAuthenticated,
} from '../controller/userController';
import { storage } from '../utils/storage';
import { ensureUserData } from '../utils/sessionUtils';

export interface UseAuthReturn {
  user: User | null;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  needsProfileCompletion: boolean;
  isProfileCompleted: boolean;
  loginWithInternetIdentity: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const [user] = useAtom(userAtom);
  const [authStatus] = useAtom(authStatusAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isUnauthenticated] = useAtom(isUnauthenticatedAtom);
  const [session] = useAtom(sessionAtom);
  const [needsProfileCompletion] = useAtom(needsProfileCompletionAtom);
  const [isProfileCompleted] = useAtom(isProfileCompletedAtom);
  
  const [, authActions] = useAtom(authActionsAtom);
  const [, notificationActions] = useAtom(notificationActionsAtom);
  
  const navigate = useNavigate();
  const isInitializing = useRef(false);

  const loginWithInternetIdentity = useCallback(async () => {
    try {
      authActions({ type: 'SET_LOADING' });
      const result = await controllerLogin();
      if (result.success && result.user) {
        console.log('Login successful:', result.user);
        authActions({
          type: 'LOGIN',
          user: result.user,
          session: localStorage.getItem('session') || undefined
        });
        notificationActions({
          type: 'ADD',
          notification: {
            type: 'success',
            title: 'Welcome!',
            message: `Hello ${result.user.username || 'User'}, you're successfully logged in.`,
          }
        });
        if (result.needsProfileCompletion) {
          navigate('/complete-profile');
        } else {
          navigate('/');
        }
      } else {
        authActions({ type: 'LOGOUT' });
        notificationActions({
          type: 'ADD',
          notification: {
            type: 'error',
            title: 'Login Failed',
            message: 'Failed to authenticate with Internet Identity. Please try again.',
          }
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      authActions({ type: 'LOGOUT' });
    }
  }, [authActions]);

  const logout = useCallback(async () => {
    try {
      await controllerLogout();
      authActions({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      authActions({ type: 'LOGOUT' });
    }
  }, [authActions, navigate]);

  const updateProfile = useCallback(async (payload: Partial<User>): Promise<boolean> => {
    try {
      const success = await controllerUpdateProfile(payload);
      if (success) {
        // Refetch user data to ensure consistency
        const updatedUserData = await fetchUserBySession();
        if (updatedUserData) {
          authActions({ type: 'LOGIN', user: updatedUserData, session: localStorage.getItem('session') || undefined });
        }
        message.success('Profile updated successfully!');
      } else {
        message.error('Failed to update profile.');
      }
      return success;
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('An unexpected error occurred.');
      return false;
    }
  }, [authActions]);

  useEffect(() => {
    const initializeAuth = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializing.current) {
        console.log('Auth initialization already in progress, skipping...');
        return;
      }
      
      // Only initialize when status is loading
      if (authStatus !== 'loading') {
        console.log('Auth status is not loading, skipping initialization. Current status:', authStatus);
        return;
      }
      
      console.log('Starting auth initialization...');
      isInitializing.current = true;

      try {
        const sessionToken = localStorage.getItem('session');
        if (sessionToken) {
          console.log('Session token found, validating...');
          const isValid = await validateCookie();
          if (isValid) {
            console.log('Session is valid, fetching user data...');
            const userData = await fetchUserBySession();
            if (userData) {
              console.log('User data fetched successfully, logging in...');
              authActions({ type: 'LOGIN', user: userData, session: sessionToken });
            } else {
              console.log('Failed to fetch user data, logging out...');
              authActions({ type: 'LOGOUT' });
            }
          } else {
            console.log('Session is invalid, logging out...');
            authActions({ type: 'LOGOUT' });
          }
        } else {
          console.log('No session token found, checking stored user...');
          const storedUser = storage.getUser();
          if (storedUser && controllerIsAuthenticated()) {
            console.log('Stored user found and authenticated, logging in...');
            authActions({ type: 'LOGIN', user: storedUser });
          } else {
            console.log('No valid stored user, logging out...');
            authActions({ type: 'LOGOUT' });
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        authActions({ type: 'LOGOUT' });
      } finally {
        console.log('Auth initialization completed');
        isInitializing.current = false;
      }
    };

    // Add a small delay to prevent rapid re-initialization
    const timeoutId = setTimeout(initializeAuth, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [authStatus]); // Only depend on authStatus

  return {
    user,
    authStatus,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    needsProfileCompletion: needsProfileCompletion || false,
    isProfileCompleted: isProfileCompleted || false,
    loginWithInternetIdentity,
    logout,
    updateProfile,
  };
=======
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { authStatusAtom, userAtom } from '../store/authAtoms';
import { logout as logoutController } from '../controller/userController'; // Assuming you have a logout function
import { useNavigate } from 'react-router-dom';

/**
 * @hook useAuth
 * The central hook for interacting with the application's authentication state.
 * It provides a clean, read-only view of the current auth status and user data,
 * along with safe methods to perform actions like logging out.
 *
 * @returns An object with the current user, auth status, and helper functions.
 */
export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);
    const [authStatus, setAuthStatus] = useAtom(authStatusAtom);
    const navigate = useNavigate();

    // The logout function is now part of the hook, providing a single point of control.
    const logout = async () => {
        try {
            await logoutController(); // Call the backend logout controller
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Clear the global state regardless of backend success
            setUser(null);
            setAuthStatus('unauthenticated');
            // Redirect to the home page after logging out
            navigate('/');
        }
    };

    // We use useMemo to prevent re-renders if the values haven't changed.
    // This derived state is much cleaner than the previous implementation.
    const value = useMemo(
        () => ({
            user,
            authStatus,
            isLoading: authStatus === 'loading',
            isAuthenticated: authStatus === 'authenticated',
            logout,
        }),
        [user, authStatus, logout]
    );

    return value;
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
};

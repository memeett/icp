import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  authStatusAtom, 
  userAtom, 
  authActionsAtom,
  isLoadingAtom,
  isAuthenticatedAtom,
  isUnauthenticatedAtom,
  sessionAtom
} from '../../app/store/auth';
import { notificationActionsAtom } from '../../app/store/ui';
import { User } from '../types/User';
import { 
  validateCookie, 
  fetchUserBySession, 
  logout as logoutController 
} from '../../controller/userController';

export interface UseAuthReturn {
  // State
  user: User | null;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  
  // Actions
  login: (user: User) => void;
  loginWithMock: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  validateSession: () => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const [user] = useAtom(userAtom);
  const [authStatus] = useAtom(authStatusAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isUnauthenticated] = useAtom(isUnauthenticatedAtom);
  const [session] = useAtom(sessionAtom);
  
  const [, authActions] = useAtom(authActionsAtom);
  const [, notificationActions] = useAtom(notificationActionsAtom);
  
  const navigate = useNavigate();

  // Login function
  const login = useCallback((userData: User) => {
    authActions({ type: 'LOGIN', user: userData });
    notificationActions({
      type: 'ADD',
      notification: {
        type: 'success',
        title: 'Welcome back!',
        message: `Hello ${userData.username}, you're successfully logged in.`,
      }
    });
  }, [authActions, notificationActions]);

  // Mock login function for development
  const loginWithMock = useCallback(() => {
    const mockUser: User = {
      id: 'mock-user-1',
      username: 'John Doe',
      email: 'john.doe@example.com',
      profilePicture: null,
      balance: 1250.50,
      preference: [
        { id: '1', jobCategoryName: 'Web Development' },
        { id: '2', jobCategoryName: 'React' },
        { id: '3', jobCategoryName: 'TypeScript' }
      ],
      isFaceRecognitionOn: true,
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
    };
    
    // Login with the mock user - this will handle session creation
    login(mockUser);
  }, [login]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutController();
      authActions({ type: 'LOGOUT' });
      navigate('/');
      notificationActions({
        type: 'ADD',
        notification: {
          type: 'success',
          title: 'Logged out',
          message: 'You have been successfully logged out.',
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if backend call fails
      authActions({ type: 'LOGOUT' });
      navigate('/');
      notificationActions({
        type: 'ADD',
        notification: {
          type: 'warning',
          title: 'Logged out',
          message: 'You have been logged out (with some issues).',
        }
      });
    }
  }, [authActions, notificationActions, navigate]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!session) return;
    
    try {
      const userData = await fetchUserBySession();
      if (userData) {
        authActions({ type: 'LOGIN', user: userData });
      } else {
        authActions({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      authActions({ type: 'LOGOUT' });
    }
  }, [session, authActions]);

  // Validate session
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!session) {
      authActions({ type: 'LOGOUT' });
      return false;
    }

    try {
      const isValid = await validateCookie();
      if (isValid) {
        await refreshUser();
        return true;
      } else {
        authActions({ type: 'LOGOUT' });
        return false;
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      authActions({ type: 'LOGOUT' });
      return false;
    }
  }, [session, authActions, refreshUser]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('useAuth - Initializing auth with session:', session);
      authActions({ type: 'SET_LOADING' });
      
      if (session) {
        console.log('useAuth - Session found:', session);
        // For mock sessions, skip validation and set as authenticated
        if (session.startsWith('mock-session-')) {
          console.log('useAuth - Mock session detected, logging in');
          // Mock session is valid, set as authenticated
          authActions({ type: 'LOGIN', user: {
            id: 'mock-user-1',
            username: 'John Doe',
            email: 'john.doe@example.com',
            profilePicture: null,
            balance: 1250.50,
            preference: [
              { id: '1', jobCategoryName: 'Web Development' },
              { id: '2', jobCategoryName: 'React' },
              { id: '3', jobCategoryName: 'TypeScript' }
            ],
            isFaceRecognitionOn: true,
            createdAt: BigInt(Date.now()),
            updatedAt: BigInt(Date.now()),
          }});
        } else {
          console.log('useAuth - Real session, validating');
          await validateSession();
        }
      } else {
        console.log('useAuth - No session, logging out');
        authActions({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, [session, validateSession, authActions]);

  // Auto-refresh user data periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshUser();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUser]);

  return {
    // State
    user,
    authStatus,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    
    // Actions
    login,
    loginWithMock,
    logout,
    refreshUser,
    validateSession,
  };
};
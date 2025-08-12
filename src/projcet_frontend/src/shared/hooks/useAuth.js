import { message } from 'antd';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStatusAtom, userAtom, authActionsAtom, isLoadingAtom, isAuthenticatedAtom, isUnauthenticatedAtom, sessionAtom, needsProfileCompletionAtom, isProfileCompletedAtom } from '../../app/store/auth';
import { notificationActionsAtom } from '../../app/store/ui';
import { loginWithInternetIdentity as controllerLogin, validateCookie, fetchUserBySession, logout as controllerLogout, updateUserProfile as controllerUpdateProfile, isAuthenticated as controllerIsAuthenticated, } from '../../controller/userController';
import { storage } from '../../utils/storage';
export const useAuth = () => {
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
                }
                else {
                    navigate('/profile');
                }
            }
            else {
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
        }
        catch (error) {
            console.error('Login failed:', error);
            authActions({ type: 'LOGOUT' });
        }
    }, [authActions, navigate, notificationActions]);
    const logout = useCallback(async () => {
        try {
            await controllerLogout();
            authActions({ type: 'LOGOUT' });
            navigate('/');
        }
        catch (error) {
            console.error('Logout failed:', error);
            authActions({ type: 'LOGOUT' });
        }
    }, [authActions, navigate]);
    const updateProfile = useCallback(async (payload) => {
        try {
            const success = await controllerUpdateProfile(payload);
            if (success) {
                // Refetch user data to ensure consistency
                const updatedUserData = await fetchUserBySession();
                if (updatedUserData) {
                    authActions({ type: 'LOGIN', user: updatedUserData, session: localStorage.getItem('session') || undefined });
                }
                message.success('Profile updated successfully!');
            }
            else {
                message.error('Failed to update profile.');
            }
            return success;
        }
        catch (error) {
            console.error('Failed to update profile:', error);
            message.error('An unexpected error occurred.');
            return false;
        }
    }, [authActions]);
    useEffect(() => {
        const initializeAuth = async () => {
            if (isInitializing.current || authStatus !== 'loading') {
                return;
            }
            isInitializing.current = true;
            try {
                const sessionToken = localStorage.getItem('session');
                if (sessionToken) {
                    const isValid = await validateCookie();
                    if (isValid) {
                        const userData = await fetchUserBySession();
                        if (userData) {
                            authActions({ type: 'LOGIN', user: userData, session: sessionToken });
                        }
                        else {
                            authActions({ type: 'LOGOUT' });
                        }
                    }
                    else {
                        authActions({ type: 'LOGOUT' });
                    }
                }
                else {
                    const storedUser = storage.getUser();
                    if (storedUser && controllerIsAuthenticated()) {
                        authActions({ type: 'LOGIN', user: storedUser });
                    }
                    else {
                        authActions({ type: 'LOGOUT' });
                    }
                }
            }
            catch (error) {
                console.error("Auth initialization failed:", error);
                authActions({ type: 'LOGOUT' });
            }
            finally {
                isInitializing.current = false;
            }
        };
        initializeAuth();
    }, [authStatus, authActions]);
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
};

import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authStatusAtom, userAtom } from '../../store/authAtoms';
import { getUserById } from '../../controller/userController';
const ProfileCompletionGuard = ({ children }) => {
    const [authStatus] = useAtom(authStatusAtom);
    const [user] = useAtom(userAtom);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        console.log('ProfileCompletionGuard - authStatus:', authStatus);
        console.log('ProfileCompletionGuard - user:', user);
        const checkProfileCompletion = async () => {
            if (authStatus === 'loading') {
                console.log('ProfileCompletionGuard - Still loading auth status');
                return; // Still loading, wait
            }
            if (authStatus === 'unauthenticated' || !user) {
                console.log('ProfileCompletionGuard - User not authenticated');
                setIsLoading(false);
                return;
            }
            try {
                console.log('ProfileCompletionGuard - Fetching user data for ID:', user.id);
                // Get fresh user data to check if profile is complete
                const userData = await getUserById(user.id);
                console.log('ProfileCompletionGuard - User data received:', userData);
                if (userData) {
                    setCurrentUser(userData);
                    console.log('ProfileCompletionGuard - Profile completed?', userData.isProfileCompleted);
                }
            }
            catch (error) {
                console.error('ProfileCompletionGuard - Error fetching user data:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkProfileCompletion();
    }, [authStatus, user]);
    // Show loading while checking
    if (authStatus === 'loading' || isLoading) {
        console.log('ProfileCompletionGuard - Showing loading screen');
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600" }) }));
    }
    // If not authenticated, redirect to login
    if (authStatus === 'unauthenticated') {
        console.log('ProfileCompletionGuard - Redirecting to login');
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // If authenticated but profile not complete, redirect to complete profile
    if (currentUser && !currentUser.isProfileCompleted) {
        console.log('ProfileCompletionGuard - Profile not completed, redirecting to complete-profile');
        return _jsx(Navigate, { to: "/complete-profile", replace: true });
    }
    // If profile is complete, render the protected content
    console.log('ProfileCompletionGuard - Profile completed, rendering children');
    return _jsx(_Fragment, { children: children });
};
export default ProfileCompletionGuard;

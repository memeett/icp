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
};

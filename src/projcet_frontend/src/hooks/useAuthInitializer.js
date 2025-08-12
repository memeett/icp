import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { authStatusAtom, userAtom } from '../store/authAtoms';
import { fetchUserBySession } from '../controller/userController';
export const useAuthInitializer = () => {
    const [, setAuthStatus] = useAtom(authStatusAtom);
    const [, setUser] = useAtom(userAtom);
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('AuthInitializer - Starting auth initialization');
            try {
                // Try to get user from session/localStorage
                const user = await fetchUserBySession();
                if (user) {
                    console.log('AuthInitializer - User found:', user);
                    setUser(user);
                    setAuthStatus('authenticated');
                }
                else {
                    console.log('AuthInitializer - No user found');
                    setUser(null);
                    setAuthStatus('unauthenticated');
                }
            }
            catch (error) {
                console.error('AuthInitializer - Error initializing auth:', error);
                setUser(null);
                setAuthStatus('unauthenticated');
            }
        };
        initializeAuth();
    }, [setAuthStatus, setUser]);
};
// Component version
const AuthInitializer = () => {
    useAuthInitializer();
    return null; // This component doesn't render anything
};
export default AuthInitializer;

import { useEffect } from 'react';
import { useAtom } from 'jotai';
<<<<<<< HEAD
import { authStatusAtom, userAtom } from '../app/store/auth';
import { fetchUserBySession } from '../controller/userController';
import { storage } from '../utils/storage';
=======
import { authStatusAtom, userAtom } from '../store/authAtoms';
import { fetchUserBySession } from '../controller/userController';
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

export const useAuthInitializer = () => {
    const [, setAuthStatus] = useAtom(authStatusAtom);
    const [, setUser] = useAtom(userAtom);

    useEffect(() => {
        const initializeAuth = async () => {
            console.log('AuthInitializer - Starting auth initialization');
<<<<<<< HEAD
            
            // 1. Coba muat dari localStorage terlebih dahulu untuk pemuatan UI yang cepat
            // Logika inisialisasi yang disederhanakan: Cukup verifikasi sesi.
            // `storage.getUser` akan dipanggil di dalam `fetchUserBySession` jika diperlukan.
            try {
                const user = await fetchUserBySession();
                if (user) {
                    setUser(user);
                    setAuthStatus('authenticated');
                } else {
                    setUser(null);
                    setAuthStatus('unauthenticated');
                    storage.clear();
=======
            try {
                // Try to get user from session/localStorage
                const user = await fetchUserBySession();
                
                if (user) {
                    console.log('AuthInitializer - User found:', user);
                    setUser(user);
                    setAuthStatus('authenticated');
                } else {
                    console.log('AuthInitializer - No user found');
                    setUser(null);
                    setAuthStatus('unauthenticated');
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
                }
            } catch (error) {
                console.error('AuthInitializer - Error initializing auth:', error);
                setUser(null);
                setAuthStatus('unauthenticated');
<<<<<<< HEAD
                storage.clear();
=======
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
            }
        };

        initializeAuth();
    }, [setAuthStatus, setUser]);
};

// Component version
const AuthInitializer: React.FC = () => {
    useAuthInitializer();
    return null; // This component doesn't render anything
};

export default AuthInitializer;

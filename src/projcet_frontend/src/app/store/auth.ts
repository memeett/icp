import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { User } from '../../shared/types/User';

// Auth status type
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// Base atoms
export const authStatusAtom = atom<AuthStatus>('loading');
export const userAtom = atom<User | null>(null);
export const sessionAtom = atomWithStorage<string | null>('session', null);

// Derived atoms
export const isLoadingAtom = atom((get) => get(authStatusAtom) === 'loading');
export const isAuthenticatedAtom = atom((get) => get(authStatusAtom) === 'authenticated');
export const isUnauthenticatedAtom = atom((get) => get(authStatusAtom) === 'unauthenticated');

// User profile atoms
export const userIdAtom = atom((get) => get(userAtom)?.id || null);
export const userNameAtom = atom((get) => get(userAtom)?.username || '');
export const userEmailAtom = atom((get) => get(userAtom)?.email || '');
export const userProfilePictureAtom = atom((get) => get(userAtom)?.profilePicture || null);
export const userPreferencesAtom = atom((get) => get(userAtom)?.preference || []);

// Auth actions atom
export const authActionsAtom = atom(
  null,
  (get, set, action: { type: 'LOGIN'; user: User } | { type: 'LOGOUT' } | { type: 'SET_LOADING' }) => {
    switch (action.type) {
      case 'LOGIN':
        set(userAtom, action.user);
        set(authStatusAtom, 'authenticated');
        break;
      case 'LOGOUT':
        set(userAtom, null);
        set(authStatusAtom, 'unauthenticated');
        set(sessionAtom, null);
        // Clear localStorage
        localStorage.removeItem('current_user');
        break;
      case 'SET_LOADING':
        set(authStatusAtom, 'loading');
        break;
    }
  }
);

// Face recognition atoms
export const faceRecognitionEnabledAtom = atom((get) => {
  const user = get(userAtom);
  return user?.isFaceRecognitionOn || false;
});

// User balance atom (for ICP integration)
export const userBalanceAtom = atom((get) => {
  const user = get(userAtom);
  return user?.balance || 0;
});
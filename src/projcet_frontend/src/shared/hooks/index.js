// Custom hooks barrel exports
export { useAuth } from './useAuth';
export { useJobs } from './useJobs';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback, useDebouncedSearch } from './useDebounce';
export { useModal, useAuthModal, useJobModal, useConfirmModal } from './useModal';
export { useNotifications, useToast } from './useNotifications';
// Re-export the existing hooks from the old location for backward compatibility
export { useOutsideClick } from '../../utils/useTapOutside';

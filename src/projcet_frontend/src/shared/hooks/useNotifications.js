import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { notificationsAtom, notificationActionsAtom } from '../../app/store/ui';
export const useNotifications = () => {
    const [notifications] = useAtom(notificationsAtom);
    const [, notificationActions] = useAtom(notificationActionsAtom);
    const addNotification = useCallback((notification) => {
        notificationActions({ type: 'ADD', notification });
    }, [notificationActions]);
    const removeNotification = useCallback((id) => {
        notificationActions({ type: 'REMOVE', id });
    }, [notificationActions]);
    const clearNotifications = useCallback(() => {
        notificationActions({ type: 'CLEAR' });
    }, [notificationActions]);
    // Convenience methods
    const success = useCallback((title, message, duration = 5000) => {
        addNotification({ type: 'success', title, message, duration });
    }, [addNotification]);
    const error = useCallback((title, message, duration = 0) => {
        addNotification({ type: 'error', title, message, duration });
    }, [addNotification]);
    const warning = useCallback((title, message, duration = 7000) => {
        addNotification({ type: 'warning', title, message, duration });
    }, [addNotification]);
    const info = useCallback((title, message, duration = 5000) => {
        addNotification({ type: 'info', title, message, duration });
    }, [addNotification]);
    return {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        success,
        error,
        warning,
        info,
    };
};
// Hook for toast-style notifications (auto-dismiss)
export const useToast = () => {
    const { success, error, warning, info } = useNotifications();
    return {
        toast: {
            success: (message, duration = 3000) => success('Success', message, duration),
            error: (message, duration = 5000) => error('Error', message, duration),
            warning: (message, duration = 4000) => warning('Warning', message, duration),
            info: (message, duration = 3000) => info('Info', message, duration),
        }
    };
};

import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../hooks/useAuth';
const ProfileCompletionGuard = ({ children }) => {
    const { isAuthenticated, isLoading, needsProfileCompletion, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        // Don't redirect if still loading
        if (isLoading)
            return;
        // Don't redirect if not authenticated
        if (!isAuthenticated)
            return;
        // Don't redirect if already on profile completion page
        if (location.pathname === '/complete-profile')
            return;
        // Don't redirect if on login/register pages
        if (['/login', '/register', '/'].includes(location.pathname))
            return;
        // Redirect to profile completion if needed
        if (needsProfileCompletion && user && !user.isProfileCompleted) {
            navigate('/complete-profile', { replace: true });
        }
    }, [isAuthenticated, isLoading, needsProfileCompletion, user, navigate, location.pathname]);
    // Show loading spinner while checking authentication
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Spin, { size: "large", tip: "Loading..." }) }));
    }
    return _jsx(_Fragment, { children: children });
};
export default ProfileCompletionGuard;

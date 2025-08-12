import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar, Dropdown, Badge, Drawer, Menu, Typography, Divider } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined, MenuOutlined, WalletOutlined, StarOutlined, ProfileOutlined, GlobalOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../shared/hooks/useAuth';
import { useAtom } from 'jotai';
import { themeAtom } from '../../app/store/ui';
import { getProfilePictureUrl } from '../../controller/userController';
const { Text } = Typography;
const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme] = useAtom(themeAtom);
    const { isAuthenticated, isLoading, user, loginWithInternetIdentity, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogin = async () => {
        try {
            await loginWithInternetIdentity();
        }
        catch (error) {
            console.error('Login failed:', error);
        }
    };
    const handleLogout = async () => {
        try {
            await logout();
        }
        catch (error) {
            console.error('Logout failed:', error);
        }
    };
    const profilePictureUrl = user?.profilePicture
        ? getProfilePictureUrl(user.id, user.profilePicture)
        : undefined;
    const userMenuItems = [
        {
            key: 'profile',
            icon: _jsx(ProfileOutlined, {}),
            label: 'My Profile',
            onClick: () => navigate('/profile'),
        },
        {
            key: 'wallet',
            icon: _jsx(WalletOutlined, {}),
            label: (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "Wallet" }), _jsxs(Text, { strong: true, className: "text-green-600", children: ["$", user?.wallet?.toFixed(2) || '0.00'] })] })),
        },
        {
            key: 'rating',
            icon: _jsx(StarOutlined, {}),
            label: (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "Rating" }), _jsxs(Text, { strong: true, className: "text-yellow-600", children: [user?.rating?.toFixed(1) || '0.0', " \u2B50"] })] })),
        },
        {
            type: 'divider',
        },
        {
            key: 'settings',
            icon: _jsx(SettingOutlined, {}),
            label: 'Settings',
            onClick: () => navigate('/settings'),
        },
        {
            key: 'logout',
            icon: _jsx(LogoutOutlined, {}),
            label: 'Logout',
            onClick: handleLogout,
            danger: true,
        },
    ];
    const navigationItems = [
        { key: 'find', label: 'Find Jobs', path: '/find' },
        { key: 'post', label: 'Post Job', path: '/post' },
        { key: 'browse', label: 'Browse Freelancers', path: '/browse' },
        { key: 'manage', label: 'Manage Jobs', path: '/manage' },
    ];
    const isActivePath = (path) => location.pathname === path;
    return (_jsxs(_Fragment, { children: [_jsx(motion.nav, { initial: { y: -100 }, animate: { y: 0 }, className: "sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx(Link, { to: "/", className: "flex items-center space-x-2", children: _jsxs(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center", children: _jsx(Text, { className: "text-white font-bold text-sm", children: "E" }) }), _jsx(Text, { className: "text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "ERGASIA" })] }) }), _jsx("div", { className: "hidden md:flex items-center space-x-8", children: navigationItems.map((item) => (_jsxs(Link, { to: item.path, className: `relative px-3 py-2 rounded-lg transition-all duration-200 ${isActivePath(item.path)
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`, children: [item.label, isActivePath(item.path) && (_jsx(motion.div, { layoutId: "activeTab", className: "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" }))] }, item.key))) }), _jsxs("div", { className: "flex items-center space-x-4", children: [isAuthenticated && (_jsx(motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Badge, { count: 3, size: "small", children: _jsx(Button, { type: "text", icon: _jsx(BellOutlined, {}), className: "flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" }) }) })), _jsx(AnimatePresence, { mode: "wait", children: isLoading ? (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx("div", { className: "w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }) }, "loading")) : isAuthenticated && user ? (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "hidden md:block", children: _jsx(Dropdown, { menu: { items: userMenuItems }, placement: "bottomRight", trigger: ['click'], children: _jsxs("div", { className: "flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", children: [_jsx(Avatar, { size: 32, src: profilePictureUrl, icon: _jsx(UserOutlined, {}), className: "border-2 border-blue-200 dark:border-blue-800" }), _jsxs("div", { className: "text-left", children: [_jsx(Text, { className: "block text-sm font-medium text-gray-900 dark:text-white", children: user.username || 'User' }), _jsxs(Text, { className: "block text-xs text-gray-500 dark:text-gray-400", children: ["$", user.wallet?.toFixed(2) || '0.00'] })] })] }) }) }, "authenticated")) : (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "hidden md:block", children: _jsx(Button, { type: "primary", icon: _jsx(GlobalOutlined, {}), onClick: handleLogin, className: "bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg", children: "Login with Internet Identity" }) }, "unauthenticated")) }), _jsx("div", { className: "md:hidden", children: _jsx(Button, { type: "text", icon: _jsx(MenuOutlined, {}), onClick: () => setMobileMenuOpen(true), className: "flex items-center justify-center w-10 h-10" }) })] })] }) }) }), _jsx(Drawer, { title: "ERGASIA", placement: "right", onClose: () => setMobileMenuOpen(false), open: mobileMenuOpen, className: "md:hidden", children: _jsxs("div", { className: "flex flex-col space-y-4", children: [isAuthenticated && user && (_jsxs("div", { className: "flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx(Avatar, { size: 40, src: profilePictureUrl, icon: _jsx(UserOutlined, {}) }), _jsxs("div", { children: [_jsx(Text, { className: "block font-medium", children: user.username || 'User' }), _jsxs(Text, { className: "block text-sm text-gray-500", children: ["$", user.wallet?.toFixed(2) || '0.00'] })] })] })), _jsx(Divider, {}), _jsx(Menu, { mode: "vertical", selectedKeys: [location.pathname], className: "border-0", children: navigationItems.map((item) => (_jsx(Menu.Item, { onClick: () => {
                                    navigate(item.path);
                                    setMobileMenuOpen(false);
                                }, children: item.label }, item.path))) }), _jsx(Divider, {}), isAuthenticated ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Button, { block: true, icon: _jsx(ProfileOutlined, {}), onClick: () => {
                                        navigate('/profile');
                                        setMobileMenuOpen(false);
                                    }, children: "My Profile" }), _jsx(Button, { block: true, icon: _jsx(SettingOutlined, {}), onClick: () => {
                                        navigate('/settings');
                                        setMobileMenuOpen(false);
                                    }, children: "Settings" }), _jsx(Button, { block: true, danger: true, icon: _jsx(LogoutOutlined, {}), onClick: handleLogout, children: "Logout" })] })) : (_jsx(Button, { block: true, type: "primary", icon: _jsx(GlobalOutlined, {}), onClick: handleLogin, className: "bg-gradient-to-r from-blue-500 to-purple-600 border-0", children: "Login with Internet Identity" }))] }) })] }));
};
export default Navbar;

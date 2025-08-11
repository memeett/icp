import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Drawer,
  Menu,
  Typography,
  Divider
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  MenuOutlined,
  WalletOutlined,
  StarOutlined,
  ProfileOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../shared/hooks/useAuth';
import { useAtom } from 'jotai';
import { themeAtom } from '../../app/store/ui';
import { getProfilePictureUrl } from '../../controller/userController';

const { Text } = Typography;

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme] = useAtom(themeAtom);
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    loginWithInternetIdentity, 
    logout 
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      await loginWithInternetIdentity();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const profilePictureUrl = user?.profilePicture
    ? getProfilePictureUrl(user.id, user.profilePicture)
    : undefined;

  const userMenuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'wallet',
      icon: <WalletOutlined />,
      label: (
        <div className="flex justify-between items-center">
          <span>Wallet</span>
          <Text strong className="text-green-600">
            ${user?.wallet?.toFixed(2) || '0.00'}
          </Text>
        </div>
      ),
    },
    {
      key: 'rating',
      icon: <StarOutlined />,
      label: (
        <div className="flex justify-between items-center">
          <span>Rating</span>
          <Text strong className="text-yellow-600">
            {user?.rating?.toFixed(1) || '0.0'} ⭐
          </Text>
        </div>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
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

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Text className="text-white font-bold text-sm">E</Text>
                </div>
                <Text className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ERGASIA
                </Text>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                  {isActivePath(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Badge count={3} size="small">
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    />
                  </Badge>
                </motion.div>
              )}

              {/* Authentication Section */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                ) : isAuthenticated && user ? (
                  <motion.div
                    key="authenticated"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="hidden md:block"
                  >
                    <Dropdown
                      menu={{ items: userMenuItems }}
                      placement="bottomRight"
                      trigger={['click']}
                    >
                      <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Avatar
                          size={32}
                          src={profilePictureUrl}
                          icon={<UserOutlined />}
                          className="border-2 border-blue-200 dark:border-blue-800"
                        />
                        <div className="text-left">
                          <Text className="block text-sm font-medium text-gray-900 dark:text-white">
                            {user.username || 'User'}
                          </Text>
                          <Text className="block text-xs text-gray-500 dark:text-gray-400">
                            ${user.wallet?.toFixed(2) || '0.00'}
                          </Text>
                        </div>
                      </div>
                    </Dropdown>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unauthenticated"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="hidden md:block"
                  >
                    <Button
                      type="primary"
                      icon={<GlobalOutlined />}
                      onClick={handleLogin}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                    >
                      Login with Internet Identity
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center justify-center w-10 h-10"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <Drawer
        title="ERGASIA"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="md:hidden"
      >
        <div className="flex flex-col space-y-4">
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar
                size={40}
                src={profilePictureUrl}
                icon={<UserOutlined />}
              />
              <div>
                <Text className="block font-medium">{user.username || 'User'}</Text>
                <Text className="block text-sm text-gray-500">
                  ${user.wallet?.toFixed(2) || '0.00'}
                </Text>
              </div>
            </div>
          )}

          <Divider />

          {/* Navigation Items */}
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            className="border-0"
          >
            {navigationItems.map((item) => (
              <Menu.Item
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>

          <Divider />

          {/* Authentication Actions */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <Button
                block
                icon={<ProfileOutlined />}
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
              >
                My Profile
              </Button>
              <Button
                block
                icon={<SettingOutlined />}
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
              >
                Settings
              </Button>
              <Button
                block
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              block
              type="primary"
              icon={<GlobalOutlined />}
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
            >
              Login with Internet Identity
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;

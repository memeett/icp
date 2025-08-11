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
  GlobalOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../shared/hooks/useAuth';
import { useAtom } from 'jotai';
import { themeAtom } from '../../app/store/ui';
import { getProfilePictureUrl } from '../../controller/userController';
import { useTheme } from '../../app/providers/ThemeProvider';
import FaceRecognition from '../../components/FaceRecognition';
import { AuthenticationModal } from '../../components/modals/AuthenticationModal';
import  ergasiaLogo from '../../assets/ergasia_logo.png'
import ergasiaLogoWhite from '../../assets/ergasia_logo_white.png'

const { Text } = Typography;

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('icp');
  const [theme] = useAtom(themeAtom);
  const { toggleTheme } = useTheme();
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
    setIsModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
  };

  const handleLoginError = (error: string) => {
    console.error(error);
    setIsModalOpen(false);
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
      type: 'divider' as const,
    },
    {
      key: 'account',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => navigate('/account'),
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
        className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
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
                <img src={ theme === 'dark' ? ergasiaLogoWhite : ergasiaLogo }
                  alt="Ergasia Logo" className="h-8 w-auto"/>
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <motion.div
                    key={item.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        type={
                            isActivePath(item.path)
                                ? 'primary'
                                : 'text'
                        }
                        onClick={() => navigate(item.path)}
                        className="relative"
                    >
                        {item.label}
                        {isActivePath(item.path) && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                initial={false}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            />
                        )}
                    </Button>
                  </motion.div>
                ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  type="text"
                  icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/50"
                />
              </motion.div>

              {/* Notifications */}
              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Badge count={3} size="small">
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/50"
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
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                      <div className="flex items-center space-x-6 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Avatar
                          size={32}
                          src={profilePictureUrl}
                          icon={<UserOutlined />}
                          className="border-2 border-primary/30"
                        />
                        <div className="text-left ml-4">
                          <Text className="block text-sm font-bold text-foreground">
                            {user.username || 'User'}
                          </Text>
                          <Text className="block text-xs text-muted-foreground">
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
                      className="shadow-lg"
                    >
                      Sign In
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
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Avatar
                size={40}
                src={profilePictureUrl}
                icon={<UserOutlined />}
              />
              <div>
                <Text className="block font-medium">{user.username || 'User'}</Text>
                <Text className="block text-sm text-muted-foreground">
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
                  navigate('/account');
                  setMobileMenuOpen(false);
                }}
              >
                Account Settings
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
              className=""
            >
              Sign In
            </Button>
          )}
        </div>
      </Drawer>

      {/* Login Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "100vh" }}
              className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Login</h2>
                <Button
                  type="text"
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
              <div className="flex border-b border-border mb-4">
                <button
                  className={`py-2 px-4 text-foreground hover:text-primary transition-colors ${activeTab === 'icp' ? 'border-b-2 border-primary text-primary' : ''}`}
                  onClick={() => setActiveTab('icp')}
                >
                  Internet Identity
                </button>
                <button
                  className={`py-2 px-4 text-foreground hover:text-primary transition-colors ${activeTab === 'face' ? 'border-b-2 border-primary text-primary' : ''}`}
                  onClick={() => setActiveTab('face')}
                >
                  Face Recognition
                </button>
              </div>
              {activeTab === 'icp' && (
                <div className="text-center">
                  <Button
                    type="primary"
                    icon={<GlobalOutlined />}
                    onClick={async () => {
                      try {
                        await loginWithInternetIdentity();
                        setIsModalOpen(false);
                      } catch (error) {
                        console.error('Login failed:', error);
                      }
                    }}
                    className="w-full"
                  >
                    Continue with Internet Identity
                  </Button>
                </div>
              )}
              {activeTab === 'face' && user && (
                <FaceRecognition
                  principalId={user.id}
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  mode="verify"
                  isOpen={isModalOpen && activeTab === 'face'}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

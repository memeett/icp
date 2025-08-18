import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Divider,
  Modal,
  Tabs,
  Skeleton
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
  MoonOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../shared/hooks/useAuth';
import { useAtom } from 'jotai';
import { themeAtom } from '../../app/store/ui';
import { getProfilePictureUrl, getUserById } from '../../controller/userController';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useInboxPanel } from '../../contexts/InboxPanelContext';
import FaceRecognition from '../../components/FaceRecognition';
import { AuthenticationModal } from '../../components/modals/AuthenticationModal';
import ergasiaLogo from '../../assets/ergasia_logo.png'
import ergasiaLogoWhite from '../../assets/ergasia_logo_white.png'
import { getAllInboxByUserId } from '../../controller/inboxController';
import { Inbox } from '../../../../declarations/inbox/inbox.did';
import { getBalanceController, topUpWalletController } from '../../controller/tokenController';
import { Token } from '../../interface/Token';
import { InboxResponse } from '../../shared/types/Inbox';

const { Text } = Typography;

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('icp');
  const [theme] = useAtom(themeAtom);
  const { toggleTheme } = useTheme();
  const { toggleInboxPanel } = useInboxPanel();
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithInternetIdentity,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inboxes, setInboxes] = useState<InboxResponse[]>([]);

  const fetchInbox = useCallback(async () => {
    try {
      const inboxResult = await getAllInboxByUserId(user?.id || "");
      if (inboxResult) {
        setInboxes(inboxResult);
      }
      console.log(inboxes)
    } catch (error) {
      console.error("Failed to fetch inbox:", error);
    }
  }, [user?.id]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [receiverInbox, setReceiverInbox] = useState<Inbox[]>([]);
  const [senderInbox, setSenderInbox] = useState<Inbox[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [userWallet, setUserWallet] = useState<Token>();
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  useEffect(() => {
    const fetchUserWallet = async () => {
      if (user?.id) {
        setIsWalletLoading(true);
        try {
          const balance = await getBalanceController(user);
          setUserWallet(balance);
        } catch (error) {
          console.error("Failed to fetch user wallet:", error);
        } finally {
          setIsWalletLoading(false);
        }
      }
    };

    fetchUserWallet();
  }, [user])

  useEffect(() => {
    if (user?.id) {
      fetchInbox();
    }
  }, [user?.id, fetchInbox]);


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

  const handleTopUp = async () => {
    if (user?.id) {
      try {
        const result = await topUpWalletController(user, 10); // Top up with 10 tokens
      } catch (error) {
        console.error("Top-up failed:", error);
      }
    }
  };

  const getUsernameById = useCallback(
    async (userId: string): Promise<string | null> => {
      try {
        const result = await getUserById(userId);
        if (result) {
          return result.username;
        }
        return null;
      } catch (error) {
        console.error("Failed to get user by id:", error);
        return null;
      }
    },
    []
  );


  const fetchUsernames = useCallback(async () => {
    const uniqueUserIds = [
      ...new Set([
        ...receiverInbox.map((n) => n.senderId),
        ...senderInbox.map((n) => n.receiverId),
      ]),
    ];
    const newUserIds = uniqueUserIds.filter((id) => !usernames[id]);

    if (newUserIds.length > 0) {
      const usernameMap: { [key: string]: string } = {};
      const usernamePromises = newUserIds.map(async (id) => {
        const username = await getUsernameById(id);
        if (username) {
          usernameMap[id] = username;
        }
      });

      await Promise.all(usernamePromises); // Wait for all requests to complete
      setUsernames((prev) => ({ ...prev, ...usernameMap })); // Merge with existing usernames
    }
  }, [receiverInbox, senderInbox, usernames, getUsernameById]);


  useEffect(() => {
    if (receiverInbox.length > 0 || senderInbox.length > 0) {
      fetchUsernames();
    }
  }, [receiverInbox, senderInbox, fetchUsernames]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

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
          {isWalletLoading ? (
            <Skeleton.Input style={{ width: 80 }} active size="small" />
          ) : (
            <Text strong className="text-green-600">
              {userWallet?.token_value.toFixed(2) || '0.00'} {userWallet?.token_symbol || 'undefined'}
            </Text>
          )}
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
                <img src={theme === 'dark' ? ergasiaLogoWhite : ergasiaLogo}
                  alt="Ergasia Logo" className="h-8 w-auto" />
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
              
              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Badge count={inboxes.filter((m) => !m.read).length} size="small">
                    <Button
                      type="text"
                      icon={<MessageOutlined />}
                      onClick={toggleInboxPanel}
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
                            {isWalletLoading ? (
                              <Skeleton.Input style={{ width: 80 }} active size="small" />
                            ) : (
                              `${userWallet?.token_value.toFixed(2) || '0.00'} ${userWallet?.token_symbol || 'undefined'}`
                            )}
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

                 <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={handleTopUp}
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
                  {isWalletLoading ? (
                    <Skeleton.Input style={{ width: 80 }} active size="small" />
                  ) : (
                    `${userWallet?.token_value.toFixed(2) || '0.00'} ${userWallet?.token_symbol || 'undefined'}`
                  )}
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
      <Modal
        title={<Typography.Title level={3} style={{ margin: 0 }}>Login</Typography.Title>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
        centered
        destroyOnHidden
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'icp',
              label: 'Internet Identity',
              children: (
                <div className="text-center py-4">
                  <Button
                    type="primary"
                    size="large"
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
              ),
            },
            {
              key: 'face',
              label: 'Face Recognition',
              children: (
                <FaceRecognition
                  principalId={user?.id || ""}
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  isOpen={isModalOpen && activeTab === 'face'}
                  onClose={() => setIsModalOpen(false)}
                  purpose="login"
                />
              ),
            },
          ]}
        />
      </Modal>

    </>
  );
};

export default Navbar;

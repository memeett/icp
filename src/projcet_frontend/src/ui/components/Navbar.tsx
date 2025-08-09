import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button, 
  Dropdown, 
  Avatar, 
  Badge, 
  Space, 
  Drawer,
  Menu,
  Switch,
  Divider
} from 'antd';
import { 
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  SunOutlined,
  MoonOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useNotifications } from '../../shared/hooks/useNotifications';
import ergasiaLogo from '../../assets/ergasia_logo.png';
import ergasiaLogoWhite from '../../assets/ergasia_logo_white.png';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = memo(({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.timestamp).length;

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const navItems = [
    { key: '/find', label: 'Find Jobs', path: '/find' },
    { key: '/browse', label: 'Browse Talent', path: '/browse' },
    { key: '/post', label: 'Post Job', path: '/post' },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/manage'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 ${className}`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src={theme === 'dark'? ergasiaLogoWhite : ergasiaLogo}
              alt="Ergasia Logo"
              className="h-8 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type={isActivePath(item.path) ? 'primary' : 'text'}
                  onClick={() => navigate(item.path)}
                  className="relative"
                >
                  {item.label}
                  {isActivePath(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                className="bg-gray-200"
              />
            </motion.div>

            {/* Search Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => navigate('/search')}
                className="hidden sm:flex"
              />
            </motion.div>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Badge count={unreadCount} size="small">
                    <Button
                      type="text"
                      icon={<BellOutlined />}
                      onClick={() => navigate('/notifications')}
                    />
                  </Badge>
                </motion.div>

                {/* User Menu */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="text" className="flex items-center space-x-2 px-2">
                      <Avatar
                        size="small"
                        src={user?.profilePicture ? URL.createObjectURL(user.profilePicture) : undefined}
                        icon={<UserOutlined />}
                      />
                      <span className="hidden sm:block text-sm font-medium">
                        {user?.username || 'User'}
                      </span>
                    </Button>
                  </motion.div>
                </Dropdown>
              </>
            ) : (
              <Space>
                <Button
                  type="text"
                  onClick={() => navigate('/face-recognition/login')}
                  className="hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate('/face-recognition/register')}
                >
                  Get Started
                </Button>
              </Space>
            )}

            {/* Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden"
            >
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={toggleMobileMenu}
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <img src={ergasiaLogo} alt="Ergasia" className="h-6 w-auto" />
            <span className="font-bold">Ergasia</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="flex flex-col space-y-4">
          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.key}
                type={isActivePath(item.path) ? 'primary' : 'text'}
                block
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <Divider />

          {/* User Actions */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar
                  src={user?.profilePicture ? URL.createObjectURL(user.profilePicture) : undefined}
                  icon={<UserOutlined />}
                />
                <div>
                  <div className="font-medium">{user?.username || 'User'}</div>
                  <div className="text-sm text-gray-500">View Profile</div>
                </div>
              </div>
              
              <Button
                block
                icon={<DashboardOutlined />}
                onClick={() => {
                  navigate('/manage');
                  setMobileMenuOpen(false);
                }}
              >
                Dashboard
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
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                block
                onClick={() => {
                  navigate('/face-recognition/login');
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button
                block
                type="primary"
                onClick={() => {
                  navigate('/face-recognition/register');
                  setMobileMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
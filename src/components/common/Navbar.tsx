import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Bell, Menu, X, User, Heart, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Button } from '../ui/Button';
import { NotificationCenter } from './NotificationCenter';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, notifications } = useNotificationStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'Search', path: '/search' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Quick<span className="text-orange-500">Bite</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive(link.path)
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Extra Admin Entry Point */}
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" /> Admin
              </Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                    {unreadNotifCount}
                  </span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 origin-top-right">
                  <NotificationCenter onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Profile Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-sm font-bold text-slate-950 dark:text-slate-50">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <User className="h-4.5 w-4.5 text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/profile?tab=wishlist"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <Heart className="h-4.5 w-4.5 text-slate-400" />
                      Favorites
                    </Link>
                    <Link
                      to="/profile?tab=settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <Settings className="h-4.5 w-4.5 text-slate-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors mt-1"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-block">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                  ${isActive(link.path)
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              Admin Dashboard
            </Link>

            {!isAuthenticated && (
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800 mt-2 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

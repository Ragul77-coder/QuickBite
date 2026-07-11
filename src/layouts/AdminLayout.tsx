import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  Ticket,
  Truck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { Button } from '../components/ui/Button';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Return to main site
    navigate('/');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Restaurants', path: '/admin/restaurants', icon: Store },
    { label: 'Menu Management', path: '/admin/foods', icon: UtensilsCrossed },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { label: 'Deliveries', path: '/admin/deliveries', icon: Truck },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-5">
        {/* Brand header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold">
              QB
            </div>
            <span className="text-lg font-black text-slate-950 dark:text-white">Admin Hub</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 mt-6 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${active
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2.5 rounded-xl border-slate-200 text-slate-700 dark:text-slate-350">
              <ArrowLeft className="h-4 w-4" /> Exit to Client
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2.5 rounded-xl text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs"
        />
      )}

      {/* Sidebar - Mobile Drawer */}
      <aside
        className={`
          lg:hidden fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-5 transition-transform duration-350 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white font-bold">
              QB
            </div>
            <span className="text-lg font-black text-slate-950 dark:text-white">Admin Hub</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 mt-6 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${active
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Button variant="outline" className="w-full justify-start gap-2.5 rounded-xl border-slate-200 text-slate-700 dark:text-slate-350">
              <ArrowLeft className="h-4 w-4" /> Exit to Client
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2.5 rounded-xl text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <header className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg text-slate-500 hover:text-slate-700"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {menuItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-right hidden sm:block">
                <span className="block font-bold text-slate-900 dark:text-white">Admin Master</span>
                <span className="block text-slate-400">admin@quickbite.com</span>
              </span>
              <div className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/10">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content scrolling portal */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-950/30">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

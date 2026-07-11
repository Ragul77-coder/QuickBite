import React, { useState } from 'react';
import { useNotificationStore as useNotifStore } from '../../store/notificationStore';
import { Bell, Heart, Gift, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'offer':
        return <Gift className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-emerald-50 dark:bg-emerald-950/20';
      case 'offer':
        return 'bg-orange-50 dark:bg-orange-950/20';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 flex flex-col max-h-[480px] overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <h3 className="font-bold text-slate-950 dark:text-slate-50 text-base">Notifications</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-700" onClick={markAllAsRead}>
            Mark all read
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500" onClick={clearNotifications}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl mb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'unread'
              ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
          }`}
        >
          Unread
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3 rounded-xl border border-transparent transition-all cursor-pointer flex gap-3 ${
                item.read
                  ? 'bg-slate-50/40 dark:bg-slate-900/20 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 text-slate-500 dark:text-slate-400'
                  : 'bg-white dark:bg-slate-900/80 border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 text-slate-900 dark:text-slate-100'
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${getBg(item.type)}`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className={`text-xs font-bold truncate ${item.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {item.title}
                  </h4>
                  {!item.read && <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0 mt-1" />}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 line-clamp-2 mt-0.5">
                  {item.message}
                </p>
                <span className="text-[9px] text-slate-400 block mt-1.5">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-650">
            <Bell className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-700" />
            <p className="text-xs font-semibold">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

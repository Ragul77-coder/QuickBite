import { create } from 'zustand';
import { Notification } from '../types';
import { notificationsList } from '../data/mockData';

interface NotificationState {
  notifications: Notification[];
  darkMode: boolean;
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toggleDarkMode: () => void;
}

const getStoredNotificationState = () => {
  try {
    const savedNotifications = localStorage.getItem('qb_notifications');
    const savedDarkMode = localStorage.getItem('qb_dark_mode');
    
    return {
      notifications: savedNotifications ? JSON.parse(savedNotifications) : notificationsList,
      darkMode: savedDarkMode ? JSON.parse(savedDarkMode) === 'true' : false,
    };
  } catch (e) {
    return { notifications: notificationsList, darkMode: false };
  }
};

const initialData = getStoredNotificationState();

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialData.notifications,
  darkMode: initialData.darkMode,

  addNotification: (title, message, type) => {
    set((state) => {
      const newNotification: Notification = {
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newNotification, ...state.notifications];
      localStorage.setItem('qb_notifications', JSON.stringify(updated));
      return { notifications: updated };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('qb_notifications', JSON.stringify(updated));
      return { notifications: updated };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem('qb_notifications', JSON.stringify(updated));
      return { notifications: updated };
    });
  },

  clearNotifications: () => {
    localStorage.removeItem('qb_notifications');
    set({ notifications: [] });
  },

  toggleDarkMode: () => {
    set((state) => {
      const nextMode = !state.darkMode;
      localStorage.setItem('qb_dark_mode', String(nextMode));
      if (nextMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: nextMode };
    });
  },
}));

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationType = "success" | "alert" | "info" | "message" | "priority";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  category: string;
  message: string;
  time: number; // Timestamp
  read: boolean;
  meta?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "initial-1",
          type: "info",
          category: "System",
          title: "Welcome to Wealth Method",
          message: "Your premium financial vault is now active. Explore your insights and set your first goal.",
          time: Date.now(),
          read: false,
        }
      ],
      addNotification: (notif) => {
        const newNotif: NotificationItem = {
          ...notif,
          id: Math.random().toString(36).substring(7),
          time: Date.now(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },
      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

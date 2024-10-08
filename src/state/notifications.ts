import { nanoid } from 'nanoid';
import { create } from 'zustand';

type Notification = {
  id?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  action?: {
    text: string;
    onClick: () => void;
  };
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ ...notification, id: nanoid(5) }, ...state.notifications],
    })),
  removeNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),
}));

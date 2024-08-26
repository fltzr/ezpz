
import { create } from 'zustand'

type Notification = {
    id?: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

type NotificationStore = {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, { ...notification, id: Math.random().toString(36).substring(2, 9) }] })),
    removeNotification: (id) => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) }))
}))
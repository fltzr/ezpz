import { type FlashbarProps, Button, Flashbar } from '@cloudscape-design/components';
import { useNotificationStore } from '../state/notifications';
import { useEffect } from 'react';

const AUTO_DISMISS_DURATION = 5000;

export const Notifications = () => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    const timers = notifications.map((n) => {
      if (!n.action) {
        return setTimeout(() => {
          removeNotification(n.id ?? '');
        }, AUTO_DISMISS_DURATION);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications, removeNotification]);

  const items: FlashbarProps.MessageDefinition[] = notifications.map((notification) => ({
    type: notification.type,
    content: notification.message,
    dismissible: true,
    onDismiss: () => removeNotification(notification.id ?? ''),
    action: notification.action ? (
      <Button onClick={notification.action.onClick}>{notification.action.text}</Button>
    ) : undefined,
  }));

  return <Flashbar stackItems items={items} />;
};

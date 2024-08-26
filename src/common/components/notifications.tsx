import { type FlashbarProps, Flashbar } from "@cloudscape-design/components";
import { useNotificationStore } from "../state/notifications";

export const Notifications = () => {
    const { notifications, removeNotification } = useNotificationStore();

    const items: FlashbarProps.MessageDefinition[] = notifications.map(notification => ({
        type: notification.type,
        content: notification.message,
        dismissible: true,
        onDismiss: () => removeNotification(notification.id ?? ''),
    }));

    return <Flashbar stackItems items={items} />
}
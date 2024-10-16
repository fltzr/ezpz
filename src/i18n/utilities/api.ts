import i18n from '..';

type APINotificationProps = {
  operation: string;
  itemName: string;
  itemNamePlural: string;
  itemCount?: number;
  isSuccess: boolean;
};

export const apiNotification = ({
  operation,
  itemName,
  itemNamePlural,
  itemCount = 1,
  isSuccess,
}: APINotificationProps) => {
  const key = `api.${isSuccess ? 'success' : 'error'}.${operation}`;

  const message = i18n.t(key, {
    item: itemName,
    item_plural: itemNamePlural,
    count: itemCount,
  });

  return message;
};

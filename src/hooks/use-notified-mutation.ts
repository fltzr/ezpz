import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { nanoid } from 'nanoid';

import { useNotificationStore } from '../state/notifications';

type NotificationOptions<TData, TError> = {
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
  showRetry?: boolean;
};

export const useNotifiedMutation = <
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> &
    NotificationOptions<TData, TError>
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...options,
    onSuccess: (data, variables, context) => {
      if (options.successMessage) {
        addNotification({
          id: nanoid(5),
          type: 'success',
          message:
            typeof options.successMessage === 'function'
              ? options.successMessage(data)
              : options.successMessage,
        });
      }

      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (options.errorMessage) {
        addNotification({
          id: nanoid(5),
          type: 'error',
          message:
            typeof options.errorMessage === 'function'
              ? options.errorMessage(error)
              : options.errorMessage,
        });
      }
      options.onError?.(error, variables, context);
    },
  });
};

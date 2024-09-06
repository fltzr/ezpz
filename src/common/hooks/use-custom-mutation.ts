import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useNotificationStore } from '../state/notifications';
import { nanoid } from 'nanoid';

type NotificationOptions = {
  successMessage?: string | ((data: any) => string);
  errorMessage?: string | ((error: unknown) => string);
  showRetry?: boolean;
};

export const useNotifiedMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & NotificationOptions
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const { addNotification } = useNotificationStore();
  const mutation = useMutation(options);

  return {
    ...mutation,
    mutate: (...args: Parameters<typeof mutation.mutate>) => {
      const [variables, options] = args;
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data, variables, context) => {
          if (options?.successMessage) {
            addNotification({
              id: nanoid(5),
              type: 'success',
              message:
                typeof options?.successMessage === 'function'
                  ? options?.successMessage(data)
                  : options?.successMessage,
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
              action: options.showRetry
                ? {
                    text: 'Retry',
                    onClick: () => mutation.mutate(variables, options),
                  }
                : undefined,
            });
          }
          options.onError?.(error, variables, context);
        },
      });
    },
    mutateAsync: (...args: Parameters<typeof mutation.mutateAsync>) => {
      const [variables, options] = args;
      return mutation.mutateAsync(variables, {
        ...options,
        onSuccess: (data: TData, variables: TVariables, context: TContext) => {
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
          return options.onSuccess?.(data, variables, context);
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
              action: options.showRetry
                ? {
                    text: 'Retry',
                    onClick: () => mutation.mutate(...args),
                  }
                : undefined,
            });
          }
          return options.onError?.(error, variables, context);
        },
      });
    },
  };
};

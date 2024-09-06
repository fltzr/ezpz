import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../common/state/notifications';
import { supabase } from '../../lib/supabase';
import { nanoid } from 'nanoid';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await supabase.auth.getUser();
      if (response.error) throw response.error;
      return response.data.user;
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/budget');
      addNotification({
        id: nanoid(5),
        type: 'success',
        message: 'Signed in',
      });
    },
    onError: (error: Error) => {
      addNotification({
        id: nanoid(5),
        type: 'error',
        message: `Sign in failed: ${error.message}`,
      });
    },
  });

  return {
    user,
    isLoading,
    signIn: signInMutation.mutate,
  };
};

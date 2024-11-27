// hooks/useSignIn.ts
import { UseFormReset, UseFormSetFocus } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AuthError } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

import { useSupabase } from '@/hooks/use-supabase';
import { useNotificationStore } from '@/state/notifications';

import { SignInSchema } from '../validation/sign-in';

interface UseSignInProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  reset: UseFormReset<SignInSchema>;
  setFocus: UseFormSetFocus<SignInSchema>;
}

export const useSignIn = ({ setIsLoading, reset, setFocus }: UseSignInProps) => {
  const { t } = useTranslation();
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const handleFailedSignIn = (error: AuthError) => {
    addNotification({
      id: nanoid(5),
      type: 'error',
      message: `${t('auth.api.signinFailed')}: ${error.message}`,
    });
    setFocus('email');
  };

  const handleSignIn = async (credentials: SignInSchema) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(credentials).finally(() => {
      setIsLoading(false);
    });

    if (error) {
      handleFailedSignIn(error);
      return;
    }

    reset();

    if (credentials.email.includes('te')) {
      addNotification({
        id: nanoid(5),
        type: 'success',
        message: t('auth.api.coucou'),
      });
    }

    void navigate('/', { replace: true });
  };

  return { handleSignIn };
};

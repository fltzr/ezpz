import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import type { User } from '@supabase/supabase-js';

import { useSupabase } from '@/hooks/use-supabase';
import { useNotificationStore } from '@/state/notifications';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const supabase = useSupabase();
  const { addNotification } = useNotificationStore();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };

    checkUser().catch((error: Error) => {
      addNotification({
        type: 'error',
        message: `Error verifying user: ${error.message}`,
      });

      setUser(null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, addNotification]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
  );
};

import { useContext } from 'react';

import { SupabaseContext } from '@/components/supabase-context';

export const useSupabase = () => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider.');
  }

  return context;
};

export type UseSupabase = ReturnType<typeof useSupabase>;

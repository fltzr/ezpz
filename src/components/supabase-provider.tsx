import { PropsWithChildren } from 'react';

import { supabase } from '@/utils/supabase';

import { SupabaseContext } from './supabase-context';

const SupabaseProvider = ({ children }: PropsWithChildren) => (
  <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
);

export default SupabaseProvider;

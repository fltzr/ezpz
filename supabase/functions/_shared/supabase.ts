import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import type { Database } from '../../../supabase.d.ts';

export const getSupabaseClient = (token: string) => {
  return createClient<Database>(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: { Authorization: token },
      },
    }
  );
};

export const authenticateUser = async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    console.error(error);
    throw new Error('Authentication failed');
  }

  return user;
};

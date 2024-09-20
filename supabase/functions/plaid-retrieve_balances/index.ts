import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { browserEndpoint } from '../_shared/cors.ts';
import { withErrorHandling } from '../_shared/with-error-handling.ts';
import { authenticateUser, getSupabaseClient } from '../_shared/supabase.ts';
import { initializePlaid } from '../_shared/plaid.ts';

const retrieveBalances = async (accessToken: string) => {
  const plaid = initializePlaid();
  const response = await plaid.accountsBalanceGet({ access_token: accessToken });

  if (!response.data)
    throw new Error(`Error retrieving balances: ${response.statusText}`);

  return response.data;
};

Deno.serve(
  browserEndpoint(
    { allowMethods: 'OPTIONS, GET' },
    withErrorHandling(async (request) => {
      const token = request.headers.get('Authorization')!;
      const supabase = getSupabaseClient(token);
      const user = await authenticateUser(supabase);

      const { data, error } = await supabase
        .from('plaid_link')
        .select('access_token')
        .eq('user_id', user.id)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: `Error retrieving access token: ${error.message}` }),
          { status: 500 }
        );
      }

      const plaidResponse = await retrieveBalances(data.access_token);

      console.log(`Successfully retrieved balances for ${user.id}`);

      return new Response(JSON.stringify(plaidResponse.accounts));
    })
  )
);

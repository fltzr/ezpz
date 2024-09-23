import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { browserEndpoint } from '../_shared/cors.ts';
import { withErrorHandling } from '../_shared/with-error-handling.ts';
import { authenticateUser, getSupabaseClient } from '../_shared/supabase.ts';
import { initializePlaid } from '../_shared/plaid.ts';
import { AccountBase, AccountsGetResponse } from 'npm:plaid@27.0.0';

const fetchBalancesFromPlaid = async (accessToken: string) => {
  const plaid = initializePlaid();
  const response = await plaid.accountsBalanceGet({ access_token: accessToken });

  if (!response.data)
    throw new Error(`Error retrieving balances: ${response.statusText}`);

  return response.data as AccountsGetResponse;
};

const cacheAccounts = async (
  supabase: ReturnType<typeof getSupabaseClient>,
  userId: string,
  accounts: AccountBase[]
) => {
  const { error } = await supabase
    .schema('plaid')
    .from('plaid_balances')
    .upsert(
      { user_id: userId, accounts: JSON.stringify(accounts) },
      { onConflict: 'user_id' }
    );

  if (error) throw new Error(`Error caching accounts: ${error.message}`);

  return true;
};

const getCachedAccounts = async (
  supabase: ReturnType<typeof getSupabaseClient>,
  userId: string
) => {
  const { data, error } = await supabase
    .schema('plaid')
    .from('plaid_balances')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error(`Error fetching cached accounts: ${error.message}`);

  const accounts = JSON.parse(data[0].accounts as string) as AccountBase[];
  const parsedData = { accounts, updated_at: data[0].updated_at };

  return parsedData;
};

Deno.serve(
  browserEndpoint(
    { allowMethods: 'OPTIONS, POST' },
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

      const body = await request.json();
      const { refresh }: { refresh?: string } = body;

      /**
       * If a user requests to fetch the most recent balances, we:
       *   1. Fetch the most up to date balances from Plaid,
       *   2. Cache the account balances to plaid_balances table,
       *   3. Return response from Plaid
       */
      if (refresh) {
        const plaidResponse = await fetchBalancesFromPlaid(data.access_token);
        await cacheAccounts(supabase, user.id, plaidResponse.accounts);

        console.log(`Successfully refreshed balances for ${user.id}`);
        JSON.stringify({ accounts: plaidResponse.accounts, updated_at: Date() });
      }

      /**
       * If the `refresh` flag is not set, we do the following:
       *   1. Check if the user has cached account balances,
       *   2a. If so, return those values
       *   2b. Otherwise, run the same flow as refresh.
       */
      const cachedAccounts = await getCachedAccounts(supabase, user.id);

      if (cachedAccounts) {
        return new Response(JSON.stringify(cacheAccounts));
      }

      const plaidResponse = await fetchBalancesFromPlaid(data.access_token);
      await cacheAccounts(supabase, user.id, plaidResponse.accounts);

      return new Response(
        JSON.stringify({ accounts: plaidResponse.accounts, updated_at: Date() })
      );
    })
  )
);

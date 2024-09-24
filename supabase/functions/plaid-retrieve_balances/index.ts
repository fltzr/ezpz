import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { AccountBase, AccountsGetResponse } from 'npm:plaid@27.0.0';

import { browserEndpoint } from '../_shared/cors.ts';
import { withErrorHandling } from '../_shared/with-error-handling.ts';
import { authenticateUser, getSupabaseClient } from '../_shared/supabase.ts';
import { initializePlaid } from '../_shared/plaid.ts';

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
  console.log(`Caching account balances for ${userId}`);

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
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Error fetching cached accounts: ${error.message}`);

  if (!data) {
    return null;
  }

  return { accounts: JSON.parse(data?.accounts as string), updated_at: data?.updated_at };
};

Deno.serve(
  browserEndpoint(
    { allowMethods: 'OPTIONS, POST' },
    withErrorHandling(async (request) => {
      const contentLength = request.headers.get('Content-Length');
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

      let body = { refresh: false };

      if (contentLength && parseInt(contentLength) > 0) {
        body = await request.json();
      }

      const { refresh }: { refresh?: boolean } = body;

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
      console.log(`Fetching cached accounts from db for ${user.id}...`);
      const cachedAccounts = await getCachedAccounts(supabase, user.id);

      if (cachedAccounts?.accounts) {
        console.log(`Cached accounts found for ${user.id}...`);
        console.log(`Cached accounts: ${JSON.stringify(cachedAccounts, null, 2)}`);
        return new Response(JSON.stringify(cachedAccounts));
      }

      console.log(
        `No cached records found. Fetching a new batch from plaid for ${user.id}...`
      );

      const plaidResponse = await fetchBalancesFromPlaid(data.access_token);
      await cacheAccounts(supabase, user.id, plaidResponse.accounts);

      if (plaidResponse) {
        console.log(
          `Balances fetched from plaid: ${JSON.stringify(plaidResponse, null, 2)}`
        );
        return new Response(
          JSON.stringify({ accounts: plaidResponse.accounts, updated_at: Date() })
        );
      }

      return new Response(JSON.stringify({ error: 'Error fetching balances' }), {
        status: 400,
      });
    })
  )
);

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { PlaidApi } from 'npm:plaid@27.0.0';

import { browserEndpoint } from '../_shared/cors.ts';
import { withErrorHandling } from '../_shared/with-error-handling.ts';
import { authenticateUser, getSupabaseClient } from '../_shared/supabase.ts';
import { initializePlaid } from '../_shared/plaid.ts';

const exchangePublicToken = async (plaid: PlaidApi, publicToken: string) => {
  const response = await plaid.itemPublicTokenExchange({ public_token: publicToken });

  if (!response.data)
    throw new Error(`Error exchanging public token: ${response.statusText}`);

  return response.data;
};

Deno.serve(
  browserEndpoint(
    { allowMethods: 'OPTIONS, POST' },
    withErrorHandling(async (request) => {
      const { public_token: publicToken } = await request.json();
      if (!publicToken)
        return new Response(
          JSON.stringify({ error: 'Missing public_token in request body.' }),
          { status: 400 }
        );

      const token = request.headers.get('Authorization')!;
      const supabase = getSupabaseClient(token);
      const user = await authenticateUser(supabase);
      const plaid = initializePlaid();

      const plaidResponse = await exchangePublicToken(plaid, publicToken);

      const { error } = await supabase.from('plaid_link').insert({
        user_id: user.id,
        access_token: plaidResponse.access_token,
        item_id: plaidResponse.item_id,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: `Error saving access token: ${error.message}` }),
          { status: 500 }
        );
      }

      console.log(`Successfully exchanged and saved access token for ${user.id}`);

      return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
    })
  )
);

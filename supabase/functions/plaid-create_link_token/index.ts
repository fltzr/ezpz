import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import {
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  Products,
} from 'npm:plaid@27.0.0';

import { browserEndpoint } from '../_shared/cors.ts';
import { withErrorHandling } from '../_shared/with-error-handling.ts';
import { authenticateUser, getSupabaseClient } from '../_shared/supabase.ts';
import { initializePlaid } from '../_shared/plaid.ts';

const createLinkToken = async (plaid: PlaidApi, userId: string) => {
  const config: LinkTokenCreateRequest = {
    user: {
      client_user_id: userId,
    },
    client_name: 'Ezpz',
    products: [Products.Auth, Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
    redirect_uri:
      Deno.env.get('PLAID_REDIRECT_URI') || 'https://budget.eztrackapp.com/redirect',
  };

  const { data } = await plaid.linkTokenCreate(config);

  return data;
};

Deno.serve(
  browserEndpoint(
    { allowMethods: 'OPTIONS, POST' },
    withErrorHandling(async (request) => {
      const token = request.headers.get('Authorization')!;
      const supabase = getSupabaseClient(token);
      const user = await authenticateUser(supabase);
      const plaid = initializePlaid();

      const plaidResponse = await createLinkToken(plaid, user!.id);

      return new Response(JSON.stringify({ link_token: plaidResponse.link_token }));
    })
  )
);

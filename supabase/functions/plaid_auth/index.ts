// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  Products,
} from 'npm:plaid@27.0.0';
import { getPlaidConfig } from '../_shared/plaid.ts';
import { browserEndpoint } from '../_shared/cors.ts';

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
  browserEndpoint({ allowMethods: 'OPTIONS, POST' }, async (request) => {
    const { headers } = request;
    const token = headers.get('Authorization')!;

    if (!token) {
      return new Response('Unauthorized', {
        status: 400,
      });
    }

    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        {
          global: {
            headers: { Authorization: token },
          },
        }
      );

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user || authError) {
        console.error(authError);
        return new Response(JSON.stringify({ error: 'Authentication failed.' }), {
          status: 400,
        });
      }

      const PLAID_ENV = 'production';
      const plaidConfig = getPlaidConfig(PLAID_ENV);
      const plaid = new PlaidApi(plaidConfig);

      const response = await createLinkToken(plaid, user!.id);

      console.log(JSON.stringify(response, null, 2));

      return new Response(response.link_token);
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }
  })
);

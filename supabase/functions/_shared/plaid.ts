import { Configuration, PlaidEnvironments } from 'npm:plaid@27.0.0';

export const getPlaidConfig = (plaidEnv: 'sandbox' | 'production') => {
  return new Configuration({
    basePath: PlaidEnvironments[plaidEnv],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': Deno.env.get('PLAID_CLIENT_ID')!,
        'PLAID-SECRET': Deno.env.get('PLAID_SECRET')!,
      },
    },
  });
};

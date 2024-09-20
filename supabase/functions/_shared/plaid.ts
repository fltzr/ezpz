import { Configuration, PlaidApi, PlaidEnvironments } from 'npm:plaid@27.0.0';

export const initializePlaid = () => {
  const config = new Configuration({
    basePath: PlaidEnvironments['production'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': Deno.env.get('PLAID_CLIENT_ID')!,
        'PLAID-SECRET': Deno.env.get('PLAID_SECRET')!,
      },
    },
  });

  return new PlaidApi(config);
};

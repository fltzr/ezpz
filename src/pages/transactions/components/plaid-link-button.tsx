import { useQuery } from '@tanstack/react-query';
import { Button, Alert } from '@cloudscape-design/components';
import { PlaidLinkOnEvent, PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';

import { useSupabase } from '../../../common/hooks/use-supabase';
import { useAuth } from '../../../auth/hooks/use-auth';
import { fetchLinkToken } from '../api';

export const PlaidLinkButton = () => {
  const supabase = useSupabase();
  const { user } = useAuth();

  const { data, error: linkTokenError } = useQuery({
    queryKey: ['link-token', user?.id],
    queryFn: () => fetchLinkToken(supabase),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const onPlaidLinkSuccess: PlaidLinkOnSuccess = (publicToken, meta) => {
    console.log('########################');
    console.log(`PUBLIC_TOKEN: ${publicToken}`);
    console.log(`Meta: ${JSON.stringify(meta)}`);
  };

  const onPlaidLinkEvent: PlaidLinkOnEvent = (eventName, meta) => {
    console.log('########################');
    console.log(`ON_EVENT: ${eventName}`);
    console.log(`Meta: ${JSON.stringify(meta)}`);
  };

  const {
    open,
    ready,
    error: plaidError,
  } = usePlaidLink({
    token: data?.link_token ?? '',
    onSuccess: onPlaidLinkSuccess,
    onEvent: onPlaidLinkEvent,
  });

  if (linkTokenError) {
    console.error('Error fetching link token:', linkTokenError);
    return (
      <Alert statusIconAriaLabel='Error' type='error'>
        Error: {linkTokenError.message}
      </Alert>
    );
  }

  if (plaidError) {
    console.error('Plaid Link Error:', plaidError);
    return (
      <Alert statusIconAriaLabel='Error' type='error'>
        Error: {plaidError.message}
      </Alert>
    );
  }

  return (
    <Button
      onClick={() => {
        // eslint-disable-next-line
        open();
      }}
      disabled={!ready}
      loading={!ready}>
      Connect with Plaid
    </Button>
  );
};

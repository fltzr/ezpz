import React from 'react';
import { PlaidLinkOnEvent, PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';
import { useSupabase } from '../../../common/hooks/use-supabase';
import { useAuth } from '../../../auth/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Button, Spinner, Alert } from '@cloudscape-design/components';

const fetchLinkToken = async (supabase) => {
  const { data, error } = await supabase.functions.invoke('plaid_auth', {
    method: 'POST',
  });

  if (error) {
    console.error('Error retrieving link token:', error);
    throw new Error('Error retrieving link token. Please try again later.');
  }

  console.log(data);

  return data;
};

const PlaidLinkButtonInner = ({ linkToken }) => {
  const onPlaidLinkSuccess: PlaidLinkOnSuccess = (publicToken, meta) => {
    console.log('########################');
    console.log(`PUBLIC_TOKEN: ${publicToken}`);
    console.log(`Meta: ${JSON.stringify(meta)}`);
    // TODO: Send the publicToken to your backend server
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
    token: linkToken,
    onSuccess: onPlaidLinkSuccess,
    onEvent: onPlaidLinkEvent,
  });

  if (plaidError) {
    console.error('Plaid Link Error:', plaidError);
    return (
      <Alert statusIconAriaLabel='Error' type='error'>
        Error: {plaidError.message}
      </Alert>
    );
  }

  return (
    <Button onClick={() => open()} disabled={!ready} loading={!ready}>
      Connect with Plaid
    </Button>
  );
};

export const PlaidLinkButton = () => {
  const supabase = useSupabase();
  const { user } = useAuth();

  const { data: linkToken, error } = useQuery({
    queryKey: ['link-token', user?.id],
    queryFn: () => fetchLinkToken(supabase),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    console.error('Error fetching link token:', error);
    return (
      <Alert statusIconAriaLabel='Error' type='error'>
        Error: {error.message}
      </Alert>
    );
  }

  return <PlaidLinkButtonInner linkToken={linkToken} />;
};

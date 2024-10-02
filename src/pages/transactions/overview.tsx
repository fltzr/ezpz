import { Header, SpaceBetween } from '@cloudscape-design/components';

import { PlaidLinkButton } from './components/plaid-link-button';
import { PlaidBalances } from './components/plaid-balances';
import { PlaidTransactions } from './components/plaid-transactions';

const TransactionsOverview = () => {
  return (
    <SpaceBetween direction='vertical' size='xl'>
      <Header variant='awsui-h1-sticky' actions={<PlaidLinkButton />}>
        Account overview
      </Header>

      <PlaidBalances />
      <PlaidTransactions />
    </SpaceBetween>
  );
};

export default TransactionsOverview;

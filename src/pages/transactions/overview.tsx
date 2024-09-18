import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import { PlaidLinkButton } from './components/plaid-link-button';

const TransactionsOverview = () => {
  return (
    <SpaceBetween direction='horizontal' size='xl'>
      <Container header={<Header variant='h1'>Plaid</Header>}>
        <PlaidLinkButton />
      </Container>
    </SpaceBetween>
  );
};

export default TransactionsOverview;

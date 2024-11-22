import { useEffectOnce } from 'react-use';

import { Box, SpaceBetween } from '@cloudscape-design/components';

import { useLayoutState } from '@/state/layout';

import { Summary } from './components/summary';
import { TransactionsTable } from './components/table';

const TransactionsTablePage = () => {
  const { setContentType } = useLayoutState();

  useEffectOnce(() => {
    setContentType('default');

    return () => {
      setContentType('default');
    };
  });

  return (
    <Box padding={{ vertical: 'l' }}>
      <SpaceBetween size='m' direction='vertical'>
        <Summary />
        <TransactionsTable />
      </SpaceBetween>
    </Box>
  );
};

export default TransactionsTablePage;

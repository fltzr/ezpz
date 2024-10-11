import { useEffectOnce } from 'react-use';

import { Box } from '@cloudscape-design/components';

import { useLayoutState } from '@/state/layout';

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
      <TransactionsTable />
    </Box>
  );
};

export default TransactionsTablePage;

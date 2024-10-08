import { useEffectOnce } from 'react-use';

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

  return <TransactionsTable />;
};

export default TransactionsTablePage;

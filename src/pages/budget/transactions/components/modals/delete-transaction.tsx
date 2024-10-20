import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Header,
  Modal,
  SpaceBetween,
  Table,
} from '@cloudscape-design/components';

import { formatCurrency } from '@/utils/format-currency';

import { Transaction } from '../../types/api';

type DeleteTransactionModalProps = {
  visible: boolean;
  transactions: Transaction[];
  onConfirmDelete: () => void;
  onDismiss: () => void;
};

export const DeleteTransactionModal = ({
  visible,
  transactions,
  onConfirmDelete,
  onDismiss,
}: DeleteTransactionModalProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budgetTransactions' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (transactions.length !== count) {
      setCount(transactions.length);
    }
  }, [count, transactions]);

  return (
    <Modal
      size='large'
      visible={visible}
      onDismiss={onDismiss}
      header={<Header variant='h2'>{t('deleteModal.title')}</Header>}
      footer={
        <Box float='right'>
          <SpaceBetween size='xs' direction='horizontal'>
            <Button variant='normal' onClick={onDismiss}>
              {t('deleteModal.cancel')}
            </Button>
            <Button variant='primary' onClick={onConfirmDelete}>
              {t('deleteModal.delete', { count })}
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween size='m'>
        <Box>
          {t('deleteModal.confirmation', { count })}{' '}
          <Box variant='strong'>{t('deleteModal.warning')}</Box>
        </Box>
        <Table
          variant='container'
          items={transactions}
          columnDefinitions={[
            {
              id: 'id',
              header: t('common.columns.id'),
              cell: (item) => item.id,
            },
            {
              id: 'date',
              header: t('common.columns.date'),
              cell: (item) => item.transaction_date,
            },
            {
              id: 'category',
              header: t('common.columns.category'),
              cell: (item) => item.category?.category_name,
            },
            {
              id: 'outflow',
              header: t('common.columns.outflow'),
              cell: (item) => formatCurrency(item.outflow),
            },
          ]}
        />
      </SpaceBetween>
    </Modal>
  );
};

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
  return (
    <Modal
      size='large'
      visible={visible}
      onDismiss={onDismiss}
      header={<Header variant='h2'>Delete transactions</Header>}
      footer={
        <Box float='right'>
          <SpaceBetween size='xs' direction='horizontal'>
            <Button variant='normal' onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant='primary' onClick={onConfirmDelete}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween size='m'>
        <Box>
          Are you sure you want to delete these transactions?
          <Box variant='strong'> This action cannot be reversed.</Box>
        </Box>
        <Table
          variant='container'
          items={transactions}
          columnDefinitions={[
            {
              id: 'id',
              header: 'ID',
              cell: (item) => item.id,
            },
            {
              id: 'date',
              header: 'Date',
              cell: (item) => item.transaction_date,
            },
            {
              id: 'category',
              header: 'Category',
              cell: (item) => item.category?.category_name,
            },
            {
              id: 'outflow',
              header: 'Outflow',
              cell: (item) => formatCurrency(item.outflow),
            },
          ]}
        />
      </SpaceBetween>
    </Modal>
  );
};

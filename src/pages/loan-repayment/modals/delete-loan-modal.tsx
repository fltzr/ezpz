import {
  Alert,
  Box,
  Button,
  Header,
  Modal,
  SpaceBetween,
  Table,
} from '@cloudscape-design/components';
import { LoanInputSchema } from '../schema';

type DeleteLoanModalProps = {
  visible: boolean;
  loanDetails?: LoanInputSchema;
  onSubmitDelete: (loanId: string) => void;
  onDismiss: () => void;
};

export const DeleteLoanModal = ({
  visible,
  loanDetails,
  onSubmitDelete,
  onDismiss,
}: DeleteLoanModalProps) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      size='large'
      header={
        <Header variant='h2'>
          Delete{' '}
          <Box display='inline-block' fontSize='heading-m' color='text-status-info'>
            {loanDetails?.loanName}
          </Box>{' '}
          ?
        </Header>
      }
      footer={
        <Box float='right'>
          <SpaceBetween size='xs' direction='horizontal'>
            <Button variant='link' onClick={onDismiss}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => onSubmitDelete(loanDetails?.id ?? '')}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween direction='vertical' size='l'>
        <Alert type='warning'>Deleting this loan is irreversible!</Alert>

        <Table
          variant='container'
          items={[loanDetails]}
          columnDefinitions={[
            {
              id: 'id',
              header: 'ID',
              cell: (item) => item?.id,
            },
            {
              id: 'loan_name',
              header: 'Loan name',
              cell: (item) => item?.loanName,
            },
          ]}
        />
      </SpaceBetween>
    </Modal>
  );
};

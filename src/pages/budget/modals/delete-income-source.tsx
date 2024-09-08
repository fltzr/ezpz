import { IncomeSource } from '../utils/types';
import {
  Box,
  Button,
  Header,
  Modal,
  SpaceBetween,
  StatusIndicator,
  Table,
} from '@cloudscape-design/components';

type DeleteIncomeSourceModalProps = {
  visible: boolean;
  items: IncomeSource[];
  onDelete: (incomeSources: IncomeSource[]) => void;
  onClose: () => void;
};

export const DeleteIncomeSourceModal = ({
  visible,
  items,
  onDelete,
  onClose,
}: DeleteIncomeSourceModalProps) => {
  const isMultiple = items.length > 1;

  const handleOnClose = () => {
    onClose();
  };

  const handleOnConfirm = () => {
    onDelete(items);
    handleOnClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleOnClose}
      header={<Header variant='h1'>Delete income source{isMultiple ? 's' : ''}?</Header>}
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleOnClose}>
              Cancel
            </Button>
            <Button variant='primary' onClick={handleOnConfirm}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Box variant='span'>Permanently delete </Box>
      <Box variant='awsui-gen-ai-label' fontSize='heading-xs' display='inline'>
        {items.length} income sources
      </Box>
      ?{' '}
      <Box display='inline' fontWeight='bold'>
        You can&apos;t undo this action.
      </Box>
      <br />
      <br />
      <Table
        variant='borderless'
        header={
          <StatusIndicator type='info'>
            The following income sources will be deleted
          </StatusIndicator>
        }
        items={items}
        columnDefinitions={[
          {
            id: 'id',
            header: 'ID',
            cell: (item) => item.id,
          },
          {
            id: 'name',
            header: 'Name',
            cell: (item) => item.income_source_name,
          },
        ]}
      />
    </Modal>
  );
};

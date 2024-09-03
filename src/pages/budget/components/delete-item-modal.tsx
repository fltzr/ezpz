import { Alert, Box, Button, Modal, SpaceBetween } from '@cloudscape-design/components';
import { type BudgetTableItem, getItemName, isCategoryItem } from '../utils/types';

type DeleteItemModalProps = {
  visible: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  item?: BudgetTableItem;
};

export const DeleteItemModal = ({
  visible,
  onClose,
  onDelete,
  item,
}: DeleteItemModalProps) => (
  <Modal
    visible={visible}
    onDismiss={onClose}
    header={`Delete ${getItemName(item)}?`}
    footer={
      <Box float='right'>
        <SpaceBetween size='m' direction='horizontal'>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='primary' onClick={() => item && onDelete(item.id)}>
            Delete
          </Button>
        </SpaceBetween>
      </Box>
    }>
    <Box variant='span'>Permanently delete </Box>
    <Box variant='awsui-gen-ai-label' fontSize='heading-xs' display='inline'>
      {getItemName(item)}
    </Box>
    ?{' '}
    <Box display='inline' fontWeight='bold'>
      You can't undo this action.
    </Box>
    <br />
    <br />
    {isCategoryItem(item) && (
      <Alert type='warning'>
        Proceeding to delete this category will delete all associated budget items.
      </Alert>
    )}
  </Modal>
);

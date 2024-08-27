import { Box, Button, Modal, SpaceBetween } from '@cloudscape-design/components';
import type { BudgetTableItem } from '../utils/data';

type DeleteCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  category: BudgetTableItem;
};

export const DeleteCategoryModal = ({
  visible,
  onClose,
  onDelete,
  category,
}: DeleteCategoryModalProps) => (
  <Modal
    visible={visible}
    onDismiss={onClose}
    header='Add category'
    footer={
      <Box float='right'>
        <SpaceBetween size='m'>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='primary' onClick={onDelete}>
            Delete
          </Button>
        </SpaceBetween>
      </Box>
    }>
    <Box variant='span'>
      Are you sure you want to delete{' '}
      <Box variant='code' color='text-status-info'>
        {category.name}
      </Box>
      ? <Box fontWeight='bold'>This action can't be undone.</Box>
    </Box>
  </Modal>
);

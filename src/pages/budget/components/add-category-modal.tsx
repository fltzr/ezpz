import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Box, Button, Input, Modal, SpaceBetween } from '@cloudscape-design/components';
import { BudgetTableItem } from '../utils/data';

type AddCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (category: BudgetTableItem) => void;
};

export const AddCategoryModal = ({ visible, onClose, onAdd }: AddCategoryModalProps) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(0);

  const handleAdd = () => {
    onAdd({ id: nanoid(5), name, budget, parentId: null });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      header='Add category'
      footer={
        <Box float='right'>
          <SpaceBetween size='m' direction='horizontal'>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant='primary' onClick={handleAdd}>
              Add
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <SpaceBetween size='l' direction='vertical'>
        <Input
          placeholder='Category name'
          value={name}
          onChange={(e) => setName(e.detail.value)}
        />
        <Input
          placeholder='Budget'
          type='number'
          value={budget.toString()}
          onChange={(e) => setBudget(Number(e.detail.value))}
        />
      </SpaceBetween>
    </Modal>
  );
};

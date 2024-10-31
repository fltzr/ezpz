import { useTranslation } from 'react-i18next';

import { Alert, Box, Button, Modal, SpaceBetween } from '@cloudscape-design/components';

import { BudgetCategory } from '../../../utils/api-types';

type DeleteItemModalProps = {
  visible: boolean;
  item?: BudgetCategory;
  onClose: () => void;
  onDelete: (item: BudgetCategory) => void;
};

export const DeleteItemModal = ({
  visible,
  item,
  onClose,
  onDelete,
}: DeleteItemModalProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.modals' });

  if (!item) {
    return;
  }

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      header={t('deleteBudgetItem.title', { name: item.name })}
      footer={
        <Box float='right'>
          <SpaceBetween size='m' direction='horizontal'>
            <Button onClick={onClose}>{t('common.cancelButton')}</Button>
            <Button variant='primary' onClick={() => item && onDelete(item)}>
              {t('common.deleteButton')}
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Box variant='span'>{t('deleteIncomeSource.deleteContentp1')}</Box>
      <Box variant='awsui-gen-ai-label' fontSize='heading-xs' display='inline'>
        {item.name}
      </Box>
      ?{' '}
      <Box display='inline' fontWeight='bold'>
        {t('deleteIncomeSource.deleteContentp2')}
      </Box>
      <br />
      <br />
      <Alert type='warning'>{t('deleteIncomeSource.deleteContentAlert')}</Alert>
    </Modal>
  );
};

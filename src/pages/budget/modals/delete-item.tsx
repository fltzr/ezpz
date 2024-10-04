import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Modal, SpaceBetween } from '@cloudscape-design/components';

import { type BudgetTableItem, getItemName, isCategoryItem } from '../utils/api-types';

type DeleteItemModalProps = {
  visible: boolean;
  item?: BudgetTableItem;
  onClose: () => void;
  onDelete: (item: BudgetTableItem) => void;
};

export const DeleteItemModal = ({
  visible,
  onClose,
  onDelete,
  item,
}: DeleteItemModalProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.modals' });

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      header={t('deleteBudgetItem.title', { name: getItemName(item) })}
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
        {getItemName(item)}
      </Box>
      ?{' '}
      <Box display='inline' fontWeight='bold'>
        {t('deleteIncomeSource.deleteContentp2')}
      </Box>
      <br />
      <br />
      {isCategoryItem(item) && (
        <Alert type='warning'>{t('deleteIncomeSource.deleteContentAlert')}</Alert>
      )}
    </Modal>
  );
};

import { useTranslation } from 'react-i18next';
import { IncomeSource } from '../utils/types';
import {
  Alert,
  Box,
  Button,
  Header,
  Modal,
  SpaceBetween,
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
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.modals' });
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
      header={
        <Header variant='h1'>
          {t('deleteIncomeSource.title', { s: isMultiple ? 's' : '' })}
        </Header>
      }
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleOnClose}>
              {t('common.cancelButton')}
            </Button>
            <Button variant='primary' onClick={handleOnConfirm}>
              {t('common.deleteButton')}
            </Button>
          </SpaceBetween>
        </Box>
      }>
      <Box variant='span'>{t('deleteIncomeSource.deleteContentp1')}</Box>
      <Box variant='awsui-gen-ai-label' fontSize='heading-xs' display='inline'>
        {t('deleteIncomeSource.deleteContentp2', { count: items.length })}
      </Box>{' '}
      <Box display='inline' fontWeight='bold'>
        {t('deleteIncomeSource.deleteContentp3')}
      </Box>
      <br />
      <br />
      <Table
        variant='borderless'
        header={
          <Alert type='warning'>{t('deleteIncomeSource.deleteContentAlert')}</Alert>
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

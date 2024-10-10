/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ButtonGroup,
  Header,
  Input,
  StatusIndicator,
  Table,
} from '@cloudscape-design/components';

import { useDrawer } from '@/components/drawer-provider';
import { useSelectedUser } from '@/hooks/use-selected-user';
import i18n from '@/i18n';
import { useNotificationStore } from '@/state/notifications';
import { formatCurrency } from '@/utils/format-currency';

import { useIncomeApi } from '../../hooks/use-income-api';
import { IncomeSource } from '../../utils/api-types';
import { WidgetConfig } from '../../utils/widget-types';
import { AddIncomeSource } from '../drawer/add-income-source';
import { DeleteIncomeSourceModal } from '../modals/delete-income-source';

const IncomeSources = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget.incomeSources' });
  const { selectedUser } = useSelectedUser();
  const { openDrawer, closeDrawer } = useDrawer();
  const { addNotification } = useNotificationStore();

  const [selectedItems, setSelectedItems] = useState<IncomeSource[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const {
    data: incomeSources,
    isFetching: loadingIncomeSources,
    refetch,
    handleAddIncomeSource,
    handleUpdateIncomeSource,
    handleDeleteIncomeSource,
  } = useIncomeApi();

  return (
    <>
      <Header
        variant='h2'
        actions={
          <ButtonGroup
            variant='icon'
            items={[
              {
                id: 'refresh',
                type: 'icon-button',
                text: t('dropdown.refresh'),
                iconName: 'refresh',
              },
              {
                id: 'delete',
                type: 'icon-button',
                text: `Delete ${
                  selectedItems.length !== 0 ? `(${selectedItems.length})` : ''
                }`,
                iconName: 'delete-marker',
                disabled: selectedItems.length === 0,
                popoverFeedback:
                  selectedItems.length > 1
                    ? t('validation.disabledMultipleSelected')
                    : t('validation.disabledNoneSelected'),
              },
              {
                id: 'add',
                text: t('dropdown.add'),
                type: 'icon-button',
                iconName: 'add-plus',
              },
            ]}
            onItemClick={(event) => {
              switch (event.detail.id) {
                case 'add':
                  openDrawer({
                    drawerName: 'add-income-source',
                    width: 350,
                    content: (
                      <AddIncomeSource
                        selectedUserId={selectedUser!.userId}
                        onAdd={handleAddIncomeSource}
                        onClose={closeDrawer}
                      />
                    ),
                  });
                  break;
                case 'delete':
                  setIsDeleteModalVisible(true);
                  break;
                case 'refresh':
                  refetch().catch((error: Error) => {
                    addNotification({
                      type: 'error',
                      message: t('dropdown.errorRefetching', {
                        error: error.message,
                      }),
                    });
                  });
                  break;
                default:
                  break;
              }
            }}
          />
        }></Header>
      <Table
        variant='borderless'
        selectionType='multi'
        loading={loadingIncomeSources}
        items={incomeSources ?? []}
        columnDefinitions={[
          {
            id: 'name',
            header: t('table.columns.source'),
            cell: (item) => item.income_source_name,
            editConfig: {
              editingCell: (
                item,
                ctx: {
                  currentValue: string | null;
                  setValue: (value: string) => void;
                }
              ) => (
                <Input
                  placeholder={item.income_source_name ?? t('table.incomeSourceExample')}
                  value={ctx.currentValue ?? item.income_source_name}
                  onChange={(event) => ctx.setValue(event.detail.value)}
                />
              ),
              validation: (item, value) => {
                if (typeof value !== 'string' || value?.length < 1) {
                  return t('validation.nameError');
                }

                if (item.income_source_name === value) {
                  return t('validation.noChangesError');
                }

                return undefined;
              },
            },
          },
          {
            id: 'projected_amount',
            header: t('table.columns.projectedAmount'),
            cell: (item) => formatCurrency(item.projected_amount),
            editConfig: {
              editingCell: (item, ctx) => (
                <Input
                  type='number'
                  inputMode='decimal'
                  placeholder={String(item.projected_amount)}
                  value={String(ctx.currentValue ?? item.projected_amount)}
                  onChange={(event) => ctx.setValue(Number(event.detail.value))}
                />
              ),
              validation: (_, value: string) => {
                if (!value) return undefined;

                const isValidNumber = isFinite(Number(value));

                if (!isValidNumber) {
                  return t('validation.typeError');
                }

                if (Number(value) < 0) {
                  return t('validation.negativeValueError');
                }

                return undefined;
              },
            },
          },
        ]}
        selectedItems={selectedItems}
        onSelectionChange={(event) => setSelectedItems(event.detail.selectedItems)}
        submitEdit={(item, column, newValue) => {
          type UpdateFields = Pick<
            IncomeSource,
            'income_source_name' | 'projected_amount'
          >;
          const updateField: Record<string, keyof UpdateFields> = {
            name: 'income_source_name',
            projected_amount: 'projected_amount',
          };

          handleUpdateIncomeSource({
            id: item.id,
            [updateField[column.id as string]]: newValue,
          });
        }}
        empty={<StatusIndicator type='info'>{t('table.empty')}</StatusIndicator>}
      />
      <DeleteIncomeSourceModal
        visible={isDeleteModalVisible}
        items={selectedItems}
        onDelete={handleDeleteIncomeSource}
        onClose={() => {
          setIsDeleteModalVisible(false);
        }}
      />
    </>
  );
};

export const incomeSourcesWidget: WidgetConfig = {
  columnOffset: { 4: 0 },
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    title: i18n.t('budget.incomeSources.title'),
    description: 'Income sources description',
    content: <IncomeSources />,
  },
};

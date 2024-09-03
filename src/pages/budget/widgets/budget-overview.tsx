import { useState } from 'react';
import {
  Container,
  Header,
  KeyValuePairs,
  SpaceBetween,
  StatusIndicator,
  Table,
  ExpandableSection,
  ButtonDropdown,
  Input,
} from '@cloudscape-design/components';

import { formatCurrency } from '../../../common/utils/format-currency';
import { useBudgetApi } from '../hooks/use-budget-api';
import { IncomeSource, isBudgetItem } from '../utils/types';
import { useIncomeApi } from '../hooks/use-income-api';
import { useModals } from '../hooks/use-modals';
import { AddIncomeSourceModal } from '../modals/add-income-source';
import { DeleteIncomeSourceModal } from '../modals/delete-income-source';

const getBudgetStatus = (amountSpent: number, budgetAmount?: number) => {
  if (!budgetAmount) {
    return <StatusIndicator type='warning'>No income set!</StatusIndicator>;
  }

  const difference = amountSpent - budgetAmount;
  const differenceFormatted = formatCurrency(Math.abs(difference));

  if (difference < 0)
    return (
      <StatusIndicator type='success'>{differenceFormatted} under budget</StatusIndicator>
    );
  if (difference > 0)
    return (
      <StatusIndicator type='error'>{differenceFormatted} over budget</StatusIndicator>
    );
  return <StatusIndicator type='info'>On budget</StatusIndicator>;
};

export const BudgetOverview = () => {
  const [selectedItems, setSelectedItems] = useState<IncomeSource[]>([]);
  const { modalState, openModal, closeModal } = useModals();
  const { data } = useBudgetApi();
  const {
    data: incomeSources,
    isLoading: loadingIncomeSources,
    refetch,
    handleAddIncomeSource,
    handleUpdateIncomeSource,
    handleDeleteIncomeSource,
  } = useIncomeApi();

  const amountToBudget = incomeSources?.reduce(
    (acc, curr) => (acc = acc + curr.projected_amount),
    0
  );
  const amountSpent =
    data?.reduce(
      (acc, curr) => (isBudgetItem(curr) ? acc + curr.projected_amount : acc),
      0
    ) ?? 0;

  return (
    <>
      <Container fitHeight header={<Header variant='h2'>Overview</Header>}>
        <SpaceBetween size='l'>
          <KeyValuePairs
            columns={3}
            items={[
              {
                label: 'Amount to budget',
                value: formatCurrency(amountToBudget),
              },
              { label: 'Amount spent', value: formatCurrency(amountSpent) },
              {
                label: 'Amount left',
                value: getBudgetStatus(amountSpent, amountToBudget),
              },
            ]}
          />
          <ExpandableSection
            defaultExpanded
            disableContentPaddings
            headerText='Income sources'
            headerActions={
              <ButtonDropdown
                variant='normal'
                items={[
                  { id: 'add', text: 'Add income source', iconName: 'add-plus' },
                  {
                    id: 'update',
                    text: 'Update',
                    iconName: 'edit',
                    disabled: selectedItems.length === 0 || selectedItems.length > 1,
                    disabledReason:
                      selectedItems.length > 1
                        ? 'Multiple income sources are selected.'
                        : 'No income sources are selected.',
                  },
                  {
                    id: 'delete',
                    text: `Delete ${
                      selectedItems.length !== 0 ? `(${selectedItems.length})` : ''
                    }`,
                    iconName: 'delete-marker',
                    disabled: selectedItems.length === 0,
                    disabledReason:
                      selectedItems.length > 1
                        ? 'Multiple income sources are selected.'
                        : 'No income sources are selected.',
                  },
                  {
                    id: 'refresh',
                    text: 'Refresh',
                    iconName: 'refresh',
                  },
                ]}
                onItemClick={(event) => {
                  switch (event.detail.id) {
                    case 'add':
                      openModal('addIncomeSource');
                      break;
                    case 'delete':
                      openModal('deleteIncomeSource');
                      break;
                    case 'refresh':
                      refetch();
                      break;
                    default:
                      break;
                  }
                }}>
                Actions
              </ButtonDropdown>
            }>
            <Table
              variant='full-page'
              selectionType='multi'
              loading={loadingIncomeSources}
              items={incomeSources ?? []}
              columnDefinitions={[
                {
                  id: 'name',
                  header: 'Source',
                  cell: (item) => item.income_source_name,
                  editConfig: {
                    editingCell: (item, ctx) => (
                      <Input
                        placeholder={
                          item.income_source_name ?? 'e.g., Paycheck, Babysitting, Stocks'
                        }
                        value={ctx.currentValue ?? item.income_source_name}
                        onChange={(event) => ctx.setValue(event.detail.value)}
                      />
                    ),
                    validation: (item, value) => {
                      if (value?.length < 1) {
                        return 'Invalid income source name!';
                      }

                      if (item.income_source_name === value) {
                        return 'Name must be different to update!';
                      }

                      return undefined;
                    },
                  },
                },
                {
                  id: 'projected_amount',
                  header: 'Projected amount',
                  cell: (item) => formatCurrency(item.projected_amount),
                  editConfig: {
                    editingCell: (item, ctx) => (
                      <Input
                        type='number'
                        inputMode='decimal'
                        placeholder={String(item.projected_amount) ?? 'Estimated income'}
                        value={String(ctx.currentValue ?? item.projected_amount)}
                        onChange={(event) => ctx.setValue(Number(event.detail.value))}
                      />
                    ),
                    validation: (_, value: string) => {
                      if (!value) return undefined;

                      const isValidNumber = isFinite(Number(value));

                      if (!isValidNumber) {
                        return 'Invalid type.';
                      }

                      if (Number(value) < 0) {
                        return 'Projected value must be a non-negative value!';
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
              empty={
                incomeSources ? (
                  <StatusIndicator type='info'>No matching items found!</StatusIndicator>
                ) : (
                  getBudgetStatus(0)
                )
              }
            />
          </ExpandableSection>
        </SpaceBetween>
      </Container>
      <AddIncomeSourceModal
        visible={modalState.type === 'addIncomeSource'}
        onClose={closeModal}
        onAdd={handleAddIncomeSource}
      />
      <DeleteIncomeSourceModal
        visible={modalState.type === 'deleteIncomeSource'}
        items={selectedItems}
        onClose={closeModal}
        onDelete={(sources) => {
          handleDeleteIncomeSource(sources);
          setSelectedItems([]);
        }}
      />
    </>
  );
};

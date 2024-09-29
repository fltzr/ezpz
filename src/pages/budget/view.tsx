import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Button,
  Container,
  Grid,
  Header,
  SpaceBetween,
  StatusIndicator,
  Table,
} from '@cloudscape-design/components';

import { useBudgetApi } from './hooks/use-budget-api.ts';
import { createBudgetTableColumnDefinitions } from './utils/table-configs.tsx';
import {
  BudgetItem,
  Category,
  isCategoryItem,
  type BudgetTableItem,
} from './utils/types.ts';

import { BudgetOverview } from './widgets/budget-overview.tsx';
import { useModals } from './hooks/use-modals.ts';
import { AddCategoryModal } from './modals/add-category-modal.tsx';
import { DeleteItemModal } from './modals/delete-item-modal.tsx';
import { AddBudgetItemModal } from './modals/add-budget-item-modal.tsx';
import { BudgetPercentageChart } from './widgets/budget-percentage-chart.tsx';
import { EditBudgetItemModal } from './modals/edit-budget-item-modal.tsx';
import { useIncomeApi } from './hooks/use-income-api.ts';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export const ViewBudgetPage = ({
  userId,
  children,
}: { userId: string } & PropsWithChildren) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'pages.budget' });
  const { data: incomeSources } = useIncomeApi(userId);
  const {
    data,
    isLoading,
    handleAddCategory,
    handleAddBudgetItem,
    handleUpdateBudgetItem,
    handleSubmitInlineEdit,
    handleDeleteItem,
  } = useBudgetApi(userId);

  const { items, collectionProps } = useCollection(data ?? [], {
    selection: {},
    sorting: {},
    expandableRows: {
      getId: (item: BudgetTableItem) => item.id,
      getParentId: (item: BudgetTableItem) =>
        isCategoryItem(item) ? null : String(item.category_id),
    },
  });

  const { modalState, openModal, closeModal } = useModals();

  const amountToBudget = incomeSources?.reduce(
    (acc, curr) => acc + curr.projected_amount,
    0
  );

  return (
    <>
      <SpaceBetween size='m'>
        {children}
        <Grid
          gridDefinition={[
            { colspan: { l: 8, m: 8, default: 12 } },
            { colspan: { l: 4, m: 4, default: 12 } },
            { colspan: { l: 12, m: 12, default: 12 } },
          ]}>
          <BudgetOverview userId={userId} />
          <Container>
            <BudgetPercentageChart
              isLoading={isLoading}
              data={data}
              totalBudget={amountToBudget}
            />
          </Container>
          <Table
            enableKeyboardNavigation
            loading={isLoading}
            variant='container'
            selectionType='single'
            items={items ?? []}
            submitEdit={handleSubmitInlineEdit}
            columnDefinitions={createBudgetTableColumnDefinitions(t, {
              handleAddBudgetLineItem: (item: Category) => {
                openModal('addBudgetItem', { category: item });
              },
              handleEditBudgetItem: (item) => {
                openModal('editBudgetItem', { budgetItem: item });
              },
              handleDeleteItem: (item) => {
                openModal('deleteItem', { item });
              },
            })}
            header={
              <Header
                variant='h1'
                actions={
                  <Button
                    variant='primary'
                    iconName='add-plus'
                    onClick={() => openModal('addCategory')}>
                    {t('addCategory')}
                  </Button>
                }>
                {t('tableTitle')}
              </Header>
            }
            empty={<StatusIndicator type='info'>{t('empty')}</StatusIndicator>}
            {...collectionProps}
          />
        </Grid>
      </SpaceBetween>
      <AddCategoryModal
        visible={modalState.type === 'addCategory'}
        onClose={closeModal}
        onAdd={handleAddCategory}
        userId={userId}
      />
      <AddBudgetItemModal
        visible={modalState.type === 'addBudgetItem'}
        onClose={closeModal}
        onAdd={handleAddBudgetItem}
        category={modalState.props?.category as Category}
        userId={userId}
      />
      <EditBudgetItemModal
        visible={modalState.type === 'editBudgetItem'}
        onClose={closeModal}
        onEdit={handleUpdateBudgetItem}
        item={modalState.props?.budgetItem as BudgetItem}
        userId={userId}
      />
      <DeleteItemModal
        visible={modalState.type === 'deleteItem'}
        onClose={closeModal}
        onDelete={() => {
          if (modalState.props?.item) {
            handleDeleteItem(modalState.props.item);
          }
          closeModal();
        }}
        item={modalState.props?.item}
      />
    </>
  );
};

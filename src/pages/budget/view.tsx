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

import { useBudgetApi } from './hooks/use-budget-api';
import { createBudgetTableColumnDefinitions } from './utils/table-configs';
import {
  BudgetItem,
  Category,
  isCategoryItem,
  type BudgetTableItem,
} from './utils/types';

import { BudgetOverview } from './widgets/budget-overview';
import { useModals } from './hooks/use-modals';
import { AddCategoryModal } from './components/add-category-modal';
import { DeleteItemModal } from './components/delete-item-modal';
import { AddBudgetItemModal } from './components/add-budget-item-modal';
import { BudgetPercentageChart } from './widgets/budget-percentage-chart';
import { EditBudgetItemModal } from './components/edit-budget-item-modal';
import { useIncomeApi } from './hooks/use-income-api';
import { PropsWithChildren } from 'react';

export const ViewBudgetPage = ({
  userId,
  children,
}: { userId: string } & PropsWithChildren) => {
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
            columnDefinitions={createBudgetTableColumnDefinitions({
              handleAddBudgetLineItem: (item: Category) => {
                openModal('addBudgetItem', { category: item });
              },
              handleEditBudgetItem: (item) => {
                openModal('editBudgetItem', { budgetItem: item });
              },
              handleDeleteItem: (item) => {
                console.log(item);
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
                    Add category
                  </Button>
                }>
                Budget
              </Header>
            }
            empty={<StatusIndicator type='info'>No budget items added!</StatusIndicator>}
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
          modalState.props?.item && handleDeleteItem(modalState.props.item);
          closeModal();
        }}
        item={modalState.props?.item}
      />
    </>
  );
};

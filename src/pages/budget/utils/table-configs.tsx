import { TFunction } from 'i18next';
import { ButtonDropdown, type TableProps } from '@cloudscape-design/components';
import { formatCurrency } from '../../../common/utils/format-currency';
import {
  BudgetItem,
  type BudgetTableItem,
  type Category,
  isBudgetItem,
  isCategoryItem,
} from './types';

export const calculateCategoryTotals = (items: ReadonlyArray<BudgetTableItem>) => {
  const categoryTotals = new Map<string, number>();

  items.forEach((item) => {
    if (isBudgetItem(item)) {
      const currentTotal = categoryTotals.get(item.category_id) || 0;
      categoryTotals.set(item.category_id, currentTotal + item.projected_amount);
    }
  });

  return items.map((item) => {
    if (isCategoryItem(item)) {
      return {
        ...item,
        total: categoryTotals.get(item.id) || 0,
      };
    }

    return item;
  });
};

export const createBudgetTableColumnDefinitions = (
  t: TFunction,
  actions: {
    handleAddBudgetLineItem: (item: Category) => void;
    handleEditBudgetItem: (item: BudgetItem) => void;
    handleDeleteItem: (item: BudgetTableItem) => void;
  }
): TableProps.ColumnDefinition<BudgetTableItem>[] => {
  const columns: TableProps.ColumnDefinition<BudgetTableItem>[] = [
    {
      id: 'category',
      header: '',
      cell: (item) => (isCategoryItem(item) ? item.category_name : item.budget_item_name),
      width: 400,
    },
    {
      id: 'projected_amount',
      header: t('columns.projectedAmount'),
      cell: (item) =>
        isCategoryItem(item)
          ? formatCurrency(item.total || 0)
          : formatCurrency(item.projected_amount),
    },
    {
      id: 'actions',
      header: t('columns.actions.columnName'),
      width: 50,
      verticalAlign: 'middle',
      cell: (item) => (
        <ButtonDropdown
          expandToViewport
          variant='inline-icon'
          items={
            isCategoryItem(item)
              ? [
                  {
                    id: 'rename-category',
                    text: t('columns.actions.renameCategory'),
                    iconName: 'edit',
                  },
                  {
                    id: 'delete-category',
                    text: t('columns.actions.deleteCategory'),
                    iconName: 'delete-marker',
                  },
                  {
                    id: 'add-budget-line-item',
                    text: t('columns.actions.addBudgetItem'),
                    iconName: 'add-plus',
                  },
                ]
              : [
                  {
                    id: 'edit-budget-item',
                    text: t('columns.actions.editBudgetItem'),
                    iconName: 'edit',
                  },
                  {
                    id: 'delete-budget-item',
                    text: t('columns.actions.deleteBudgetItem'),
                    iconName: 'delete-marker',
                  },
                ]
          }
          onItemClick={({ detail }) => {
            switch (detail.id) {
              case 'delete-category':
                actions.handleDeleteItem(item);

                break;
              case 'add-budget-line-item':
                if (isCategoryItem(item)) {
                  actions.handleAddBudgetLineItem(item);
                }
                break;
              case 'edit-budget-item':
                if (isBudgetItem(item)) {
                  actions.handleEditBudgetItem(item);
                }
                break;
              case 'delete-budget-item':
                if (isBudgetItem(item)) {
                  actions.handleDeleteItem(item);
                }
                break;
              default:
                break;
            }
          }}
        />
      ),
    },
  ];

  return columns;
};

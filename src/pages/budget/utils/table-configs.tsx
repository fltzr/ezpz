import { ButtonDropdown, type TableProps } from '@cloudscape-design/components';
import {
  BudgetItem,
  type BudgetTableItem,
  type Category,
  isBudgetItem,
  isCategoryItem,
} from './types';
import { formatCurrency } from '../../../common/utils/format-currency';

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

export const createBudgetTableColumnDefinitions = (actions: {
  handleAddBudgetLineItem: (item: Category) => void;
  handleEditBudgetItem: (item: BudgetItem) => void;
  handleDeleteItem: (item: BudgetTableItem) => void;
}): TableProps.ColumnDefinition<BudgetTableItem>[] => {
  const columns: TableProps.ColumnDefinition<BudgetTableItem>[] = [
    {
      id: 'category',
      header: 'Category',
      cell: (item) => (isCategoryItem(item) ? item.category_name : item.budget_item_name),
      width: 400,
    },
    {
      id: 'projected_amount',
      header: 'Projected',
      cell: (item) =>
        isCategoryItem(item)
          ? formatCurrency(item.total || 0)
          : formatCurrency(item.projected_amount),
    },
    {
      id: 'actions',
      header: 'Actions',
      width: 50,
      verticalAlign: 'middle',
      cell: (item) => (
        <ButtonDropdown
          expandToViewport
          variant='inline-icon'
          items={
            isCategoryItem(item)
              ? [
                  { id: 'rename-category', text: 'Rename category', iconName: 'edit' },
                  {
                    id: 'delete-category',
                    text: 'Delete category',
                    iconName: 'delete-marker',
                  },
                  {
                    id: 'add-budget-line-item',
                    text: 'Add budget line item',
                    iconName: 'add-plus',
                  },
                ]
              : [
                  { id: 'edit-budget-item', text: 'Edit', iconName: 'edit' },
                  { id: 'delete-budget-item', text: 'Delete', iconName: 'delete-marker' },
                  {
                    id: 'change-category',
                    text: 'Change category',
                    iconName: 'add-plus',
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

  // const columns: TableProps.ColumnDefinition<BudgetTableItem>[] = [
  //   {
  //     id: 'category',
  //     header: 'Category',
  //     cell: (item) => isCategoryItem(item) ? item.category_name : item.name,
  //     width: 300,
  //     editConfig: {
  //       editingCell: (item, { currentValue, setValue }) => (
  //         <Input
  //           value={currentValue ?? (isCategoryItem(item) ? item.category_name : item.name)}
  //           onChange={(event) => setValue(event.detail.value)}
  //         />
  //       ),
  //     },
  //   },
  //   {
  //     id: 'amount',
  //     header: 'Amount',
  //     cell: (item) =>
  //       isCategoryItem(item) ? (
  //         '-'
  //       ) : (
  //         formatCurrency(item.projected_amount)
  //       ),
  //   },
  //   {
  //     id: 'budget',
  //     header: 'Budget amount',
  //     cell: (item) => formatCurrency(item.budget),
  //     ...(isRootRow && {
  //       editConfig: {
  //         editingCell: (item, { currentValue, setValue }) =>
  //           item.parentId === null && (
  //             <Input
  //               type='number'
  //               inputMode='decimal'
  //               value={currentValue ?? item.budget}
  //               onChange={(event) => setValue(event.detail.value)}
  //             />
  //           ),
  //       },
  //     }),
  //   },
  //   {
  //     id: 'budget-status',
  //     header: 'Budget status',
  //     cell: (item) =>
  //       item.parentId === null
  //         ? getBudgetStatus(item.amount || 0, item.budget || 0)
  //         : '-',
  //   },
  //   {
  //     id: 'actions',
  //     header: 'Actions',
  //     cell: (item) => (
  //       <ButtonDropdown
  //         expandToViewport
  //         variant='inline-icon'
  //         items={
  //           item.parentId === null
  //             ? [
  //                 { id: 'rename-category', text: 'Rename category', iconName: 'edit' },
  //                 {
  //                   id: 'delete-category',
  //                   text: 'Delete category',
  //                   iconName: 'delete-marker',
  //                 },
  //                 {
  //                   id: 'add-budget-line-item',
  //                   text: 'Add budget line item',
  //                   iconName: 'add-plus',
  //                 },
  //               ]
  //             : [
  //                 { id: 'edit', text: 'Edit', iconName: 'edit' },
  //                 { id: 'delete', text: 'Delete', iconName: 'delete-marker' },
  //                 {
  //                   id: 'change-category',
  //                   text: 'Change category',
  //                   iconName: 'add-plus',
  //                 },
  //               ]
  //         }
  //         onItemClick={({ detail }) => {
  //           switch (detail.id) {
  //             case 'delete-category':
  //               actions.handleDeleteCategory(item);
  //               break;
  //             case 'add-budget-line-item':
  //               actions.handleAddBudgetLineItem(item);
  //               break;
  //             default:
  //               break;
  //           }
  //         }}
  //       />
  //     ),
  //   },
  // ];

  return columns;
};

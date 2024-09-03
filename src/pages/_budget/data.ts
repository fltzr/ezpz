export type BudgetTableItem = {
  id: string;
  name: string;
  amount?: number;
  budget?: number;
  parentId: string | null;
};

export default [
  {
    id: 'expenses',
    name: 'Expenses',
    budget: 20000,
    parentId: null,
  },
  {
    id: 'expenses_rent',
    name: 'Rent',
    amount: 20000,
    parentId: 'expenses',
  },
  {
    id: 'expenses_groceries',
    name: 'Groceries',
    amount: 5000,
    parentId: 'expenses',
  },

  {
    id: 'transportation',
    name: 'Transportation',
    budget: 15000,
    parentId: null,
  },
  {
    id: 'transportation_car',
    name: 'Car',
    amount: 10000,
    parentId: 'transportation',
  },
  {
    id: 'transportation_public-transport',
    name: 'Public Transport',
    amount: 2000,
    parentId: 'transportation',
  },

  {
    id: 'savings',
    name: 'Savings',
    budget: 30000,
    parentId: null,
  },
  {
    id: 'savings_emergency-fund',
    name: 'Emergency Fund',
    amount: 10000,
    parentId: 'savings',
  },
  {
    id: 'savings_retirement-fund',
    name: 'Retirement Fund',
    amount: 20000,
    parentId: 'savings',
  },
] as ReadonlyArray<BudgetTableItem>;
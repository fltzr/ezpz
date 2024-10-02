import { useContext } from 'react';

import { BudgetContext } from '../components/budget-provider';

export const useBudgetProvider = () => {
  const context = useContext(BudgetContext);

  if (!context)
    throw new Error(`[❗️] useBudgetProvider must be used within a BudgetProvider.`);

  return context;
};

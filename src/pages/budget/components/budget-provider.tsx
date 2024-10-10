import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState,
} from 'react';

import { DateTime } from 'luxon';

type BudgetContextProps = {
  budgetEntry: string;
  setBudgetEntry: Dispatch<SetStateAction<string>>;
};

export const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

const BudgetProvider = ({ children }: PropsWithChildren) => {
  const date = DateTime.now();

  const [selectedBudgetEntry, setSelectedBudgetEntry] = useState(
    `${date.toFormat('yyyy')}-${date.toFormat('MM')}`
  );

  return (
    <BudgetContext.Provider
      value={{
        budgetEntry: selectedBudgetEntry,
        setBudgetEntry: setSelectedBudgetEntry,
      }}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;

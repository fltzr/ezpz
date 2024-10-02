import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useState,
} from 'react';
import { DateTime } from 'luxon';

import { useAuth } from '@/pages/auth/hooks/use-auth';

type SelectedUser = { userId: string; name: string };

type BudgetContextProps = {
  selectedUser: SelectedUser;
  budgetEntry: string;
  setSelectedUser: Dispatch<SetStateAction<SelectedUser>>;
  setBudgetEntry: Dispatch<SetStateAction<string>>;
};

export const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

const BudgetProvider = ({ children }: PropsWithChildren) => {
  const date = DateTime.now();
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState<SelectedUser>({
    userId: user!.id ?? null,
    name: user?.id.startsWith('d') ? 'Juliette' : 'Josh',
  });

  const [selectedBudgetEntry, setSelectedBudgetEntry] = useState(
    `${date.toFormat('yyyy')}-${date.toFormat('MM')}`
  );

  return (
    <BudgetContext.Provider
      value={{
        selectedUser,
        budgetEntry: selectedBudgetEntry,
        setBudgetEntry: setSelectedBudgetEntry,
        setSelectedUser,
      }}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;

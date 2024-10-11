import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { useAuth } from '@/pages/auth/hooks/use-auth';

type SelectedUser = { userId: string; name: string } | null;

type SelectedUserContextProps = {
  selectedUser: SelectedUser;
  setSelectedUser: Dispatch<SetStateAction<SelectedUser>>;
};

export const SelectedUserContext = createContext<SelectedUserContextProps | undefined>(
  undefined
);

export const SelectedUserProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  useEffect(() => {
    if (user) {
      setSelectedUser({
        userId: user.id,
        name: user.id.startsWith('d') ? 'Juliette' : 'Josh',
      });
    }
  }, [user]);

  return (
    <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </SelectedUserContext.Provider>
  );
};

import { PropsWithChildren, useEffect, useState } from 'react';

import { useAuth } from '@/pages/auth/hooks/use-auth';

import { SelectedUserContext } from './selected-user-context';

export type SelectedUser = { userId: string; name: string } | null;

export const SelectedUserProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  useEffect(() => {
    if (user && typeof user !== 'undefined') {
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

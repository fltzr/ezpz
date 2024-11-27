import { useContext } from 'react';

import { SelectedUserContext } from '@/components/selected-user-context';

export const useSelectedUser = () => {
  const context = useContext(SelectedUserContext);

  if (!context)
    throw new Error(`[❗️] useSelectedUser must be used within a SelectedUser.`);

  return context;
};

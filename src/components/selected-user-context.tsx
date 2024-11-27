import { createContext, Dispatch, SetStateAction } from 'react';

import { SelectedUser } from './selected-user-provider';

type SelectedUserContextProps = {
  selectedUser: SelectedUser;
  setSelectedUser: Dispatch<SetStateAction<SelectedUser>>;
};

export const SelectedUserContext = createContext<SelectedUserContextProps | undefined>(
  undefined
);

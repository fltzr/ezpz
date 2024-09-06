import { useState } from 'react';
import { UserSelector } from './components/user-selector';
import { ViewBudgetPage } from './view';
import { useAuth } from '../../auth/components/auth-provider';
import { Header } from '@cloudscape-design/components';

const BudgetPage = () => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<{
    userId: string | null;
    name: string;
  } | null>({
    userId: user?.id ?? null,
    name: user?.id.startsWith('d') ? 'Juliette' : 'Josh',
  });

  return (
    <>
      {selectedUserId && (
        <ViewBudgetPage
          userId={selectedUserId?.userId ?? ''}
          children={
            <Header
              variant='awsui-h1-sticky'
              actions={
                <UserSelector
                  onUserChange={(userId, name) => {
                    setSelectedUserId({ userId, name });
                  }}
                />
              }>
              {selectedUserId?.name}'s Budget Dashboard
            </Header>
          }
        />
      )}
    </>
  );
};

export default BudgetPage;

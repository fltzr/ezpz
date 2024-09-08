import { useState } from 'react';
import { UserSelector } from './components/user-selector';
import { ViewBudgetPage } from './view';
import { useAuth } from '../../auth/hooks/use-auth';
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
        <ViewBudgetPage userId={selectedUserId?.userId ?? ''}>
          <Header
            variant='awsui-h1-sticky'
            actions={
              <UserSelector
                onUserChange={(userId, name) => {
                  setSelectedUserId({ userId, name });
                }}
              />
            }>
            {selectedUserId?.name}&apos;s Budget Dashboard
          </Header>
        </ViewBudgetPage>
      )}
    </>
  );
};

export default BudgetPage;

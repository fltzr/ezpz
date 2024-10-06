import { lazy, useEffect, useState } from 'react';

import { Box, Header, Modal, StatusIndicator } from '@cloudscape-design/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DrawerProvider } from '@/components/drawer-provider';
import { SupabaseProvider } from '@/components/supabase-provider';
import { useTheme } from '@/hooks/use-theme';
import { AuthProvider } from '@/pages/auth/components/auth-provider';

const Router = lazy(() => import('./router'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => {
  const [initialPopup, setInitialPopup] = useState(false);

  useTheme();

  useEffect(() => {
    const hasShownPopup = localStorage.getItem('shown-initial-popup') ?? false;

    if (!hasShownPopup) {
      setInitialPopup(true);
      localStorage.setItem('shown-initial-popup', 'true');
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <AuthProvider>
          <DrawerProvider>
            <Router />
            <Modal
              visible={initialPopup}
              onDismiss={() => setInitialPopup(false)}
              header={<Header variant='h1'>Coucou beautiful bABY</Header>}>
              I{' '}
              <Box variant='span'>
                <StatusIndicator type='success'>LOVE</StatusIndicator>
              </Box>{' '}
              you!!!!!!!!
            </Modal>
          </DrawerProvider>
        </AuthProvider>
      </SupabaseProvider>
    </QueryClientProvider>
  );
};

export default App;

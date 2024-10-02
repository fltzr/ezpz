import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Header, Modal, StatusIndicator } from '@cloudscape-design/components';

import { router } from './router';
import { AuthProvider } from '@/pages/auth/components/auth-provider';
import { useTheme } from '@/hooks/use-theme';
import { SupabaseProvider } from '@/components/supabase-provider';
import { DrawerProvider } from '@/components/drawer-provider';

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
            <RouterProvider router={router} />
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

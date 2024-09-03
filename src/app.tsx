import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { useTheme } from './common/hooks/use-theme';
import { Box, Header, Modal, StatusIndicator } from '@cloudscape-design/components';
import { SupabaseProvider } from './common/hooks/use-supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export const App = () => {
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
      </SupabaseProvider>
    </QueryClientProvider>
  );
};

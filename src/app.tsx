import { lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Header, Modal, StatusIndicator } from '@cloudscape-design/components';
import I18nProvider, { I18nProviderProps } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import messagesFr from '@cloudscape-design/components/i18n/messages/all.fr';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DrawerProvider } from '@/components/drawer-provider';
import { SupabaseProvider } from '@/components/supabase-provider';
import { useTheme } from '@/hooks/use-theme';
import { AuthProvider } from '@/pages/auth/components/auth-provider';

import BudgetProvider from './pages/budget/components/budget-provider';

const Router = lazy(() => import('./router'));

export type Locale = 'en' | 'fr';

const localeMap: Record<Locale, I18nProviderProps.Messages> = {
  en: messages,
  fr: messagesFr,
};

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
  const { i18n } = useTranslation();

  const [locale, setLocale] = useState<Locale>(() => {
    const currentLanguage = i18n.language.includes('en') ? 'en' : 'fr';
    return currentLanguage || 'en';
  });

  const [localeMessages, setLocaleMessages] = useState(localeMap[locale]);

  useEffect(() => {
    const handleLanguageChange = (newLocale: Locale) => {
      setLocale(newLocale);
      setLocaleMessages(localeMap[newLocale]);
      document.documentElement.lang = newLocale;
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useTheme();

  useEffect(() => {
    const hasShownPopup = localStorage.getItem('shown-initial-popup') ?? false;

    if (!hasShownPopup) {
      setInitialPopup(true);
      localStorage.setItem('shown-initial-popup', 'true');
    }
  }, []);

  return (
    <I18nProvider locale={locale} messages={[localeMessages]}>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <AuthProvider>
            <BudgetProvider>
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
            </BudgetProvider>
          </AuthProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
};

export default App;

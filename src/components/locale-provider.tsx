import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { LoadingBar } from '@cloudscape-design/chat-components';
import I18nProvider, {
  I18nProviderProps,
  importMessages,
} from '@cloudscape-design/components/i18n';
import i18n from 'i18next';

export type Locale = 'en' | 'fr' | 'es';

type LocaleOption = {
  code: Locale;
  label: string;
};

type LocaleContextProps = {
  locale: Locale;
  localeOptions: LocaleOption[];
  setLocale: (locale: Locale) => void;
};

const availableLocales: LocaleOption[] = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'fr', label: '🇫🇷 Français' },
];

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocale] = useState<Locale>(
    () =>
      (localStorage.getItem('locale') as Locale | null) ||
      (document.documentElement.lang as Locale) ||
      'en'
  );

  const [messages, setMessages] = useState<I18nProviderProps['messages'] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMessages = async (selectedLocale: Locale) => {
    try {
      const loadedMessages = await importMessages(selectedLocale);
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading locale messages. Fallback to english.', error);
      await loadMessages('en');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadMessages(locale).catch(console.error);
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    i18n.changeLanguage(newLocale).catch(console.error);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    setLoading(true);
  };

  const contextValue: LocaleContextProps = {
    locale,
    localeOptions: availableLocales,
    setLocale: changeLocale,
  };

  if (loading) {
    return <LoadingBar variant='gen-ai-masked' />;
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      <I18nProvider messages={messages!}>{children}</I18nProvider>
    </LocaleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) throw new Error('useLocale must be used within LocaleProvider.');

  return context;
};

import { TopNavigation, TopNavigationProps } from '@cloudscape-design/components';

import styles from '../styles/top-navigation.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/use-auth';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useNotificationStore } from '../state/notifications';
import { nanoid } from 'nanoid';
import { Locale, useLocale } from '../components/locale-provider';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

const generateUserHeaderItems = ({
  t,
  locale: { locale, localeOptions, setLocale },
  user,
  dropdownActions: { signOut, profile },
}: {
  t: TFunction<'translation', 'layout.header.items'>;
  locale: ReturnType<typeof useLocale>;
  user: User | null;
  dropdownActions: {
    signOut: () => Promise<void>;
    profile: (event: CustomEvent) => void;
  };
}): TopNavigationProps['utilities'] => {
  const selectedLocale = localeOptions.find((loc) => loc.code === locale);

  const localeItems = localeOptions.map((opt) => ({
    id: opt.code,
    text: opt.label,
  }));

  const items: TopNavigationProps['utilities'] = [
    {
      type: 'menu-dropdown',
      text: selectedLocale?.label,
      items: localeItems,
      onItemClick: (event) => {
        event.preventDefault();
        setLocale(event.detail.id as Locale);
      },
    },
  ];

  if (!user) return items;

  return [
    ...items,
    {
      type: 'menu-dropdown',
      iconName: 'user-profile-active',
      description: user.email,
      items: [
        {
          id: 'profile',
          text: t('profile'),
          iconName: 'user-profile',
        },
        {
          id: 'sign-out',
          text: t('signOut'),
          iconName: 'undo',
        },
      ],
      onItemClick: (event) => {
        event.preventDefault();

        switch (event.detail.id) {
          case 'sign-out':
            signOut().catch((error: Error) => {
              console.log(`Error signing out: ${error.message}`);
            });
            break;
          case 'profile':
            profile(event);
            break;
          default:
            break;
        }
      },
    },
  ];
};

export const GlobalHeader = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'layout.header.items' });
  const { locale, localeOptions, setLocale } = useLocale();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();

  return (
    <div id='h' className={styles.header}>
      <TopNavigation
        identity={{
          href: '/',
          title: 'ezpz',
          onFollow: (event) => {
            event.preventDefault();
            navigate('/');
          },
        }}
        utilities={generateUserHeaderItems({
          t,
          locale: {
            locale,
            localeOptions,
            setLocale,
          },
          user,
          dropdownActions: {
            profile: (event) => {
              event.preventDefault();
              navigate('/profile', { replace: true });
            },
            signOut: async () => {
              const { error } = await supabase.auth.signOut({ scope: 'global' });

              if (error) {
                addNotification({
                  id: nanoid(5),
                  type: 'error',
                  message: t('layout.header.items.signOutError', {
                    message: error.message,
                  }),
                });

                return;
              }

              return navigate('/auth', { replace: true, state: { reason: 'sign-out' } });
            },
          },
        })}
      />
    </div>
  );
};

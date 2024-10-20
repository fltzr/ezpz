import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TopNavigation, TopNavigationProps } from '@cloudscape-design/components';

import { useAuth } from '@/pages/auth/hooks/use-auth';
import { supabase } from '@/utils/supabase';

import styles from '../styles/top-navigation.module.scss';

export const GlobalHeader = () => {
  const { t, i18n } = useTranslation(undefined, { keyPrefix: 'layout.header.items' });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth', { replace: true, state: { reason: 'sign-out' } });
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language).catch(console.error);
  };

  const currentLanguage = i18n.language;

  const utilitiesNew: TopNavigationProps['utilities'] = [
    {
      ariaLabel: 'Locale options',
      type: 'menu-dropdown',
      text: currentLanguage === 'en' ? '🇺🇸 English' : '🇫🇷 Français',
      items: [
        { id: 'en', text: '🇺🇸 English' },
        { id: 'fr', text: '🇫🇷 Français' },
      ],
      onItemClick: (event: { detail: { id: string } }) => {
        handleLanguageChange(event.detail.id);
      },
    },
    {
      ariaLabel: 'Profile settings',
      type: 'menu-dropdown',
      iconName: 'user-profile-active',
      items: [
        { id: 'profile', text: t('profile'), iconName: 'user-profile' },
        { id: 'sign-out', text: t('signOut'), iconName: 'undo' },
      ],
      onItemClick: (event: { detail: { id: string } }) => {
        if (event.detail.id === 'sign-out') handleSignOut().catch(console.error);
        else if (event.detail.id === 'profile') navigate('/profile');
      },
    },
  ];

  return (
    <div id='h' className={styles['header']}>
      <TopNavigation
        identity={{
          href: '/',
          title: 'ezpz',
          onFollow: (event) => {
            event.preventDefault();
            navigate('/');
          },
        }}
        utilities={user ? utilitiesNew : [utilitiesNew[0]]}
      />
    </div>
  );
};

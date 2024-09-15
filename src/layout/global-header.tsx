import { TopNavigation, TopNavigationProps } from '@cloudscape-design/components';

import styles from '../styles/top-navigation.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/use-auth';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNotificationStore } from '../common/state/notifications';
import { nanoid } from 'nanoid';

const generateUserHeaderItems = ({
  user,
  dropdownActions: { signOut },
}: {
  user: User | null;
  dropdownActions: { signOut: () => Promise<void> };
}): TopNavigationProps['utilities'] => {
  if (!user) return undefined;

  return [
    {
      type: 'menu-dropdown',
      iconName: 'user-profile-active',
      description: user.email,
      items: [
        {
          id: 'profile',
          text: 'Profile',
          disabled: true,
          disabledReason: "Doesn't exist yet!",
        },
        {
          id: 'sign-out',
          iconName: 'undo',
          text: 'Sign out',
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
          default:
            break;
        }
      },
    },
  ];
};

export const GlobalHeader = () => {
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
          user,
          dropdownActions: {
            signOut: async () => {
              const { error } = await supabase.auth.signOut({ scope: 'global' });

              if (error) {
                addNotification({
                  id: nanoid(5),
                  type: 'error',
                  message: `Error while attempting to sign out: ${error.message}`,
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

import { TopNavigation } from '@cloudscape-design/components';

import styles from '../styles/top-navigation.module.scss';

export const GlobalHeader = () => {
  return (
    <div id="h" className={styles.header}>
      <TopNavigation
        identity={{
          href: '/',
          title: 'ezpz',
        }}
      />
    </div>
  );
};

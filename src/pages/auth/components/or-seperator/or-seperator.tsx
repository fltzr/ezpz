import { useTranslation } from 'react-i18next';

import { Box } from '@cloudscape-design/components';

import styles from './styles.module.scss';

export const OrSeperator = () => {
  const { t } = useTranslation();

  return (
    <div className={styles['or-separator']}>
      <Box variant='strong'>{t('common.or')}</Box>
    </div>
  );
};

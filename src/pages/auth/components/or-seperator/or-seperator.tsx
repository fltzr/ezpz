import { Box } from '@cloudscape-design/components';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

export const OrSeperator = () => {
  const { t } = useTranslation();

  return (
    <div className={styles['or-separator']}>
      <Box variant='strong'>{t('common.or')}</Box>
    </div>
  );
};

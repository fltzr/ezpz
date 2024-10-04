import { Alert, Header } from '@cloudscape-design/components';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';

export const NewDashboardAlert = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'budget.featureFlags.configurableDashboard',
  });
  const [showFeatureAlert, setShowFeatureAlert] = useLocalStorage(
    'feature-configurable-dashboard-notification',
    true
  );

  return (
    <>
      {showFeatureAlert && (
        <Alert
          dismissible
          dismissAriaLabel='Dismiss message'
          type='info'
          header={<Header variant='h2'>{t('title')}</Header>}
          onDismiss={() => setShowFeatureAlert(false)}>
          {t('message')}
        </Alert>
      )}
    </>
  );
};

import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import getUserLocale from 'get-user-locale';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

type ManualRefreshProps = {
  lastRefresh?: string | null;
  loading?: boolean;
  onRefresh: () => void;
};

export const ManualRefresh = ({
  lastRefresh,
  loading,
  onRefresh,
}: ManualRefreshProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'common' });
  const locale = getUserLocale().includes('fr') ? 'fr' : 'en';
  const zone = locale === 'fr' ? 'Europe/Pairs' : 'America/New_York';

  const formattedLastRefresh =
    lastRefresh &&
    DateTime.fromISO(lastRefresh, { zone: 'UTC' })
      .setLocale(locale)
      .setZone(zone)
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  return (
    <SpaceBetween direction='horizontal' size='xs'>
      {lastRefresh && (
        <Box variant='p' fontSize='body-s' color='text-status-inactive' textAlign='right'>
          <span aria-live='polite' aria-atomic>
            {t('lastUpdated')}
            <br />
            {formattedLastRefresh}
          </span>
        </Box>
      )}
      <Button
        iconName='refresh'
        ariaLabel='Refresh'
        loadingText='Refetching table content'
        loading={loading}
        onClick={onRefresh}
      />
    </SpaceBetween>
  );
};

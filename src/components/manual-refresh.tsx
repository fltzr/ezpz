import { useTranslation } from 'react-i18next';

import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import { DateTime } from 'luxon';

import i18n from '@/i18n';

export type ManualRefreshProps = {
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
  const locale = i18n.resolvedLanguage ?? 'en';
  const zone = locale === 'fr' ? 'Europe/Paris' : 'America/New_York';

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

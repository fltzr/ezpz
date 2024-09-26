import { Box, Button, SpaceBetween } from '@cloudscape-design/components';
import { DateTime } from 'luxon';

type ManualRefreshProps = {
  lastRefresh?: string;
  loading?: boolean;
  onRefresh: () => void;
};

export const ManualRefresh = ({
  lastRefresh,
  loading,
  onRefresh,
}: ManualRefreshProps) => {
  const formattedLastRefresh =
    lastRefresh &&
    DateTime.fromISO(lastRefresh, { zone: 'UTC' })
      .setZone('America/New_York')
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);

  return (
    <SpaceBetween direction='horizontal' size='xs' alignItems='center'>
      {lastRefresh && (
        <Box variant='p' fontSize='body-s' color='text-status-inactive' textAlign='right'>
          <span aria-live='polite' aria-atomic>
            Last updated
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

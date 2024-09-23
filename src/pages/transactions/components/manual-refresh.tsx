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
}: ManualRefreshProps) => (
  <SpaceBetween direction='horizontal' size='xs' alignItems='center'>
    {lastRefresh && (
      <Box variant='p' fontSize='body-s' color='text-status-inactive' textAlign='right'>
        <span aria-live='polite' aria-atomic>
          Last updated
          <br />
          {DateTime.fromFormat(lastRefresh, 'yyyy-MM-dd HH:mm:ss').toLocaleString(
            DateTime.DATETIME_FULL_WITH_SECONDS
          )}
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

import { Box, Container, Header } from '@cloudscape-design/components';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

export const ErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container
        header={
          <Header info={error.status} variant='h1'>
            {t('routeErrorTitle')}
          </Header>
        }>
        <Box variant='p'>
          {t('error.routeErrorMessage')}
          <Box variant='pre'>
            {error.statusText} | {error.data}
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <div className={styles['error-page']}>
      <Container
        header={
          <Header info={error instanceof Error ? error.name : String(error)} variant='h1'>
            {t('error.routeErrorTitle')}
          </Header>
        }>
        <Box variant='p'>
          {t('error.routeErrorMessage')}
          <Box variant='pre'>
            {error instanceof Error ? error.message : String(error)}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

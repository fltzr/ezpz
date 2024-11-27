import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

import { Box, Button, Container, Header } from '@cloudscape-design/components';

import styles from './styles.module.scss';

export const ErrorPage = () => {
  const { t } = useTranslation();
  const errorTitle = t('error.routeErrorTitle');

  const error = useRouteError();
  const navigate = useNavigate();

  const isRouteError = isRouteErrorResponse(error);

  const errorInfo = isRouteError
    ? error.status
    : error instanceof Error
      ? error.name
      : String(error);

  const errorMessage = isRouteError
    ? `${error.statusText} | ${error.data}`
    : error instanceof Error
      ? error.message
      : String(error);

  return (
    <div className={styles['error-page']}>
      <Container
        header={
          <Header variant='h1' info={errorInfo}>
            {errorTitle}
          </Header>
        }
        footer={
          isRouteError && (
            <Box float='right'>
              <Button variant='primary' iconName='undo' onClick={() => void navigate(-1)}>
                {t('error.navigateBack')}
              </Button>
            </Box>
          )
        }>
        <Box variant='p'>{t('error.routeErrorMessage')}</Box>
        <Box variant='pre'>{errorMessage}</Box>
      </Container>
    </div>
  );
};

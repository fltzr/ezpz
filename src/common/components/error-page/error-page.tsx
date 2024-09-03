import { Box, Container, Header } from '@cloudscape-design/components';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import styles from './styles.module.scss';

export const ErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container
        header={
          <Header info={error.status} variant='h1'>
            Oops!
          </Header>
        }>
        <Box variant='p'>
          We're sorry, an unexpected error occurred.
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
            Oops!
          </Header>
        }>
        <Box variant='p'>
          We're sorry, an unexpected error occurred.
          <Box variant='pre'>
            {error instanceof Error ? error.message : String(error)}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

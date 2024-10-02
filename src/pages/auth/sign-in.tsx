import {
  Box,
  Container,
  Grid,
  Header,
  Link,
  SpaceBetween,
} from '@cloudscape-design/components';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { OrSeperator } from './components/or-seperator/or-seperator';
import { SignInWithGoogle } from './components/providers/google';
import { SignInWithGithub } from './components/providers/github';
import { SignInForm } from './components/sign-in-form';

import { useTranslation } from 'react-i18next';

const SignInPage = () => {
  const { t } = useTranslation();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return navigate('/budget');
    }
  }, [navigate, user]);

  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, xs: 2 } },
        { colspan: { default: 12, xs: 8 } },
        { colspan: { default: 12, xs: 2 } },
      ]}>
      <div />
      <SpaceBetween direction='vertical' size='xxl'>
        <Container
          header={<Header variant='h1'>{t('auth.signIn')}</Header>}
          footer={
            <>
              <Box textAlign='center'>
                {t('auth.noAccount')}{' '}
                <Link variant='primary' href='#'>
                  {t('auth.noAccountLink')}
                </Link>
              </Box>
            </>
          }>
          <SignInForm />
          <OrSeperator />
          <SpaceBetween direction='vertical' size='m'>
            <SignInWithGoogle />
            <SignInWithGithub />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
      <div />
    </Grid>
  );
};

export const Component = SignInPage;

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Container,
  Grid,
  Header,
  Link,
  SpaceBetween,
} from '@cloudscape-design/components';

import { OrSeperator } from './components/or-seperator/or-seperator';
import { SignInWithGithub } from './components/providers/github';
import { SignInWithGoogle } from './components/providers/google';
import { SignInForm } from './components/sign-in-form';
import { useAuth } from './hooks/use-auth';

const SignInPage = () => {
  const { t } = useTranslation();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      await navigate('/budget');
    };

    if (user) {
      redirect().catch((e) => console.error(e));
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

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

const SignInPage = () => {
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
          header={<Header variant='h1'>Sign in</Header>}
          footer={
            <>
              <Box textAlign='center'>
                Don&apos;t have an account?{' '}
                <Link variant='primary' href='#'>
                  Sign up
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

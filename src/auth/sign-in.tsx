import {
  Box,
  Button,
  Checkbox,
  Container,
  ContentLayout,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNotificationStore } from '../common/state/notifications';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required!')
    .email('Invalid email address!')
    .max(50, 'Email must not exceed 50 characters.'),
  password: z.string().min(1, 'Password is required!'),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      return navigate('/budget');
    }

    setFocus('email');
  }, [user, navigate, setFocus]);

  const handleFailedSignIn = (error: AuthError) => {
    addNotification({
      id: nanoid(5),
      type: 'error',
      message: `Error signing in: ${error.message}. Please try again!`,
    });

    setFocus('email');
  };

  const handleSignIn = async (credentials: SignInSchema) => {
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      return handleFailedSignIn(error);
    }

    reset();

    if (credentials.email.includes('te')) {
      addNotification({
        id: nanoid(5),
        type: 'success',
        message: 'Welcome, beautiful baby!',
      });
    }

    return navigate('/budget', { replace: true });
  };

  return (
    <Box padding={{ vertical: 'xxxl' }}>
      <ContentLayout defaultPadding disableOverlap maxContentWidth={500}>
        <Container header={<Header variant='h1'>Sign in</Header>}>
          <Form
            actions={
              <Button
                variant='primary'
                onClick={() => {
                  void handleSubmit(handleSignIn)();
                }}>
                Sign in
              </Button>
            }>
            <SpaceBetween size='m' direction='vertical'>
              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <FormField label='Email' errorText={errors.email?.message}>
                    <Input
                      {...field}
                      onChange={(event) => field.onChange(event.detail.value)}
                    />
                  </FormField>
                )}
              />
              <Controller
                control={control}
                name='password'
                render={({ field }) => (
                  <FormField label='Password'>
                    <SpaceBetween direction='vertical' size='xs'>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(event) => field.onChange(event.detail.value)}
                      />
                      <Checkbox
                        checked={showPassword}
                        onChange={(event) => setShowPassword(event.detail.checked)}>
                        Show password
                      </Checkbox>
                    </SpaceBetween>
                  </FormField>
                )}
              />
            </SpaceBetween>
          </Form>
        </Container>
      </ContentLayout>
    </Box>
  );
};

export const Component = SignInPage;

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignIn } from '../hooks/use-sign-in';
import { type SignInSchema, signInSchema } from '../validation/sign-in';
import {
  Box,
  Button,
  Checkbox,
  Form,
  FormField,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';
import { Turnstile } from '@marsidev/react-turnstile';

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { handleSignIn } = useSignIn({
    setIsLoading,
    reset,
    setFocus,
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  return (
    <form
      id='form-auth_sign-in'
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(handleSignIn)();
      }}
      noValidate>
      <Form>
        <SpaceBetween size='m' direction='vertical'>
          <Controller
            control={control}
            name='email'
            render={({ field }) => (
              <FormField label='Email' errorText={errors.email?.message}>
                <Input
                  {...field}
                  placeholder='you@example.com'
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
                    placeholder={'••••••••••'}
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
          <Controller
            control={control}
            name='options.captchaToken'
            render={({ field }) => (
              <Turnstile
                siteKey={import.meta.env.VITE_CLOUDFLARE_TURNSTILE_KEY}
                onSuccess={field.onChange}
              />
            )}
          />
          <Box padding={{ top: 'm' }}>
            <Button
              fullWidth
              form='form-auth_sign-in'
              loading={isLoading}
              variant='primary'
              formAction='submit'>
              Sign in
            </Button>
          </Box>
        </SpaceBetween>
      </Form>
    </form>
  );
};

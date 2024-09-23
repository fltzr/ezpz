import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required!')
    .email('Invalid email address!')
    .max(50, 'Email must not exceed 50 characters.'),
  password: z.string().min(1, 'Password is required!'),
  options: z.object({
    captchaToken: z.string().optional(),
  }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

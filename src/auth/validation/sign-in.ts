import { z } from 'zod';
import i18n from '../../i18n';

export const signInSchema = z.object({
  email: z
    .string({ message: i18n.t('auth.formValidation.emailRequired') })
    .min(1, i18n.t('auth.formValidation.emailRequired'))
    .email(i18n.t('auth.formValidation.emailInvalid'))
    .max(50, i18n.t('auth.formValidation.emailExceededCharacterCount')),
  password: z.string().min(1, i18n.t('auth.formValidation.passwordRequired')),
  options: z.object({
    captchaToken: z.string().optional(),
  }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

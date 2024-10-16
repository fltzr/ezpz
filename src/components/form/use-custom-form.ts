import { FieldValues, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

export const useCustomForm = <T extends FieldValues>(schema: ZodSchema<T>) =>
  useForm<T>({ resolver: zodResolver(schema) });

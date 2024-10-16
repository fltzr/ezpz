import { ReactNode } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import { FormField } from '@cloudscape-design/components';

type FormFieldWrapperProps<T extends FieldValues> = {
  name: keyof T;
  control: Control<T>;
  label: string;
  description?: string;
  errorText: string;
  children: (field: ControllerRenderProps<T>) => ReactNode;
};

export const FormFieldWrapper = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  errorText,
  children,
}: FormFieldWrapperProps<T>) => (
  <Controller
    name={name as Path<T>}
    control={control}
    render={({ field }) => (
      <FormField label={label} description={description} errorText={errorText}>
        {children(field)}
      </FormField>
    )}
  />
);

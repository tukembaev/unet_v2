import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm as useHookForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  Path,
  FieldPath,
} from 'react-hook-form';
import { ZodSchema, z } from 'zod';
import React from 'react';
import { cn } from './utils';
import { Label } from 'shared/ui/label';
import { Input } from 'shared/ui/input';

// Extended form configuration with Zod schema
export interface TypedFormProps<TFormValues extends FieldValues>
  extends Omit<UseFormProps<TFormValues>, 'resolver'> {
  schema: ZodSchema<TFormValues>;
}

// Extended form return type with typed submit handler
export type TypedFormReturn<TFormValues extends FieldValues> = UseFormReturn<TFormValues>;

/**
 * Typed wrapper around react-hook-form's useForm with Zod validation
 * 
 * @example
 * const loginSchema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 * 
 * type LoginFormValues = z.infer<typeof loginSchema>;
 * 
 * function LoginForm() {
 *   const form = useForm<LoginFormValues>({
 *     schema: loginSchema,
 *     defaultValues: { email: '', password: '' }
 *   });
 * 
 *   const onSubmit = form.handleSubmit((data) => {
 *     console.log(data); // Fully typed!
 *   });
 * 
 *   return <form onSubmit={onSubmit}>...</form>
 * }
 */
export function useForm<TFormValues extends FieldValues = FieldValues>({
  schema,
  ...props
}: TypedFormProps<TFormValues>): TypedFormReturn<TFormValues> {
  return useHookForm<TFormValues>({
    ...props,
    resolver: zodResolver(schema),
  });
}

// Form field component for easy integration
interface FormFieldProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  description?: string;
  required?: boolean;
}

export function FormField<TFormValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  className,
  description,
  required,
}: FormFieldProps<TFormValues>) {
  const error = form.formState.errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...form.register(name as FieldPath<TFormValues>)}
        className={cn(errorMessage && 'border-destructive')}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
      />
      {description && !errorMessage && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {errorMessage && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// Helper type to infer form values from Zod schema
export type InferFormValues<T extends ZodSchema> = z.infer<T>;


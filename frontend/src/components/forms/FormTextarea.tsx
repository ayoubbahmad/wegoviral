'use client';

import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { Textarea, TextareaProps } from '../Textarea';
import { Label } from '../Label';
import { cn } from '@/lib/utils';

interface FormTextareaProps<T extends FieldValues> extends Omit<
  TextareaProps,
  'name'
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: string;
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  error,
  className,
  ...props
}: FormTextareaProps<T>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
  });

  const errorMessage = error || fieldError?.message;

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea
        {...field}
        {...props}
        id={name}
        className={cn(
          errorMessage &&
            'border-destructive focus-visible:ring-destructive/20',
        )}
      />
      {errorMessage && (
        <p className='text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1'>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

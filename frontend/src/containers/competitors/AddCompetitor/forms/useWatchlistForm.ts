import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { watchlistSchema, WatchlistFormValues } from './schema';

export function useWatchlistForm() {
  const form = useForm<WatchlistFormValues>({
    resolver: zodResolver(watchlistSchema),
    defaultValues: {
      competitors: [{ platform: 'instagram', value: '' }],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'competitors',
  });

  return {
    ...form,
    ...fieldArray,
  };
}

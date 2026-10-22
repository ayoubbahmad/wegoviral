import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { watchlistSchema, WatchlistFormValues } from './schema';
import { useT } from '@/i18n/provider';

export function useWatchlistForm() {
  const t = useT();
  const form = useForm<WatchlistFormValues>({
    resolver: zodResolver(watchlistSchema(t)),
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

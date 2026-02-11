'use client';

import { Modal } from '@/components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput } from '@/components/forms/FormInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { watchlistsApi } from '../api/watchlists';
import { useWatchlistSlice } from '../slice/watchlistSlice';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/providers/Toast';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type FormValues = z.infer<typeof schema>;

export function CreateWatchlistModal() {
  const { isCreateModalOpen, setIsCreateModalOpen } = useWatchlistSlice();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const mutation = useMutation({
    mutationFn: watchlistsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      showToast('Watchlist created successfully', 'success');
      handleClose();
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.error || 'Failed to create watchlist',
        'error',
      );
    },
  });

  const handleClose = () => {
    reset();
    setIsCreateModalOpen(false);
  };

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data.name);
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={handleClose}
      title='Create New Watchlist'
      maxWidth='md'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <FormInput
          name='name'
          control={control}
          label='Watchlist Name'
          placeholder='e.g., Tech Competitors, Lifestyle Inspo...'
        />

        <div className='flex justify-end gap-3 pt-4 border-t border-border/50'>
          <button
            type='button'
            onClick={handleClose}
            className='px-6 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting || mutation.isPending}
            className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20'
          >
            {isSubmitting || mutation.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Plus className='w-4 h-4' />
            )}
            Create Watchlist
          </button>
        </div>
      </form>
    </Modal>
  );
}

'use client';

import { Modal } from '@/components/Modal';
import { Plus, Users, Search, Loader2 } from 'lucide-react';
import { CompetitorSearchRow } from './components/CompetitorSearchRow';
import { useWatchlistForm } from './forms/useWatchlistForm';
import { WatchlistFormValues } from './forms/schema';
import { useAddCompetitorController } from './controller';
import { useAddCompetitorSlice } from './slice';
import { useQuery } from '@tanstack/react-query';
import { watchlistsApi as globalWatchlistsApi } from '../api/watchlists';
import { FormSelect } from '@/components/forms/FormSelect';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (competitor: any) => Promise<{ success: boolean; error?: string }>;
}

export function AddCompetitorModal({
  isOpen,
  onClose,
}: AddCompetitorModalProps) {
  const { previewMutation, bulkCreateMutation, resetSlice } =
    useAddCompetitorController();
  const { prevStep, previews, setPrevStep } = useAddCompetitorSlice();

  const { data: watchlists } = useQuery({
    queryKey: ['watchlists'],
    queryFn: globalWatchlistsApi.getAll,
    enabled: isOpen,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset: resetForm,
    fields,
    append,
    remove,
  } = useWatchlistForm();

  const onFetchPreviews = async (data: WatchlistFormValues) => {
    previewMutation.mutate(data);
  };

  const onFinalSubmit = async () => {
    const result = await bulkCreateMutation.mutateAsync(watch());
    if (result?.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    resetForm();
    resetSlice();
    onClose();
  };

  const loading = previewMutation.isPending || bulkCreateMutation.isPending;

  const watchlistOptions = [
    { label: 'None (Uncategorized)', value: '' },
    ...(watchlists?.map((w: any) => ({ label: w.name, value: w.id })) || []),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={prevStep ? 'Review Watchlist' : 'Build Your Watchlist'}
      maxWidth='2xl'
    >
      {!prevStep ? (
        <form onSubmit={handleSubmit(onFetchPreviews)} className='space-y-6'>
          <div className='bg-secondary/10 p-4 rounded-2xl border border-border/50 mb-6'>
            <FormSelect
              name='watchlistId'
              control={control}
              label='Categorize under Watchlist'
              options={watchlistOptions}
            />
          </div>

          <div className='max-h-[420px] overflow-y-auto custom-scrollbar -m-2 p-2'>
            <div className='space-y-5'>
              {fields.map((field, index) => (
                <CompetitorSearchRow
                  key={field.id}
                  control={control}
                  platformName={`competitors.${index}.platform`}
                  valueName={`competitors.${index}.value`}
                  onRemove={() => remove(index)}
                  showRemove={fields.length > 1}
                />
              ))}
            </div>
          </div>

          <button
            type='button'
            onClick={() => append({ platform: 'instagram', value: '' })}
            className='mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-3 rounded-xl border border-primary/20 w-full justify-center border-dashed'
          >
            <Plus className='w-4 h-4' /> Add Another Channel
          </button>

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
              disabled={loading}
              className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20'
            >
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Search className='w-4 h-4' />
              )}
              Preview Watchlist
            </button>
          </div>
        </form>
      ) : (
        <div className='space-y-6'>
          <p className='text-sm text-muted-foreground font-medium'>
            We found {previews.length} channels. Review them below before adding
            to your watchlist.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto custom-scrollbar -m-2 p-2 mb-2'>
            {previews.map((preview, index) => (
              <div
                key={index}
                className='flex items-center gap-3 p-4 rounded-2xl bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-colors'
              >
                <img
                  src={preview.avatarUrl}
                  alt={preview.name}
                  className='w-12 h-12 rounded-xl object-cover border border-border/50'
                />
                <div className='flex-1 min-w-0'>
                  <h4 className='text-sm font-bold truncate'>{preview.name}</h4>
                  <p className='text-xs text-muted-foreground truncate'>
                    @{preview.handle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-between items-center pt-4 border-t border-border/50'>
            <button
              type='button'
              onClick={() => setPrevStep(false)}
              className='px-6 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors'
            >
              Back
            </button>
            <div className='flex gap-3'>
              <button
                type='button'
                onClick={handleClose}
                className='px-6 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={loading}
                onClick={onFinalSubmit}
                className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20'
              >
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Users className='w-4 h-4' />
                )}
                Start Tracking {previews.length} Channels
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

'use client';

import { Modal } from '@/components/Modal';
import { useToast } from '@/providers/Toast';
import { useState } from 'react';
import { Plus, Users, Search, Loader2 } from 'lucide-react';
import { CompetitorSearchRow } from './components/CompetitorSearchRow';
import { useCompetitors } from '@/hooks/useCompetitors';

interface AddCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (competitor: any) => Promise<{ success: boolean; error?: string }>;
}

export function AddCompetitorModal({
  isOpen,
  onClose,
}: AddCompetitorModalProps) {
  const { showToast } = useToast();
  const { addCompetitorsBulk, previewCompetitor } = useCompetitors();

  const [rows, setRows] = useState<Array<{ platform: string; value: string }>>([
    { platform: 'instagram', value: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [prevStep, setPrevStep] = useState(false);
  const [previews, setPreviews] = useState<any[]>([]);

  const handleAddRow = () => {
    setRows((prev) => [...prev, { platform: 'instagram', value: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleValueChange = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index].value = value;
    setRows(newRows);
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const newRows = [...rows];
    newRows[index].platform = platform;
    setRows(newRows);
  };

  const getUrlFromRow = (row: { platform: string; value: string }) => {
    const val = row.value.trim().replace('@', '');
    if (val.startsWith('http')) return val;

    switch (row.platform) {
      case 'instagram':
        return `https://www.instagram.com/${val}/`;
      case 'tiktok':
        return `https://www.tiktok.com/@${val}`;
      case 'youtube':
        return `https://www.youtube.com/@${val}`;
      default:
        return val;
    }
  };

  const handleFetchPreviews = async () => {
    const validRows = rows.filter((r) => r.value.trim() !== '');
    if (validRows.length === 0) {
      showToast('Please enter at least one handle or URL', 'error');
      return;
    }

    setLoading(true);
    const results = await Promise.all(
      validRows.map(async (row) => {
        const url = getUrlFromRow(row);
        const res = await previewCompetitor(url);
        return res.success ? res.preview : null;
      }),
    );
    setPreviews(results.filter((r) => r !== null));
    setPrevStep(true);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const validUrls = rows
      .filter((r) => r.value.trim() !== '')
      .map((r) => getUrlFromRow(r));

    const result = await addCompetitorsBulk({
      handles: validUrls,
      tags: ['Watchlist'],
    });

    if (result?.success) {
      showToast(
        `${result.competitors.length} competitors added successfully!`,
        'success',
      );
      setRows([{ platform: 'instagram', value: '' }]);
      setPrevStep(false);
      setPreviews([]);
      onClose();
    } else {
      showToast(result?.error || 'Failed to add competitors', 'error');
    }
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prevStep ? 'Review Watchlist' : 'Build Your Watchlist'}
      maxWidth='2xl'
    >
      {!prevStep ? (
        <div className='space-y-6'>
          <div className='space-y-4 max-h-[400px]  pr-2 custom-scrollbar'>
            {rows.map((row, index) => (
              <CompetitorSearchRow
                key={index}
                platform={row.platform}
                value={row.value}
                onPlatformChange={(val) => handlePlatformChange(index, val)}
                onChange={(val) => handleValueChange(index, val)}
                onRemove={() => handleRemoveRow(index)}
                showRemove={rows.length > 1}
              />
            ))}
          </div>

          <button
            type='button'
            onClick={handleAddRow}
            className='flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 w-full justify-center border-dashed'
          >
            <Plus className='w-4 h-4' /> Add Another Channel
          </button>

          <div className='flex justify-end gap-3 pt-4 border-t border-border/50'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              disabled={loading || rows.every((r) => !r.value.trim())}
              onClick={handleFetchPreviews}
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
        </div>
      ) : (
        <div className='space-y-6'>
          <p className='text-sm text-muted-foreground'>
            We found {previews.length} channels. Review them below before adding
            to your watchlist.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
            {previews.map((preview, index) => (
              <div
                key={index}
                className='flex items-center gap-3 p-3 rounded-2xl bg-secondary/10 border border-border/50'
              >
                <img
                  src={preview.avatarUrl}
                  alt={preview.name}
                  className='w-12 h-12 rounded-xl object-cover border border-border/50'
                />
                <div className='flex-1 min-w-0'>
                  <h4 className='text-sm font-semibold truncate'>
                    {preview.name}
                  </h4>
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
                onClick={onClose}
                className='px-6 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={loading}
                onClick={handleSubmit}
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

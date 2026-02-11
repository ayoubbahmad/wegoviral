'use client';

import { Trash2, Search } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';

interface CompetitorSearchRowProps<T extends FieldValues> {
  control: Control<T>;
  platformName: Path<T>;
  valueName: Path<T>;
  onRemove: () => void;
  showRemove?: boolean;
}

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

export function CompetitorSearchRow<T extends FieldValues>({
  control,
  platformName,
  valueName,
  onRemove,
  showRemove = true,
}: CompetitorSearchRowProps<T>) {
  return (
    <div className='flex gap-3 items-start group'>
      <div className='w-40'>
        <FormSelect
          name={platformName}
          control={control}
          options={platforms}
          className='h-11'
        />
      </div>

      <div className='relative flex-1'>
        <FormInput
          name={valueName}
          control={control}
          placeholder='URL or username'
          className='h-11'
          leftIcon={<Search className='w-4 h-4 text-muted-foreground/50' />}
        />
      </div>
      {showRemove && (
        <button
          type='button'
          onClick={onRemove}
          className='mt-2.5 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      )}
    </div>
  );
}

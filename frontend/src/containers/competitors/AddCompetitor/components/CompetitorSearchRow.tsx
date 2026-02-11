'use client';

import { Search, Trash2 } from 'lucide-react';

interface CompetitorSearchRowProps {
  platform: string;
  value: string;
  onPlatformChange: (platform: string) => void;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
  showRemove?: boolean;
}

const platforms = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
];

export function CompetitorSearchRow({
  platform,
  value,
  onPlatformChange,
  onChange,
  onRemove,
  placeholder = 'URL or username',
  showRemove = true,
}: CompetitorSearchRowProps) {
  return (
    <div className='flex gap-3 items-center group'>
      <div className='w-40'>
        <select
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className='w-full px-3 py-2.5 rounded-xl border border-border bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold cursor-pointer'
        >
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50' />
        <input
          type='text'
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='w-full px-4 py-2.5 pl-10 rounded-xl border border-border bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm'
        />
      </div>
      {showRemove && (
        <button
          type='button'
          onClick={onRemove}
          className='p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      )}
    </div>
  );
}

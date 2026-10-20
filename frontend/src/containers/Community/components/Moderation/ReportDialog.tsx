'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import { REPORT_REASONS, ReportReason } from '@/types/communityFeed';
import { useReport } from '../../api';
import { Dialog } from './Dialog';
import { useT } from '@/i18n/provider';

interface ReportDialogProps {
  target: 'post' | 'comment';
  id: string;
  onClose: () => void;
}

export const ReportDialog = ({ target, id, onClose }: ReportDialogProps) => {
  const { showToast } = useToast();
  const t = useT();
  const report = useReport();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!reason) return;
    report.mutate(
      { target, id, reason, note: note.trim() || undefined },
      {
        onSuccess: () => {
          showToast(t('feed.report.thanks'));
          onClose();
        },
        onError: (error) => {
          showToast(error.message, 'error');
          onClose();
        },
      },
    );
  };

  return (
    <Dialog title={target === 'post' ? t('feed.report.titlePost') : t('feed.report.titleComment')} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('feed.report.intro')}</p>
        <div className="space-y-1.5" role="radiogroup">
          {REPORT_REASONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors',
                reason === option.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/30',
              )}
            >
              <input type="radio" name="report-reason" checked={reason === option.value} onChange={() => setReason(option.value)} className="accent-[var(--primary)]" />
              {t(`feed.reportReasons.${option.value}`)}
            </label>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t('feed.report.notePlaceholder')}
          maxLength={500}
          className="w-full min-h-[70px] rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!reason || report.isPending}>
            {report.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('feed.report.send')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

'use client';

import { Copy, UserPlus } from 'lucide-react';
import { Card } from '@/components/Card';
import { useToast } from '@/providers/Toast';
import { useReferral } from './api';
import { useT } from '@/i18n/provider';

/** Each member's personal invite link. People who join through it are approved right away. */
export function ReferralCard() {
  const t = useT();
  const { data } = useReferral();
  const { showToast } = useToast();
  if (!data) return null;
  const url = `${window.location.origin}/join/${data.code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('feed.referral.copied'));
    } catch {
      showToast(t('feed.referral.copyFailed'), 'error');
    }
  };

  return (
    <Card padding="sm" className="p-5 space-y-3">
      <h3 className="flex items-center gap-2 font-bold text-sm">
        <UserPlus className="w-4 h-4 text-primary" /> {t('feed.referral.title')}
      </h3>
      <p className="text-xs text-muted-foreground">
        {t('feed.referral.body')}
      </p>
      <button
        onClick={copy}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-secondary/20 px-3 py-2 text-start text-xs hover:bg-secondary/40"
      >
        <span className="truncate font-mono">{url.replace(/^https?:\/\//, '')}</span>
        <Copy className="w-3.5 h-3.5 shrink-0" />
      </button>
      {data.referralCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {t('feed.referral.joined', { count: data.referralCount })}
        </p>
      )}
    </Card>
  );
}

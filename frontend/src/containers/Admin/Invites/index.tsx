'use client';

import { useState } from 'react';
import { Copy, Link2, Loader2, Star } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/providers/Toast';
import { useCan } from '@/providers/Auth';
import { cn } from '@/lib/utils';
import { useCreateInvite, useInvites, useRevokeInvite } from '../api/joining';
import { InviteLink } from '../types';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const inviteUrl = (code: string) => `${window.location.origin}/join/${code}`;

const inviteState = (invite: InviteLink) => {
  if (invite.revokedAt) return { key: 'off' as const, active: false };
  if (invite.expiresAt && new Date(invite.expiresAt).getTime() < Date.now()) return { key: 'expired' as const, active: false };
  if (invite.maxUses !== null && invite.useCount >= invite.maxUses) return { key: 'limit' as const, active: false };
  return { key: 'active' as const, active: true };
};

export const AdminInvitesContainer = () => {
  const t = useT();
  const { data, isPending, error } = useInvites();

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/invite-links"
        title={t('admin.invites.title')}
        description={t('admin.invites.description')}
      />
      <CreateInviteForm />
      {isPending ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : data.length === 0 ? (
        <EmptyState icon={Link2} title={t('admin.invites.emptyTitle')} description={t('admin.invites.emptyBody')} />
      ) : (
        <div className="space-y-3">
          {data.map((invite) => (
            <InviteRow key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

const CreateInviteForm = () => {
  const t = useT();
  const { showToast } = useToast();
  const can = useCan();
  const create = useCreateInvite();
  const [label, setLabel] = useState('');
  const [specialMember, setSpecialMember] = useState(false);
  const [expires, setExpires] = useState('7');
  const [maxUses, setMaxUses] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    create.mutate(
      {
        label: label.trim(),
        autoApprove: true,
        specialMember,
        expiresInDays: expires === 'never' ? null : Number(expires),
        maxUses: maxUses ? Number(maxUses) : null,
      },
      {
        onSuccess: async (invite) => {
          setLabel('');
          setMaxUses('');
          try {
            await navigator.clipboard.writeText(inviteUrl(invite.code));
            showToast(t('admin.invites.createdCopied'));
          } catch {
            showToast(t('admin.invites.created'));
          }
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-bold">{t('admin.invites.newTitle')}</h2>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">{t('admin.invites.name')}</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t('admin.invites.namePlaceholder')} maxLength={100} className={inputClass} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">{t('admin.invites.expires')}</span>
            <Select
              aria-label={t('admin.invites.expires')}
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
              options={[
                ...[1, 7, 30, 90].map((days) => ({ value: String(days), label: t('admin.invites.inDays', { count: days }) })),
                { value: 'never', label: t('admin.invites.never') },
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">{t('admin.invites.maxUses')}</span>
            <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder={t('admin.invites.noLimit')} className={inputClass} />
          </label>
        </div>
        {can('members.exempt') && (
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={specialMember} onChange={(e) => setSpecialMember(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
            <span>
              <span className="font-semibold">{t('admin.invites.special')}</span>
              <span className="block text-xs text-muted-foreground">{t('admin.invites.specialHint')}</span>
            </span>
          </label>
        )}
        <Button type="submit" variant="primary" disabled={label.trim().length < 2 || create.isPending}>
          {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.invites.create')}
        </Button>
      </form>
    </Card>
  );
};

const InviteRow = ({ invite }: { invite: InviteLink }) => {
  const t = useT();
  const { showToast } = useToast();
  const revoke = useRevokeInvite();
  const state = inviteState(invite);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl(invite.code));
      showToast(t('admin.invites.copied'));
    } catch {
      showToast(t('admin.invites.copyFailed'), 'error');
    }
  };

  return (
    <Card padding="sm" className={cn('flex flex-col gap-3 md:flex-row md:items-center', !state.active && 'opacity-60')}>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-semibold">
          {invite.label}
          {invite.specialMember && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-500">
              <Star className="w-3 h-3" /> {t('admin.invites.specialTag')}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {invite.maxUses !== null
            ? t('admin.invites.usedOf', { state: t(`admin.invites.states.${state.key}`), count: invite.useCount, max: invite.maxUses })
            : t('admin.invites.used', { state: t(`admin.invites.states.${state.key}`), count: invite.useCount })}
          {invite.expiresAt ? t('admin.invites.expiresOn', { date: new Date(invite.expiresAt).toLocaleDateString(activeIntl()) }) : ''}
          {invite.createdBy ? t('admin.invites.by', { username: invite.createdBy.username }) : ''}
        </p>
      </div>
      <code className="truncate rounded-lg bg-secondary/40 px-3 py-1.5 text-xs">/join/{invite.code}</code>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copy} disabled={!state.active}>
          <Copy className="w-3.5 h-3.5" /> {t('admin.invites.copy')}
        </Button>
        {!invite.revokedAt && (
          <Button
            variant="ghost"
            size="sm"
            disabled={revoke.isPending}
            onClick={() => {
              if (!window.confirm(t('admin.invites.offConfirm', { name: invite.label }))) return;
              revoke.mutate(invite.id, {
                onSuccess: () => showToast(t('admin.invites.turnedOff')),
                onError: (error) => showToast(error.message, 'error'),
              });
            }}
          >
            {t('admin.invites.turnOff')}
          </Button>
        )}
      </div>
    </Card>
  );
};

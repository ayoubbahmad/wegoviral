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

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const inviteUrl = (code: string) => `${window.location.origin}/join/${code}`;

const inviteState = (invite: InviteLink) => {
  if (invite.revokedAt) return { label: 'Turned off', active: false };
  if (invite.expiresAt && new Date(invite.expiresAt).getTime() < Date.now()) return { label: 'Expired', active: false };
  if (invite.maxUses !== null && invite.useCount >= invite.maxUses) return { label: 'Limit reached', active: false };
  return { label: 'Active', active: true };
};

export const AdminInvitesContainer = () => {
  const { data, isPending, error } = useInvites();

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/invite-links"
        title="Invite links"
        description="Links that let people join without waiting for approval, e.g. for a campaign or special guests."
      />
      <CreateInviteForm />
      {isPending ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : data.length === 0 ? (
        <EmptyState icon={Link2} title="No invite links yet" description="Create one above and share it." />
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
            showToast('Invite link created and copied');
          } catch {
            showToast('Invite link created');
          }
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-bold">New invite link</h2>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Name (only staff see it)</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Instagram followers October" maxLength={100} className={inputClass} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Expires</span>
            <Select
              aria-label="Expires"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
              options={[
                { value: '1', label: 'In 1 day' },
                { value: '7', label: 'In 7 days' },
                { value: '30', label: 'In 30 days' },
                { value: '90', label: 'In 90 days' },
                { value: 'never', label: 'Never' },
              ]}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Max uses</span>
            <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="No limit" className={inputClass} />
          </label>
        </div>
        {can('members.exempt') && (
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={specialMember} onChange={(e) => setSpecialMember(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
            <span>
              <span className="font-semibold">Special members</span>
              <span className="block text-xs text-muted-foreground">
                People who join with this link skip approval, the guide and the first-posts review. For instructors, guests and partners.
              </span>
            </span>
          </label>
        )}
        <Button type="submit" variant="primary" disabled={label.trim().length < 2 || create.isPending}>
          {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create link'}
        </Button>
      </form>
    </Card>
  );
};

const InviteRow = ({ invite }: { invite: InviteLink }) => {
  const { showToast } = useToast();
  const revoke = useRevokeInvite();
  const state = inviteState(invite);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl(invite.code));
      showToast('Link copied');
    } catch {
      showToast('Could not copy the link', 'error');
    }
  };

  return (
    <Card padding="sm" className={cn('flex flex-col gap-3 md:flex-row md:items-center', !state.active && 'opacity-60')}>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-semibold">
          {invite.label}
          {invite.specialMember && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-500">
              <Star className="w-3 h-3" /> Special
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {state.label} · {invite.useCount}
          {invite.maxUses !== null ? ` / ${invite.maxUses}` : ''} used
          {invite.expiresAt ? ` · expires ${new Date(invite.expiresAt).toLocaleDateString()}` : ''}
          {invite.createdBy ? ` · by @${invite.createdBy.username}` : ''}
        </p>
      </div>
      <code className="truncate rounded-lg bg-secondary/40 px-3 py-1.5 text-xs">/join/{invite.code}</code>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copy} disabled={!state.active}>
          <Copy className="w-3.5 h-3.5" /> Copy
        </Button>
        {!invite.revokedAt && (
          <Button
            variant="ghost"
            size="sm"
            disabled={revoke.isPending}
            onClick={() => {
              if (!window.confirm(`Turn off "${invite.label}"? The link will stop working.`)) return;
              revoke.mutate(invite.id, {
                onSuccess: () => showToast('Invite link turned off'),
                onError: (error) => showToast(error.message, 'error'),
              });
            }}
          >
            Turn off
          </Button>
        )}
      </div>
    </Card>
  );
};

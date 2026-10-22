'use client';

import { useState } from 'react';
import { Crown, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { useToast } from '@/providers/Toast';
import { useDeleteTier, useSaveTier, useTiers } from '../api/moderation';
import { Tier } from '../types';
import { useT } from '@/i18n/provider';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

/** Membership tiers (Super Admin). Spaces and later courses can be limited to some tiers. */
export const AdminTiersContainer = () => {
  const t = useT();
  const { data, isPending, error } = useTiers();
  const [editing, setEditing] = useState<Tier | 'new' | null>(null);

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/tiers-and-access"
        title={t('admin.tiers.title')}
        description={t('admin.tiers.description')}
        actions={
          <Button variant="primary" onClick={() => setEditing('new')}>
            <Plus className="w-4 h-4" /> {t('admin.tiers.newTier')}
          </Button>
        }
      />
      {editing && <TierForm key={editing === 'new' ? 'new' : editing.id} tier={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}
      {isPending ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : (
        <Card padding="none">
          <ul className="divide-y divide-border/50">
            {data.map((tier) => (
              <TierRow key={tier.id} tier={tier} onEdit={() => setEditing(tier)} />
            ))}
          </ul>
        </Card>
      )}
    </PageContainer>
  );
};

const TierRow = ({ tier, onEdit }: { tier: Tier; onEdit: () => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const save = useSaveTier();
  const remove = useDeleteTier();
  return (
    <li className="flex items-center gap-3 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-semibold">
          {tier.name}
          {tier.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              <Crown className="w-3 h-3" /> {t('admin.tiers.default')}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {tier.description || t('admin.tiers.noDescription')} · {t('admin.tiers.members', { count: tier.memberCount })}
        </p>
      </div>
      {!tier.isDefault && (
        <Button
          variant="outline"
          size="sm"
          disabled={save.isPending}
          onClick={() =>
            window.confirm(t('admin.tiers.makeDefaultConfirm', { name: tier.name })) &&
            save.mutate({ id: tier.id, input: { isDefault: true } }, { onSuccess: () => showToast(t('admin.tiers.nowDefault', { name: tier.name })), onError: (e) => showToast(e.message, 'error') })
          }
        >
          {t('admin.tiers.makeDefault')}
        </Button>
      )}
      <button aria-label={t('admin.tiers.edit')} onClick={onEdit} className="p-2 rounded-lg hover:bg-secondary/50">
        <Pencil className="w-4 h-4" />
      </button>
      {!tier.isDefault && (
        <button
          aria-label={t('admin.tiers.delete')}
          onClick={() =>
            window.confirm(t('admin.tiers.deleteConfirm', { name: tier.name, count: tier.memberCount })) &&
            remove.mutate(tier.id, { onSuccess: () => showToast(t('admin.tiers.deleted')), onError: (e) => showToast(e.message, 'error') })
          }
          className="p-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </li>
  );
};

const TierForm = ({ tier, onDone }: { tier: Tier | null; onDone: () => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const save = useSaveTier();
  const [name, setName] = useState(tier?.name ?? '');
  const [description, setDescription] = useState(tier?.description ?? '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save.mutate(
      { id: tier?.id, input: { name: name.trim(), description: description.trim() } },
      {
        onSuccess: () => {
          showToast(tier ? t('admin.tiers.updated') : t('admin.tiers.created'));
          onDone();
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="font-bold">{tier ? t('admin.tiers.editTitle', { name: tier.name }) : t('admin.tiers.newTitle')}</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('admin.tiers.namePlaceholder')} maxLength={40} className={inputClass} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('admin.tiers.descriptionPlaceholder')} maxLength={200} className={inputClass} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={name.trim().length < 2 || save.isPending}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : tier ? t('common.save') : t('admin.tiers.create')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

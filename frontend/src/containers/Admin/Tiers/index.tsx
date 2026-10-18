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

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

/** Membership tiers (Super Admin). Spaces and later courses can be limited to some tiers. */
export const AdminTiersContainer = () => {
  const { data, isPending, error } = useTiers();
  const [editing, setEditing] = useState<Tier | 'new' | null>(null);

  return (
    <PageContainer>
      <PageHeader
        title="Tiers"
        description="Membership levels like Free and Pro. Limit spaces to some tiers in Admin → Spaces. Until payments are connected, assign tiers by hand in the member panel."
        actions={
          <Button variant="primary" onClick={() => setEditing('new')}>
            <Plus className="w-4 h-4" /> New tier
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
              <Crown className="w-3 h-3" /> Default
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {tier.description || 'No description'} · {tier.memberCount} member{tier.memberCount === 1 ? '' : 's'}
        </p>
      </div>
      {!tier.isDefault && (
        <Button
          variant="outline"
          size="sm"
          disabled={save.isPending}
          onClick={() =>
            window.confirm(`Make ${tier.name} the default? Members without a tier will count as ${tier.name}.`) &&
            save.mutate({ id: tier.id, input: { isDefault: true } }, { onSuccess: () => showToast(`${tier.name} is now the default`), onError: (e) => showToast(e.message, 'error') })
          }
        >
          Make default
        </Button>
      )}
      <button aria-label="Edit tier" onClick={onEdit} className="p-2 rounded-lg hover:bg-secondary/50">
        <Pencil className="w-4 h-4" />
      </button>
      {!tier.isDefault && (
        <button
          aria-label="Delete tier"
          onClick={() =>
            window.confirm(`Delete ${tier.name}? Its ${tier.memberCount} members move to the default tier, and spaces limited to it open to other tiers.`) &&
            remove.mutate(tier.id, { onSuccess: () => showToast('Tier deleted'), onError: (e) => showToast(e.message, 'error') })
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
          showToast(tier ? 'Tier updated' : 'Tier created');
          onDone();
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="font-bold">{tier ? `Edit ${tier.name}` : 'New tier'}</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name, e.g. Pro" maxLength={40} className={inputClass} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)" maxLength={200} className={inputClass} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={name.trim().length < 2 || save.isPending}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : tier ? 'Save' : 'Create tier'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

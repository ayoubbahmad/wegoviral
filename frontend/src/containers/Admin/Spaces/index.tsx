'use client';

import { useState } from 'react';
import { Archive, ArchiveRestore, ArrowDown, ArrowUp, Loader2, Lock, Pencil, Plus } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import { useAdminSpaces, useArchiveSpace, useReorderSpaces, useSaveSpace, useTiers } from '../api/moderation';
import { AccessEditor, summarizeAccess } from './AccessEditor';
import { AdminSpace, SpaceInput } from '../types';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

export const AdminSpacesContainer = () => {
  const { data, isPending, error } = useAdminSpaces();
  const [editing, setEditing] = useState<AdminSpace | 'new' | null>(null);

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/spaces"
        title="Spaces"
        description="The topics members post in. Archived spaces disappear from the feed filters and close to new posts; their posts stay."
        actions={
          <Button variant="primary" onClick={() => setEditing('new')}>
            <Plus className="w-4 h-4" /> New space
          </Button>
        }
      />
      {editing && (
        <SpaceForm key={editing === 'new' ? 'new' : editing.id} space={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />
      )}
      {isPending ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : (
        <SpaceList key={data.map((space) => `${space.id}:${space.position}:${space.archivedAt}`).join('|')} spaces={data} onEdit={setEditing} />
      )}
    </PageContainer>
  );
};

const SpaceList = ({ spaces, onEdit }: { spaces: AdminSpace[]; onEdit: (space: AdminSpace) => void }) => {
  const { showToast } = useToast();
  const reorder = useReorderSpaces();
  const archive = useArchiveSpace();
  const [active, setActive] = useState(spaces.filter((space) => !space.archivedAt));
  const archived = spaces.filter((space) => space.archivedAt);
  const orderChanged = active.map((s) => s.id).join('|') !== spaces.filter((s) => !s.archivedAt).map((s) => s.id).join('|');

  const move = (index: number, by: number) =>
    setActive((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(index + by, 0, item);
      return next;
    });

  const toggleArchive = (space: AdminSpace, archivedNow: boolean) => {
    if (archivedNow && !window.confirm(`Archive ${space.emoji} ${space.name}? Members won't be able to post in it anymore.`)) return;
    archive.mutate(
      { id: space.id, archived: archivedNow },
      {
        onSuccess: () => showToast(archivedNow ? 'Space archived' : 'Space is back'),
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <div className="space-y-6">
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-bold">Active spaces</h2>
          <Button
            variant="primary"
            size="sm"
            disabled={!orderChanged || reorder.isPending}
            onClick={() =>
              reorder.mutate(active.map((space) => space.id), {
                onSuccess: () => showToast('Order saved'),
                onError: (error) => showToast(error.message, 'error'),
              })
            }
          >
            {reorder.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save order'}
          </Button>
        </div>
        <ul className="divide-y divide-border/50">
          {active.map((space, index) => (
            <SpaceRow key={space.id} space={space}>
              <button aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button aria-label="Move down" disabled={index === active.length - 1} onClick={() => move(index, 1)} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button aria-label="Edit space" onClick={() => onEdit(space)} className="p-2 rounded-lg hover:bg-secondary/50">
                <Pencil className="w-4 h-4" />
              </button>
              <button aria-label="Archive space" onClick={() => toggleArchive(space, true)} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                <Archive className="w-4 h-4" />
              </button>
            </SpaceRow>
          ))}
        </ul>
      </Card>

      {archived.length > 0 && (
        <Card padding="none">
          <h2 className="border-b border-border px-5 py-3 font-bold">Archived</h2>
          <ul className="divide-y divide-border/50 opacity-70">
            {archived.map((space) => (
              <SpaceRow key={space.id} space={space}>
                <Button variant="outline" size="sm" onClick={() => toggleArchive(space, false)}>
                  <ArchiveRestore className="w-3.5 h-3.5" /> Bring back
                </Button>
              </SpaceRow>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

const SpaceRow = ({ space, children }: { space: AdminSpace; children: React.ReactNode }) => {
  const { data: tiers } = useTiers();
  const access = summarizeAccess(space.access, tiers);
  return (
  <li className="flex items-center gap-3 px-5 py-3">
    <span className="text-2xl" aria-hidden>{space.emoji}</span>
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-2 font-semibold">
        {space.name}
        {space.adminOnly && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <Lock className="w-3 h-3" /> Team only
          </span>
        )}
        {access && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
            <Lock className="w-3 h-3" /> {access}
          </span>
        )}
      </p>
      <p className="text-xs text-muted-foreground truncate">
        {space.description} · {space.postCount} post{space.postCount === 1 ? '' : 's'}
      </p>
    </div>
    <div className="flex items-center gap-1">{children}</div>
  </li>
  );
};

const SpaceForm = ({ space, onDone }: { space: AdminSpace | null; onDone: () => void }) => {
  const { showToast } = useToast();
  const save = useSaveSpace();
  const [input, setInput] = useState<SpaceInput>({
    name: space?.name ?? '',
    emoji: space?.emoji ?? '💬',
    description: space?.description ?? '',
    coverUrl: space?.coverUrl ?? '',
    adminOnly: space?.adminOnly ?? false,
  });
  const valid = input.name.trim().length >= 2 && input.emoji.trim() && input.description.trim().length >= 3;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save.mutate(
      { id: space?.id, input: { ...input, coverUrl: input.coverUrl?.trim() || '' } },
      {
        onSuccess: () => {
          showToast(space ? 'Space updated' : 'Space created');
          onDone();
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-bold">{space ? `Edit ${space.name}` : 'New space'}</h2>
        <div className="grid gap-3 md:grid-cols-[90px_1fr]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Emoji</span>
            <input value={input.emoji} onChange={(e) => setInput({ ...input, emoji: e.target.value })} maxLength={8} className={cn(inputClass, 'text-center text-xl')} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Name</span>
            <input value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value })} maxLength={40} placeholder="e.g. Brand Deals" className={inputClass} />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Description (shown when members open the space)</span>
          <input value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value })} maxLength={200} className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Cover image link (optional)</span>
          <input value={input.coverUrl ?? ''} onChange={(e) => setInput({ ...input, coverUrl: e.target.value })} placeholder="https://…" className={inputClass} />
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={input.adminOnly} onChange={(e) => setInput({ ...input, adminOnly: e.target.checked })} className="mt-0.5 accent-[var(--primary)]" />
          <span>
            <span className="font-semibold">Only the team can post</span>
            <span className="block text-xs text-muted-foreground">Members can read and comment, like Announcements.</span>
          </span>
        </label>
        {space && <AccessEditor space={space} />}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={!valid || save.isPending}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : space ? 'Save' : 'Create space'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

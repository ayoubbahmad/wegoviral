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
import { useT } from '@/i18n/provider';
import { LanguageTabs } from '@/components/LanguageTabs';
import { bindField, cleanTranslations, ContentLanguage, isTranslated } from '@/lib/translations';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

export const AdminSpacesContainer = () => {
  const t = useT();
  const { data, isPending, error } = useAdminSpaces();
  const [editing, setEditing] = useState<AdminSpace | 'new' | null>(null);

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/spaces"
        title={t('admin.spaces.title')}
        description={t('admin.spaces.description')}
        actions={
          <Button variant="primary" onClick={() => setEditing('new')}>
            <Plus className="w-4 h-4" /> {t('admin.spaces.newSpace')}
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
  const t = useT();
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
    if (archivedNow && !window.confirm(t('admin.spaces.archiveConfirm', { space: `${space.emoji} ${space.name}` }))) return;
    archive.mutate(
      { id: space.id, archived: archivedNow },
      {
        onSuccess: () => showToast(archivedNow ? t('admin.spaces.archived') : t('admin.spaces.back')),
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <div className="space-y-6">
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-bold">{t('admin.spaces.active')}</h2>
          <Button
            variant="primary"
            size="sm"
            disabled={!orderChanged || reorder.isPending}
            onClick={() =>
              reorder.mutate(active.map((space) => space.id), {
                onSuccess: () => showToast(t('admin.spaces.orderSaved')),
                onError: (error) => showToast(error.message, 'error'),
              })
            }
          >
            {reorder.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.spaces.saveOrder')}
          </Button>
        </div>
        <ul className="divide-y divide-border/50">
          {active.map((space, index) => (
            <SpaceRow key={space.id} space={space}>
              <button aria-label={t('admin.spaces.moveUp')} disabled={index === 0} onClick={() => move(index, -1)} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button aria-label={t('admin.spaces.moveDown')} disabled={index === active.length - 1} onClick={() => move(index, 1)} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button aria-label={t('admin.spaces.edit')} onClick={() => onEdit(space)} className="p-2 rounded-lg hover:bg-secondary/50">
                <Pencil className="w-4 h-4" />
              </button>
              <button aria-label={t('admin.spaces.archive')} onClick={() => toggleArchive(space, true)} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                <Archive className="w-4 h-4" />
              </button>
            </SpaceRow>
          ))}
        </ul>
      </Card>

      {archived.length > 0 && (
        <Card padding="none">
          <h2 className="border-b border-border px-5 py-3 font-bold">{t('admin.spaces.archivedTitle')}</h2>
          <ul className="divide-y divide-border/50 opacity-70">
            {archived.map((space) => (
              <SpaceRow key={space.id} space={space}>
                <Button variant="outline" size="sm" onClick={() => toggleArchive(space, false)}>
                  <ArchiveRestore className="w-3.5 h-3.5" /> {t('admin.spaces.bringBack')}
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
  const t = useT();
  const { data: tiers } = useTiers();
  const access = summarizeAccess(space.access, tiers, t);
  return (
  <li className="flex items-center gap-3 px-5 py-3">
    <span className="text-2xl" aria-hidden>{space.emoji}</span>
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-2 font-semibold">
        {space.name}
        {space.adminOnly && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            <Lock className="w-3 h-3" /> {t('admin.spaces.teamOnly')}
          </span>
        )}
        {access && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
            <Lock className="w-3 h-3" /> {access}
          </span>
        )}
      </p>
      <p className="text-xs text-muted-foreground truncate">
        {space.description} · {t('admin.spaces.postCount', { count: space.postCount })}
      </p>
    </div>
    <div className="flex items-center gap-1">{children}</div>
  </li>
  );
};

const SpaceForm = ({ space, onDone }: { space: AdminSpace | null; onDone: () => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const save = useSaveSpace();
  const [input, setInput] = useState<SpaceInput>({
    name: space?.name ?? '',
    emoji: space?.emoji ?? '💬',
    description: space?.description ?? '',
    coverUrl: space?.coverUrl ?? '',
    adminOnly: space?.adminOnly ?? false,
    translations: space?.translations ?? {},
  });
  const [language, setLanguage] = useState<ContentLanguage>('en');
  const field = bindField(input, setInput, language);
  const valid = input.name.trim().length >= 2 && input.emoji.trim() && input.description.trim().length >= 3;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save.mutate(
      { id: space?.id, input: { ...input, coverUrl: input.coverUrl?.trim() || '', translations: cleanTranslations(input.translations) } },
      {
        onSuccess: () => {
          showToast(space ? t('admin.spaces.updated') : t('admin.spaces.created'));
          onDone();
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-bold">{space ? t('admin.spaces.editTitle', { name: space.name }) : t('admin.spaces.newTitle')}</h2>
        <LanguageTabs value={language} onChange={setLanguage} isMissing={(lang) => !isTranslated(input, ['name', 'description'], lang)} />
        <div className="grid gap-3 md:grid-cols-[90px_1fr]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">{t('admin.spaces.emoji')}</span>
            <input value={input.emoji} onChange={(e) => setInput({ ...input, emoji: e.target.value })} maxLength={8} className={cn(inputClass, 'text-center text-xl')} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">{t('admin.spaces.name')}</span>
            <input {...field('name', t('admin.spaces.namePlaceholder'))} maxLength={40} className={inputClass} />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.spaces.descriptionLabel')}</span>
          <input {...field('description')} maxLength={200} className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.spaces.cover')}</span>
          <input value={input.coverUrl ?? ''} onChange={(e) => setInput({ ...input, coverUrl: e.target.value })} placeholder="https://…" className={inputClass} />
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={input.adminOnly} onChange={(e) => setInput({ ...input, adminOnly: e.target.checked })} className="mt-0.5 accent-[var(--primary)]" />
          <span>
            <span className="font-semibold">{t('admin.spaces.onlyTeam')}</span>
            <span className="block text-xs text-muted-foreground">{t('admin.spaces.onlyTeamHint')}</span>
          </span>
        </label>
        {space && <AccessEditor space={space} />}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={!valid || save.isPending}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : space ? t('common.save') : t('admin.spaces.create')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

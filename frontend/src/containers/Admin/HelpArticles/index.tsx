'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, ExternalLink, Loader2, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { Textarea } from '@/components/Textarea';
import { LightMarkdown } from '@/components/LightMarkdown';
import { useToast } from '@/providers/Toast';
import { ROLE_LABELS, UserRole } from '@/lib/roles';
import { cn } from '@/lib/utils';
import {
  HelpArticle,
  HelpArticleSummary,
  HelpSpaceId,
  useDeleteArticle,
  useHelpArticle,
  useManagedArticles,
  useReorderArticles,
  useSaveArticle,
} from '@/containers/Help/api';

const SPACES: { id: HelpSpaceId; label: string }[] = [
  { id: 'community', label: 'Community' },
  { id: 'creator', label: 'Creator Space' },
  { id: 'admin', label: 'Admin (team)' },
];

const AUDIENCES: { value: UserRole; label: string }[] = [
  { value: 'MEMBER', label: 'Everyone' },
  { value: 'INSTRUCTOR', label: 'Instructors and the team' },
  { value: 'MODERATOR', label: 'Moderators and up' },
  { value: 'ADMIN', label: 'Admins and up' },
  { value: 'SUPER_ADMIN', label: 'Super Admins only' },
];

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

/** Admins write the help center: one list per space, ordered, with drafts. */
export const AdminHelpArticlesContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const space = (SPACES.find((option) => option.id === params.get('space'))?.id ?? 'community') as HelpSpaceId;
  const editing = params.get('edit');
  const { data: articles = [], isPending, error } = useManagedArticles(space);

  const go = (next: { space?: HelpSpaceId; edit?: string | null }) => {
    const query = new URLSearchParams({ space: next.space ?? space });
    const edit = next.edit === undefined ? editing : next.edit;
    if (edit) query.set('edit', edit);
    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Help articles"
        description="The help center members see from the Help link in each space. Each article has an audience: that role and everyone above it."
        actions={
          <Button variant="primary" onClick={() => go({ edit: 'new' })}>
            <Plus className="w-4 h-4" /> New article
          </Button>
        }
      />
      <div role="tablist" aria-label="Space" className="flex gap-4 border-b border-border text-sm font-semibold">
        {SPACES.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={space === option.id}
            onClick={() => go({ space: option.id, edit: null })}
            className={cn('-mb-px border-b-2 pb-2 transition-colors', space === option.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        {isPending ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : error ? (
          <p className="text-sm text-muted-foreground">{error.message}</p>
        ) : (
          <ArticleList space={space} articles={articles} selectedId={editing} onSelect={(id) => go({ edit: id })} />
        )}
        <div className="min-w-0">
          {editing === 'new' ? (
            <ArticleForm key={`new-${space}`} space={space} article={null} sections={[...new Set(articles.map((a) => a.category))]} onDone={(id) => go({ edit: id })} />
          ) : editing ? (
            <EditLoader key={editing} space={space} summary={articles.find((a) => a.id === editing)} sections={[...new Set(articles.map((a) => a.category))]} onDone={(id) => go({ edit: id })} />
          ) : (
            <Card className="text-sm text-muted-foreground">Select an article to edit it, or write a new one.</Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

const ArticleList = ({ space, articles, selectedId, onSelect }: { space: HelpSpaceId; articles: HelpArticleSummary[]; selectedId: string | null; onSelect: (id: string) => void }) => {
  const { showToast } = useToast();
  const reorder = useReorderArticles();
  const move = (index: number, direction: -1 | 1) => {
    const ids = articles.map((a) => a.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    reorder.mutate(ids, { onError: (e) => showToast(e.message, 'error') });
  };
  if (articles.length === 0) return <Card className="text-sm text-muted-foreground">No articles in this space yet.</Card>;
  return (
    <Card padding="none" className="h-fit">
      <ul className="divide-y divide-border/50">
        {articles.map((article, index) => (
          <li key={article.id} className={cn('flex items-center gap-2 px-3 py-2', selectedId === article.id && 'bg-primary/5')}>
            <button onClick={() => onSelect(article.id)} className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold">{article.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {article.category} · {AUDIENCES.find((a) => a.value === article.audience)?.label}
                {!article.published && ' · draft'}
              </p>
            </button>
            {!article.published && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase">Draft</span>}
            <button aria-label={`Move ${article.title} up`} disabled={index === 0 || reorder.isPending} onClick={() => move(index, -1)} className="rounded p-1 text-muted-foreground hover:bg-secondary/60 disabled:opacity-30">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button aria-label={`Move ${article.title} down`} disabled={index === articles.length - 1 || reorder.isPending} onClick={() => move(index, 1)} className="rounded p-1 text-muted-foreground hover:bg-secondary/60 disabled:opacity-30">
              <ChevronDown className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        Articles are listed by section in this order. <Link href={`/${space}/help`} className="font-semibold hover:text-foreground">Open the help center</Link>
      </p>
    </Card>
  );
};

const EditLoader = ({ space, summary, sections, onDone }: { space: HelpSpaceId; summary?: HelpArticleSummary; sections: string[]; onDone: (id: string | null) => void }) => {
  const { data, isPending } = useHelpArticle(summary?.slug ?? null);
  if (!summary) return <Card className="text-sm text-muted-foreground">This article isn&apos;t in this space.</Card>;
  if (isPending || !data) return <Skeleton className="h-96 rounded-2xl" />;
  return <ArticleForm space={space} article={data} sections={sections} onDone={onDone} />;
};

const ArticleForm = ({ space, article, sections, onDone }: { space: HelpSpaceId; article: HelpArticle | null; sections: string[]; onDone: (id: string | null) => void }) => {
  const { showToast } = useToast();
  const save = useSaveArticle();
  const remove = useDeleteArticle();
  const [form, setForm] = useState({
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    category: article?.category ?? sections[0] ?? '',
    audience: (article?.audience ?? 'MEMBER') as UserRole,
    summary: article?.summary ?? '',
    body: article?.body ?? '',
    published: article?.published ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [preview, setPreview] = useState(false);
  const update = (change: Partial<typeof form>) => setForm((current) => ({ ...current, ...change }));
  const valid = form.title.trim().length >= 3 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug) && form.slug.length >= 3 && form.category.trim().length >= 2;

  const handleSave = (published = form.published) =>
    save.mutate(
      {
        id: article?.id,
        input: {
          ...form,
          title: form.title.trim(),
          category: form.category.trim(),
          summary: form.summary.trim(),
          published,
          ...(article ? {} : { space: space.toUpperCase() as HelpArticle['space'] }),
        },
      },
      {
        onSuccess: (saved) => {
          update({ published });
          showToast(published && !article?.published ? 'Article published' : 'Article saved');
          onDone(saved.id);
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">{article ? 'Edit article' : 'New article'}</h2>
        <div className="flex items-center gap-1">
          {article?.published && (
            <Link href={`/${space}/help/${article.slug}`} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50" aria-label="Open the article">
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          {article && (
            <button
              aria-label="Delete article"
              disabled={remove.isPending}
              onClick={() =>
                window.confirm(`Delete “${article.title}”?`) &&
                remove.mutate(article.id, {
                  onSuccess: () => {
                    showToast('Article deleted');
                    onDone(null);
                  },
                  onError: (e) => showToast(e.message, 'error'),
                })
              }
              className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-muted-foreground">Title</span>
          <input
            value={form.title}
            maxLength={120}
            onChange={(e) => update({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
            className={inputClass}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Link</span>
          <input
            value={form.slug}
            maxLength={80}
            onChange={(e) => {
              setSlugTouched(true);
              update({ slug: e.target.value.toLowerCase() });
            }}
            className={inputClass}
          />
          <span className="block truncate text-xs text-muted-foreground">/{space}/help/{form.slug || '…'}</span>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Section</span>
          <input list="help-sections" value={form.category} maxLength={60} onChange={(e) => update({ category: e.target.value })} placeholder="e.g. Getting started" className={inputClass} />
          <datalist id="help-sections">
            {sections.map((section) => (
              <option key={section} value={section} />
            ))}
          </datalist>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Who sees it</span>
          <Select aria-label="Who sees it" value={form.audience} onChange={(e) => update({ audience: e.target.value as UserRole })} options={AUDIENCES} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Summary</span>
          <input value={form.summary} maxLength={300} onChange={(e) => update({ summary: e.target.value })} placeholder="One line shown in the list" className={inputClass} />
        </label>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Article</span>
          <div role="group" aria-label="Editor mode" className="flex gap-1">
            {[false, true].map((mode) => (
              <button
                key={String(mode)}
                aria-pressed={preview === mode}
                onClick={() => setPreview(mode)}
                className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', preview === mode ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {mode ? 'Preview' : 'Write'}
              </button>
            ))}
          </div>
        </div>
        {preview ? (
          <div className="min-h-[320px] rounded-lg border border-border p-4">
            <LightMarkdown source={form.body || 'Nothing yet.'} />
          </div>
        ) : (
          <Textarea value={form.body} maxLength={50000} onChange={(e) => update({ body: e.target.value })} className="min-h-[320px] font-mono text-xs" />
        )}
        <p className="text-xs text-muted-foreground">
          Formatting: <code>## Heading</code>, lists with <code>-</code> or <code>1.</code>, <code>**bold**</code>, <code>[link](/community/help/…)</code>.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          {form.published ? 'Published' : 'Draft: only admins can see it'} · visible to {ROLE_LABELS[form.audience].toLowerCase()}s{form.audience === 'SUPER_ADMIN' ? '' : ' and up'}
        </span>
        <div className="flex gap-2">
          {form.published ? (
            <Button variant="ghost" size="sm" disabled={!valid || save.isPending} onClick={() => handleSave(false)}>Unpublish</Button>
          ) : (
            <Button variant="outline" size="sm" disabled={!valid || save.isPending} onClick={() => handleSave(true)}>Save & publish</Button>
          )}
          <Button variant="primary" size="sm" disabled={!valid || save.isPending} onClick={() => handleSave()}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

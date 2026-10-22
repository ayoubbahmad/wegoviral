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
import type { UserRole } from '@/lib/roles';
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
import { useT } from '@/i18n/provider';
import { LanguageTabs } from '@/components/LanguageTabs';
import { bindField, cleanTranslations, ContentLanguage, isTranslated, readField } from '@/lib/translations';

const SPACES: { id: HelpSpaceId }[] = [{ id: 'community' }, { id: 'creator' }, { id: 'admin' }];

const AUDIENCES: UserRole[] = ['MEMBER', 'INSTRUCTOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];

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
  const t = useT();
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
        title={t('admin.helpPage.title')}
        description={t('admin.helpPage.description')}
        actions={
          <Button variant="primary" onClick={() => go({ edit: 'new' })}>
            <Plus className="w-4 h-4" /> {t('admin.helpPage.newArticle')}
          </Button>
        }
      />
      <div role="tablist" aria-label={t('admin.helpPage.spaceLabel')} className="flex gap-4 border-b border-border text-sm font-semibold">
        {SPACES.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={space === option.id}
            onClick={() => go({ space: option.id, edit: null })}
            className={cn('-mb-px border-b-2 pb-2 transition-colors', space === option.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
          >
            {t(`admin.helpPage.spaces.${option.id}`)}
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
            <Card className="text-sm text-muted-foreground">{t('admin.helpPage.selectArticle')}</Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

const ArticleList = ({ space, articles, selectedId, onSelect }: { space: HelpSpaceId; articles: HelpArticleSummary[]; selectedId: string | null; onSelect: (id: string) => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const reorder = useReorderArticles();
  const move = (index: number, direction: -1 | 1) => {
    const ids = articles.map((a) => a.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    reorder.mutate(ids, { onError: (e) => showToast(e.message, 'error') });
  };
  if (articles.length === 0) return <Card className="text-sm text-muted-foreground">{t('admin.helpPage.noArticles')}</Card>;
  return (
    <Card padding="none" className="h-fit">
      <ul className="divide-y divide-border/50">
        {articles.map((article, index) => (
          <li key={article.id} className={cn('flex items-center gap-2 px-3 py-2', selectedId === article.id && 'bg-primary/5')}>
            <button onClick={() => onSelect(article.id)} className="min-w-0 flex-1 text-start">
              <p className="truncate text-sm font-semibold">{article.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {article.category} · {t(`admin.helpPage.audiences.${article.audience}`)}
                {!article.published && t('admin.helpPage.draftSuffix')}
              </p>
            </button>
            {!article.published && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase">{t('admin.helpPage.draft')}</span>}
            <button aria-label={t('admin.helpPage.moveUp', { title: article.title })} disabled={index === 0 || reorder.isPending} onClick={() => move(index, -1)} className="rounded p-1 text-muted-foreground hover:bg-secondary/60 disabled:opacity-30">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button aria-label={t('admin.helpPage.moveDown', { title: article.title })} disabled={index === articles.length - 1 || reorder.isPending} onClick={() => move(index, 1)} className="rounded p-1 text-muted-foreground hover:bg-secondary/60 disabled:opacity-30">
              <ChevronDown className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        {t('admin.helpPage.orderNote')} <Link href={`/${space}/help`} className="font-semibold hover:text-foreground">{t('admin.helpPage.openCenter')}</Link>
      </p>
    </Card>
  );
};

const EditLoader = ({ space, summary, sections, onDone }: { space: HelpSpaceId; summary?: HelpArticleSummary; sections: string[]; onDone: (id: string | null) => void }) => {
  const t = useT();
  const { data, isPending } = useHelpArticle(summary?.slug ?? null, { forEditing: true });
  if (!summary) return <Card className="text-sm text-muted-foreground">{t('admin.helpPage.notInSpace')}</Card>;
  if (isPending || !data) return <Skeleton className="h-96 rounded-2xl" />;
  return <ArticleForm space={space} article={data} sections={sections} onDone={onDone} />;
};

const ArticleForm = ({ space, article, sections, onDone }: { space: HelpSpaceId; article: HelpArticle | null; sections: string[]; onDone: (id: string | null) => void }) => {
  const t = useT();
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
    translations: article?.translations ?? {},
  });
  const [language, setLanguage] = useState<ContentLanguage>('en');
  const field = bindField(form, setForm, language);
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
          translations: cleanTranslations(form.translations),
          published,
          ...(article ? {} : { space: space.toUpperCase() as HelpArticle['space'] }),
        },
      },
      {
        onSuccess: (saved) => {
          update({ published });
          showToast(published && !article?.published ? t('admin.helpPage.published') : t('admin.helpPage.saved'));
          onDone(saved.id);
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">{article ? t('admin.helpPage.editTitle') : t('admin.helpPage.newTitle')}</h2>
        <div className="flex items-center gap-1">
          {article?.published && (
            <Link href={`/${space}/help/${article.slug}`} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50" aria-label={t('admin.helpPage.open')}>
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          {article && (
            <button
              aria-label={t('admin.helpPage.delete')}
              disabled={remove.isPending}
              onClick={() =>
                window.confirm(t('admin.helpPage.deleteConfirm', { title: article.title })) &&
                remove.mutate(article.id, {
                  onSuccess: () => {
                    showToast(t('admin.helpPage.deleted'));
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

      <LanguageTabs value={language} onChange={setLanguage} isMissing={(lang) => !isTranslated(form, ['title', 'category', 'summary', 'body'], lang)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.helpPage.articleTitle')}</span>
          {language === 'en' ? (
            <input
              value={form.title}
              maxLength={120}
              onChange={(e) => update({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
              className={inputClass}
            />
          ) : (
            <input {...field('title')} maxLength={120} className={inputClass} />
          )}
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.helpPage.link')}</span>
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
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.helpPage.section')}</span>
          <input list={language === 'en' ? 'help-sections' : undefined} {...field('category', t('admin.helpPage.sectionPlaceholder'))} maxLength={60} className={inputClass} />
          <datalist id="help-sections">
            {sections.map((section) => (
              <option key={section} value={section} />
            ))}
          </datalist>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.helpPage.whoSees')}</span>
          <Select aria-label={t('admin.helpPage.whoSees')} value={form.audience} onChange={(e) => update({ audience: e.target.value as UserRole })} options={AUDIENCES.map((value) => ({ value, label: t(`admin.helpPage.audiences.${value}`) }))} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.helpPage.summary')}</span>
          <input {...field('summary', t('admin.helpPage.summaryPlaceholder'))} maxLength={300} className={inputClass} />
        </label>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.helpPage.article')}</span>
          <div role="group" aria-label={t('admin.helpPage.editorMode')} className="flex gap-1">
            {[false, true].map((mode) => (
              <button
                key={String(mode)}
                aria-pressed={preview === mode}
                onClick={() => setPreview(mode)}
                className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', preview === mode ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {mode ? t('admin.helpPage.preview') : t('admin.helpPage.write')}
              </button>
            ))}
          </div>
        </div>
        {preview ? (
          <div className="min-h-[320px] rounded-lg border border-border p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <LightMarkdown source={readField(form, 'body', language) || form.body || t('admin.helpPage.nothingYet')} />
          </div>
        ) : (
          <Textarea {...field('body')} maxLength={50000} className="min-h-[320px] font-mono text-xs" />
        )}
        <p className="text-xs text-muted-foreground">
          {t('admin.helpPage.formatting')} <code>## Heading</code>, lists with <code>-</code> or <code>1.</code>, <code>**bold**</code>, <code>[link](/community/help/…)</code>.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">
          {form.published ? t('admin.helpPage.statusPublished') : t('admin.helpPage.statusDraft')}
          {t(form.audience === 'SUPER_ADMIN' ? 'admin.helpPage.visibleToOnly' : 'admin.helpPage.visibleTo', { role: t(`common.roles.${form.audience}`).toLowerCase() })}
        </span>
        <div className="flex gap-2">
          {form.published ? (
            <Button variant="ghost" size="sm" disabled={!valid || save.isPending} onClick={() => handleSave(false)}>{t('admin.helpPage.unpublish')}</Button>
          ) : (
            <Button variant="outline" size="sm" disabled={!valid || save.isPending} onClick={() => handleSave(true)}>{t('admin.helpPage.savePublish')}</Button>
          )}
          <Button variant="primary" size="sm" disabled={!valid || save.isPending} onClick={() => handleSave()}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.save')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

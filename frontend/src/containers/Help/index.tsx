'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight, LifeBuoy, Pencil, Search } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { LightMarkdown } from '@/components/LightMarkdown';
import { useCan } from '@/providers/Auth';
import { ROLE_LABELS } from '@/lib/roles';
import { HelpArticleSummary, HelpSpaceId, useHelpArticle, useHelpArticles } from './api';

export const HELP_TITLES: Record<HelpSpaceId, { title: string; description: string }> = {
  community: { title: 'Community help', description: 'How the community works: joining, posting, events, courses, challenges and points.' },
  creator: { title: 'Creator Space help', description: 'How to use your personal creator tools.' },
  admin: { title: 'Team guides', description: 'How to run the community, for each role on the team.' },
};

/** Groups articles by section, keeping the order the team set. */
const bySection = (articles: HelpArticleSummary[]) => {
  const sections = new Map<string, HelpArticleSummary[]>();
  for (const article of articles) sections.set(article.category, [...(sections.get(article.category) ?? []), article]);
  return [...sections.entries()];
};

export const HelpCenter = ({ space }: { space: HelpSpaceId }) => {
  const [search, setSearch] = useState('');
  const query = search.trim().length >= 2 ? search.trim() : '';
  const { data: articles = [], isPending, error } = useHelpArticles(space, query);
  const { title, description } = HELP_TITLES[space];

  return (
    <PageContainer>
      <PageHeader title={title} description={description} />
      <label className="relative block max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search the help articles"
          aria-label="Search the help articles"
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </label>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : articles.length === 0 ? (
        <EmptyState icon={LifeBuoy} title={query ? `Nothing found for “${query}”` : 'No articles here yet'} description={query ? 'Try another word.' : undefined} />
      ) : query ? (
        <Card padding="none">
          <ul className="divide-y divide-border/50">
            {articles.map((article) => (
              <ArticleRow key={article.id} space={space} article={article} showSection />
            ))}
          </ul>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bySection(articles).map(([section, items]) => (
            <Card key={section} padding="none">
              <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{section}</p>
              <ul className="p-2">
                {items.map((article) => (
                  <ArticleRow key={article.id} space={space} article={article} />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

const ArticleRow = ({ space, article, showSection }: { space: HelpSpaceId; article: HelpArticleSummary; showSection?: boolean }) => (
  <li>
    <Link href={`/${space}/help/${article.slug}`} className="group flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-secondary/40">
      <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold group-hover:text-primary">{article.title}</p>
        {article.summary && <p className="line-clamp-1 text-xs text-muted-foreground">{showSection ? `${article.category} · ` : ''}{article.summary}</p>}
      </div>
      {article.audience !== 'MEMBER' && (
        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {ROLE_LABELS[article.audience]}s
        </span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  </li>
);

export const HelpArticlePage = ({ space, slug }: { space: HelpSpaceId; slug: string }) => {
  const can = useCan();
  const { data: article, isPending, error } = useHelpArticle(slug);
  return (
    <PageContainer>
      <Link href={`/${space}/help`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {HELP_TITLES[space].title}
      </Link>
      {isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : error ? (
        <EmptyState icon={LifeBuoy} title="Article not found" description="It may have moved, or it isn't meant for your role." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <Card className="min-w-0 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {article.category}
                {article.audience !== 'MEMBER' && ` · for ${ROLE_LABELS[article.audience].toLowerCase()}s and up`}
                {!article.published && ' · draft'}
              </p>
              <h1 className="text-2xl font-bold tracking-tight">{article.title}</h1>
              {article.summary && <p className="text-muted-foreground">{article.summary}</p>}
            </div>
            <LightMarkdown source={article.body} />
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
              {can('help.manage') && (
                <Link href={`/admin/help-articles?space=${article.space.toLowerCase()}&edit=${article.id}`} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" /> Edit this article
                </Link>
              )}
            </div>
          </Card>
          {article.related.length > 0 && (
            <Card padding="none" className="h-fit">
              <p className="px-5 pt-4 text-sm font-bold">More in {article.category}</p>
              <ul className="p-2">
                {article.related.map((related) => (
                  <li key={related.slug}>
                    <Link href={`/${space}/help/${related.slug}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary/40">
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </PageContainer>
  );
};

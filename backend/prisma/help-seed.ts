/**
 * Adds the starter help articles (prisma/help-articles.ts) that don't exist
 * yet, published. Existing articles are left alone, so edits made in the app
 * are never lost. Safe to run again.
 *
 *   yarn help:seed
 */
import { prisma } from '../src/lib/prisma';
import { HELP_ARTICLES } from './help-articles';
import { HELP_ARTICLES_FR } from './help-articles.fr';
import { HELP_ARTICLES_AR } from './help-articles.ar';

async function main() {
  const existing = new Set((await prisma.helpArticle.findMany({ select: { slug: true } })).map((article) => article.slug));
  const positions = new Map<string, number>();
  let added = 0;
  for (const article of HELP_ARTICLES) {
    const position = positions.get(article.space) ?? 0;
    positions.set(article.space, position + 1);
    if (existing.has(article.slug)) continue;
    const translations = { fr: HELP_ARTICLES_FR[article.slug], ar: HELP_ARTICLES_AR[article.slug] };
    await prisma.helpArticle.create({ data: { ...article, audience: article.audience ?? 'MEMBER', published: true, position, translations } });
    added++;
  }
  console.log(`Added ${added} help articles (${HELP_ARTICLES.length - added} already there)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

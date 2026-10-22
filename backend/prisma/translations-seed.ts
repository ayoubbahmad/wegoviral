/**
 * Adds the French and Arabic versions of the starter content (Phase 12c): spaces, badges, levels
 * and help articles. Only records with no translations yet, whose English is still the text that was
 * translated, are touched, so the team's own edits are never overwritten. Safe to run again.
 *
 *   yarn translations:seed
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { BADGE_TRANSLATIONS, LEVEL_TRANSLATIONS, SeedTranslation, SPACE_TRANSLATIONS } from './content-translations';
import { HELP_ARTICLES } from './help-articles';
import { HELP_ARTICLES_FR } from './help-articles.fr';
import { HELP_ARTICLES_AR } from './help-articles.ar';

const isEmpty = (value: Prisma.JsonValue) => !value || (typeof value === 'object' && Object.keys(value).length === 0);
const sameEnglish = (record: Record<string, unknown>, en: Record<string, string>) =>
  Object.entries(en).every(([field, text]) => record[field] === text);

async function main() {
  let updated = 0;
  let skipped = 0;
  const apply = async (record: Record<string, unknown> & { translations: Prisma.JsonValue }, seed: SeedTranslation | undefined, write: (translations: object) => Promise<unknown>) => {
    if (!seed || !isEmpty(record.translations)) return;
    if (!sameEnglish(record, seed.en)) {
      skipped++;
      return;
    }
    await write({ fr: seed.fr, ar: seed.ar });
    updated++;
  };

  for (const space of await prisma.communitySpace.findMany()) {
    await apply(space, SPACE_TRANSLATIONS[space.id], (translations) => prisma.communitySpace.update({ where: { id: space.id }, data: { translations } }));
  }
  for (const badge of await prisma.badge.findMany()) {
    await apply(badge, BADGE_TRANSLATIONS[badge.id], (translations) => prisma.badge.update({ where: { id: badge.id }, data: { translations } }));
  }
  for (const level of await prisma.level.findMany()) {
    await apply(level, LEVEL_TRANSLATIONS[level.level], (translations) => prisma.level.update({ where: { level: level.level }, data: { translations } }));
  }
  for (const article of await prisma.helpArticle.findMany()) {
    const seed = HELP_ARTICLES.find((item) => item.slug === article.slug);
    const fr = HELP_ARTICLES_FR[article.slug];
    const ar = HELP_ARTICLES_AR[article.slug];
    if (!seed || !fr || !ar) continue;
    // The title identifies the version; bodies get small fixes over time
    await apply(article, { en: { title: seed.title }, fr: { ...fr }, ar: { ...ar } }, (translations) =>
      prisma.helpArticle.update({ where: { id: article.id }, data: { translations } }),
    );
  }
  console.log(`Translated ${updated} records (${skipped} skipped because their English was edited)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

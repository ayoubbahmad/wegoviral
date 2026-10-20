/**
 * Help center (docs/ADMIN_ROADMAP.md, Phase 11): articles per space, each for
 * an audience (a role and everyone above it). Members only ever receive the
 * articles meant for them; admins write and publish them.
 */
import { HelpSpace, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { can, ROLE_RANK } from '../../lib/permissions';
import { CreateArticleInput, HelpError, UpdateArticleInput } from './model';

interface Viewer {
  id: string;
  role: UserRole;
}

/** The roles whose articles this viewer may read: their own and every role below. */
const audiencesFor = (role: UserRole) => (Object.keys(ROLE_RANK) as UserRole[]).filter((r) => ROLE_RANK[r] <= ROLE_RANK[role]);

const visibleTo = (viewer: Viewer): Prisma.HelpArticleWhereInput => ({ published: true, audience: { in: audiencesFor(viewer.role) } });

const listSelect = { id: true, slug: true, space: true, audience: true, category: true, title: true, summary: true, position: true, updatedAt: true } satisfies Prisma.HelpArticleSelect;

/** The articles of one space, in order; with a search, only matching ones. */
export async function listArticles(viewer: Viewer, space: HelpSpace, q?: string) {
  const search: Prisma.HelpArticleWhereInput = q
    ? { OR: ['title', 'summary', 'body', 'category'].map((field) => ({ [field]: { contains: q, mode: 'insensitive' } })) }
    : {};
  return prisma.helpArticle.findMany({
    where: { space, ...visibleTo(viewer), ...search },
    orderBy: [{ position: 'asc' }, { title: 'asc' }],
    select: listSelect,
  });
}

export async function getArticle(viewer: Viewer, slug: string) {
  const article = await prisma.helpArticle.findFirst({
    where: { slug, ...(can(viewer.role, 'help.manage') ? {} : visibleTo(viewer)) },
    include: { updatedBy: { select: { username: true, name: true } } },
  });
  if (!article) throw new HelpError(404, 'Article not found');
  // Other articles in the same section, for "Related"
  const related = await prisma.helpArticle.findMany({
    where: { space: article.space, category: article.category, id: { not: article.id }, ...visibleTo(viewer) },
    orderBy: { position: 'asc' },
    take: 5,
    select: { slug: true, title: true },
  });
  return { ...article, related };
}

// ─── Writing ─────────────────────────────────────────────────────────────────

function assertManager(viewer: Viewer) {
  if (!can(viewer.role, 'help.manage')) throw new HelpError(403, 'Only admins can edit the help center');
}

export async function listAllArticles(viewer: Viewer, space: HelpSpace) {
  assertManager(viewer);
  return prisma.helpArticle.findMany({ where: { space }, orderBy: [{ position: 'asc' }, { title: 'asc' }], select: { ...listSelect, published: true } });
}

const uniqueSlug = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002' ? new HelpError(409, 'Another article already uses this link') : error;

export async function createArticle(viewer: Viewer, input: CreateArticleInput) {
  assertManager(viewer);
  const last = await prisma.helpArticle.aggregate({ where: { space: input.space }, _max: { position: true } });
  const article = await prisma.helpArticle
    .create({ data: { ...input, position: (last._max.position ?? -1) + 1, updatedById: viewer.id } })
    .catch((error) => {
      throw uniqueSlug(error);
    });
  await logActivity({ actorId: viewer.id, action: 'help.created', targetType: 'help', targetId: article.id, targetLabel: article.title });
  return article;
}

export async function updateArticle(viewer: Viewer, id: string, input: UpdateArticleInput) {
  assertManager(viewer);
  const current = await prisma.helpArticle.findUnique({ where: { id } });
  if (!current) throw new HelpError(404, 'Article not found');
  const article = await prisma.helpArticle.update({ where: { id }, data: { ...input, updatedById: viewer.id } }).catch((error) => {
    throw uniqueSlug(error);
  });
  const action = input.published === true && !current.published ? 'help.published' : input.published === false && current.published ? 'help.unpublished' : 'help.updated';
  await logActivity({ actorId: viewer.id, action, targetType: 'help', targetId: id, targetLabel: article.title });
  return article;
}

export async function deleteArticle(viewer: Viewer, id: string) {
  assertManager(viewer);
  const article = await prisma.helpArticle.delete({ where: { id } }).catch(() => null);
  if (!article) throw new HelpError(404, 'Article not found');
  await logActivity({ actorId: viewer.id, action: 'help.deleted', targetType: 'help', targetId: id, targetLabel: article.title });
}

export async function reorderArticles(viewer: Viewer, ids: string[]) {
  assertManager(viewer);
  await prisma.$transaction(ids.map((id, position) => prisma.helpArticle.update({ where: { id }, data: { position } })));
}

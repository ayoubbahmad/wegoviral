/** Admin tools for spaces: create, edit, reorder, archive. */
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import type { Actor } from './service';
import { AdminError, SpaceInput } from './model';

/** All spaces including archived ones, with post counts. */
export async function listAllSpaces() {
  const [spaces, counts] = await Promise.all([
    prisma.communitySpace.findMany({ orderBy: [{ archivedAt: 'asc' }, { position: 'asc' }] }),
    prisma.communityPost.groupBy({
      by: ['spaceId'],
      where: { deletedAt: null, reviewStatus: 'PUBLISHED' },
      _count: { _all: true },
    }),
  ]);
  const countBySpace = new Map(counts.map((count) => [count.spaceId, count._count._all]));
  return spaces.map((space) => ({ ...space, postCount: countBySpace.get(space.id) ?? 0 }));
}

/** Readable, URL-safe id from the name, e.g. "Brand Deals" → "brand-deals". */
async function uniqueSpaceId(name: string) {
  const base =
    name
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'space';
  for (let suffix = 1; suffix < 100; suffix++) {
    const id = suffix === 1 ? base : `${base}-${suffix}`;
    if (!(await prisma.communitySpace.findUnique({ where: { id } }))) return id;
  }
  throw new Error('Could not create a space id');
}

export async function createSpace(actor: Actor, input: SpaceInput) {
  const last = await prisma.communitySpace.findFirst({ orderBy: { position: 'desc' }, select: { position: true } });
  const space = await prisma.communitySpace.create({
    data: {
      id: await uniqueSpaceId(input.name),
      name: input.name,
      emoji: input.emoji,
      description: input.description,
      coverUrl: input.coverUrl ?? null,
      adminOnly: input.adminOnly,
      position: (last?.position ?? -1) + 1,
    },
  });
  await logActivity({ actorId: actor.id, action: 'space.created', targetType: 'space', targetId: space.id, targetLabel: `${space.emoji} ${space.name}` });
  return space;
}

export async function updateSpace(actor: Actor, id: string, input: Partial<SpaceInput>) {
  const before = await prisma.communitySpace.findUnique({ where: { id } });
  if (!before) throw new AdminError(404, 'Space not found');
  const space = await prisma.communitySpace.update({
    where: { id },
    data: { ...input, ...(input.coverUrl === undefined ? {} : { coverUrl: input.coverUrl || null }) },
  });
  const changed = Object.keys(input).filter(
    (key) => (before as Record<string, unknown>)[key] !== (space as Record<string, unknown>)[key],
  );
  if (changed.length) {
    await logActivity({
      actorId: actor.id,
      action: 'space.updated',
      targetType: 'space',
      targetId: id,
      targetLabel: `${space.emoji} ${space.name}`,
      details: { changed },
    });
  }
  return space;
}

/** Saves a new order from the full list of active space ids. */
export async function reorderSpaces(actor: Actor, ids: string[]) {
  const active = await prisma.communitySpace.findMany({ where: { archivedAt: null }, select: { id: true } });
  const activeIds = new Set(active.map((space) => space.id));
  if (ids.length !== activeIds.size || !ids.every((id) => activeIds.has(id))) {
    throw new AdminError(400, 'The order must list every active space exactly once');
  }
  await prisma.$transaction(
    ids.map((id, position) => prisma.communitySpace.update({ where: { id }, data: { position } })),
  );
  await logActivity({ actorId: actor.id, action: 'spaces.reordered', targetType: 'space', targetLabel: 'Space order' });
  return listAllSpaces();
}

export async function setArchived(actor: Actor, id: string, archived: boolean) {
  const space = await prisma.communitySpace.findUnique({ where: { id } });
  if (!space) throw new AdminError(404, 'Space not found');
  if (archived && !space.archivedAt) {
    const activeCount = await prisma.communitySpace.count({ where: { archivedAt: null } });
    if (activeCount <= 1) throw new AdminError(409, 'Keep at least one active space');
  }
  const last = await prisma.communitySpace.findFirst({
    where: { archivedAt: null },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const updated = await prisma.communitySpace.update({
    where: { id },
    // Unarchived spaces come back at the end of the list
    data: archived ? { archivedAt: new Date() } : { archivedAt: null, position: (last?.position ?? -1) + 1 },
  });
  await logActivity({
    actorId: actor.id,
    action: archived ? 'space.archived' : 'space.unarchived',
    targetType: 'space',
    targetId: id,
    targetLabel: `${space.emoji} ${space.name}`,
  });
  return updated;
}

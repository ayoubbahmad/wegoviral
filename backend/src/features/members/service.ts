import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { badgesSelect, flattenBadges, levelFor } from '../../lib/gamification';

export class MembersError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const DirectoryQuerySchema = z.object({
  q: z.string().trim().max(60).optional(),
  sort: z.enum(['recent', 'points', 'name']).default('recent'),
  page: z.coerce.number().int().min(1).default(1),
});

export const DIRECTORY_PAGE_SIZE = 24;

/** Members others can find: approved and not banned */
const listed = (): Prisma.UserProfileWhereInput => ({ joinStatus: 'APPROVED', status: { not: 'BANNED' } });

const cardSelect = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  role: true,
  niche: true,
  points: true,
  createdAt: true,
  application: { select: { niche: true } },
  ...badgesSelect,
} satisfies Prisma.UserProfileSelect;

type CardRow = Prisma.UserProfileGetPayload<{ select: typeof cardSelect }>;

async function toCard(row: CardRow) {
  const { application, ...member } = flattenBadges(row);
  return { ...member, niche: row.niche ?? application?.niche ?? null, level: await levelFor(row.points) };
}

/** The member directory: search by name, username or niche. */
export async function listMembers({ q, sort, page }: z.infer<typeof DirectoryQuerySchema>) {
  const where: Prisma.UserProfileWhereInput = {
    ...listed(),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { username: { contains: q, mode: 'insensitive' } },
            { niche: { contains: q, mode: 'insensitive' } },
            { application: { niche: { contains: q, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };
  const orderBy: Prisma.UserProfileOrderByWithRelationInput[] =
    sort === 'points' ? [{ points: 'desc' }, { createdAt: 'asc' }] : sort === 'name' ? [{ name: 'asc' }, { username: 'asc' }] : [{ createdAt: 'desc' }];
  const [rows, total] = await Promise.all([
    prisma.userProfile.findMany({ where, orderBy, skip: (page - 1) * DIRECTORY_PAGE_SIZE, take: DIRECTORY_PAGE_SIZE, select: cardSelect }),
    prisma.userProfile.count({ where }),
  ]);
  return { members: await Promise.all(rows.map(toCard)), total, page, pageSize: DIRECTORY_PAGE_SIZE };
}

/** One member's profile, as other members see it (members always see all of their own). */
export async function getProfile(viewerId: string, username: string) {
  const row = await prisma.userProfile.findFirst({
    where: { username: username.toLowerCase(), OR: [listed(), { id: viewerId }] },
    select: {
      ...cardSelect,
      bio: true,
      socialLinks: true,
      showSocialLinks: true,
      _count: {
        select: {
          communityPosts: { where: { deletedAt: null, reviewStatus: 'PUBLISHED' } },
          communityComments: { where: { deletedAt: null } },
        },
      },
    },
  });
  if (!row) throw new MembersError(404, 'Member not found');
  const isSelf = row.id === viewerId;
  const { showSocialLinks, socialLinks, _count, ...rest } = row;
  return {
    ...(await toCard(rest)),
    bio: row.bio,
    socialLinks: showSocialLinks || isSelf ? socialLinks : [],
    postCount: _count.communityPosts,
    commentCount: _count.communityComments,
    isSelf,
  };
}

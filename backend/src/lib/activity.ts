import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export interface ActivityEntry {
  actorId: string;
  action: string; // e.g. "member.role_changed"
  targetType: 'member' | 'post' | 'comment' | 'space';
  targetId?: string;
  targetLabel?: string;
  details?: Prisma.InputJsonValue;
}

/** Records an admin action. Never fails the request it belongs to. */
export async function logActivity(entry: ActivityEntry) {
  try {
    await prisma.adminActivity.create({ data: entry });
  } catch (error) {
    console.error('Failed to write activity log', error);
  }
}

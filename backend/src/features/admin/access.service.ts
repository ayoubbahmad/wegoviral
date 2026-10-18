/** Admin tools for access: membership tiers, members' tiers, and access rules on spaces. */
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { can } from '../../lib/permissions';
import { getRule, invalidateAccessCache, ResourceType } from '../../lib/access';
import type { Actor } from './service';
import { AccessRuleInput, AdminError, TierInput } from './model';

// ─── Tiers (Super Admin) ─────────────────────────────────────────────────────

export async function listTiers() {
  const [tiers, counts, defaultMembers] = await Promise.all([
    prisma.membershipTier.findMany({ orderBy: { position: 'asc' } }),
    prisma.userProfile.groupBy({ by: ['tierId'], _count: { _all: true } }),
    prisma.userProfile.count({ where: { tierId: null } }),
  ]);
  const countByTier = new Map(counts.map((row) => [row.tierId, row._count._all]));
  return tiers.map((tier) => ({
    ...tier,
    // Members without a tier are on the default one
    memberCount: (countByTier.get(tier.id) ?? 0) + (tier.isDefault ? defaultMembers : 0),
  }));
}

const tierIdFrom = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30) || 'tier';

export async function createTier(actor: Actor, input: TierInput) {
  let id = tierIdFrom(input.name);
  for (let suffix = 2; await prisma.membershipTier.findUnique({ where: { id } }); suffix++) {
    id = `${tierIdFrom(input.name)}-${suffix}`;
  }
  const last = await prisma.membershipTier.findFirst({ orderBy: { position: 'desc' }, select: { position: true } });
  const tier = await prisma.membershipTier.create({
    data: { id, name: input.name, description: input.description || null, position: (last?.position ?? -1) + 1 },
  });
  invalidateAccessCache();
  await logActivity({ actorId: actor.id, action: 'tier.created', targetType: 'tier', targetId: tier.id, targetLabel: tier.name });
  return tier;
}

export async function updateTier(actor: Actor, id: string, input: Partial<TierInput> & { isDefault?: boolean }) {
  const tier = await prisma.membershipTier.findUnique({ where: { id } });
  if (!tier) throw new AdminError(404, 'Tier not found');
  if (input.isDefault === false && tier.isDefault) {
    throw new AdminError(400, 'Make another tier the default instead');
  }
  const updated = await prisma.$transaction(async (tx) => {
    // Exactly one default tier
    if (input.isDefault) await tx.membershipTier.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
    return tx.membershipTier.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
        ...(input.isDefault ? { isDefault: true } : {}),
      },
    });
  });
  invalidateAccessCache();
  await logActivity({
    actorId: actor.id,
    action: 'tier.updated',
    targetType: 'tier',
    targetId: id,
    targetLabel: updated.name,
    details: { ...input },
  });
  return updated;
}

/** Deleting a tier moves its members to the default tier and removes it from access rules. */
export async function deleteTier(actor: Actor, id: string) {
  const tier = await prisma.membershipTier.findUnique({ where: { id } });
  if (!tier) throw new AdminError(404, 'Tier not found');
  if (tier.isDefault) throw new AdminError(400, "The default tier can't be deleted");
  const rules = await prisma.accessRule.findMany({ where: { tierIds: { has: id } } });
  await prisma.$transaction([
    prisma.userProfile.updateMany({ where: { tierId: id }, data: { tierId: null } }),
    ...rules.map((rule) =>
      prisma.accessRule.update({ where: { id: rule.id }, data: { tierIds: rule.tierIds.filter((tierId) => tierId !== id) } }),
    ),
    prisma.membershipTier.delete({ where: { id } }),
  ]);
  invalidateAccessCache();
  await logActivity({ actorId: actor.id, action: 'tier.deleted', targetType: 'tier', targetId: id, targetLabel: tier.name });
}

export async function setMemberTier(actor: Actor, userId: string, tierId: string | null) {
  const member = await prisma.userProfile.findUnique({ where: { id: userId }, select: { username: true, name: true, tierId: true } });
  if (!member) throw new AdminError(404, 'Member not found');
  if (tierId && !(await prisma.membershipTier.findUnique({ where: { id: tierId } }))) {
    throw new AdminError(400, 'This tier does not exist');
  }
  await prisma.userProfile.update({ where: { id: userId }, data: { tierId } });
  await logActivity({
    actorId: actor.id,
    action: 'member.tier_changed',
    targetType: 'member',
    targetId: userId,
    targetLabel: member.name ? `${member.name} (@${member.username})` : `@${member.username}`,
    details: { from: member.tierId, to: tierId },
  });
  return { tierId };
}

// ─── Access rules ────────────────────────────────────────────────────────────

export async function getAccessRule(resourceType: ResourceType, resourceId: string) {
  return getRule(resourceType, resourceId);
}

/**
 * Sets who can open a resource. Admins set role and time conditions; only
 * Super Admins decide which tiers (what's paid) can open it.
 */
export async function setAccessRule(actor: Actor, resourceType: ResourceType, resourceId: string, input: AccessRuleInput) {
  if (resourceType === 'space' && !(await prisma.communitySpace.findUnique({ where: { id: resourceId } }))) {
    throw new AdminError(404, 'Space not found');
  }
  const current = await prisma.accessRule.findUnique({ where: { resourceType_resourceId: { resourceType, resourceId } } });
  const tierIds = [...new Set(input.tierIds)].sort();
  const tiersChanged = tierIds.join('|') !== [...(current?.tierIds ?? [])].sort().join('|');
  if (tiersChanged && !can(actor.role, 'tiers.manage')) {
    throw new AdminError(403, 'Only Super Admins decide which tiers can access content');
  }
  if (tierIds.length) {
    const known = await prisma.membershipTier.count({ where: { id: { in: tierIds } } });
    if (known !== tierIds.length) throw new AdminError(400, 'Unknown tier');
  }

  const isOpen = !input.minRole && !tierIds.length && !input.minDays;
  if (isOpen) {
    await prisma.accessRule.deleteMany({ where: { resourceType, resourceId } });
  } else {
    await prisma.accessRule.upsert({
      where: { resourceType_resourceId: { resourceType, resourceId } },
      create: { resourceType, resourceId, minRole: input.minRole ?? null, tierIds, minDays: input.minDays ?? null },
      update: { minRole: input.minRole ?? null, tierIds, minDays: input.minDays ?? null },
    });
  }
  invalidateAccessCache();
  await logActivity({
    actorId: actor.id,
    action: 'access.updated',
    targetType: resourceType,
    targetId: resourceId,
    targetLabel: resourceId,
    details: isOpen ? { open: true } : { minRole: input.minRole ?? null, tierIds, minDays: input.minDays ?? null },
  });
  return isOpen ? null : getRule(resourceType, resourceId);
}

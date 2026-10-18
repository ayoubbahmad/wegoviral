/**
 * Access rules engine (docs/ADMIN_ROADMAP.md, Phase 4): one rule per resource
 * (space now; courses, events and challenges later). Every condition set on a
 * rule must match. Staff always have access. Levels are added in Phase 6.
 */
import { AccessRule, MembershipTier, UserRole } from '@prisma/client';
import { prisma } from './prisma';
import { can, ROLE_RANK } from './permissions';

const CACHE_MS = 30_000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ResourceType = 'space' | 'course' | 'event' | 'challenge';

export interface AccessViewer {
  id: string;
  role: UserRole;
  tierId: string | null;
  joinedAt: Date;
}

export type LockReason =
  | { type: 'role'; minRole: UserRole }
  | { type: 'tier'; tiers: { id: string; name: string }[] }
  | { type: 'time'; unlocksAt: string; daysLeft: number };

export interface AccessResult {
  locked: boolean;
  reasons: LockReason[];
}

const OPEN: AccessResult = { locked: false, reasons: [] };

// ─── Cached tiers and rules ──────────────────────────────────────────────────

let tiersCache: { value: MembershipTier[]; at: number } | null = null;
let rulesCache: { value: AccessRule[]; at: number } | null = null;

export async function getTiers() {
  if (tiersCache && Date.now() - tiersCache.at < CACHE_MS) return tiersCache.value;
  const value = await prisma.membershipTier.findMany({ orderBy: { position: 'asc' } });
  tiersCache = { value, at: Date.now() };
  return value;
}

async function getRules() {
  if (rulesCache && Date.now() - rulesCache.at < CACHE_MS) return rulesCache.value;
  const value = await prisma.accessRule.findMany();
  rulesCache = { value, at: Date.now() };
  return value;
}

/** Call after changing tiers or rules. */
export function invalidateAccessCache() {
  tiersCache = null;
  rulesCache = null;
}

/** The member's tier, falling back to the default tier. */
export async function effectiveTierId(tierId: string | null) {
  if (tierId) return tierId;
  return (await getTiers()).find((tier) => tier.isDefault)?.id ?? null;
}

// ─── Evaluation ──────────────────────────────────────────────────────────────

export async function evaluateRule(
  rule: Pick<AccessRule, 'minRole' | 'tierIds' | 'minDays'> | null | undefined,
  viewer: AccessViewer,
): Promise<AccessResult> {
  if (!rule || can(viewer.role, 'community.moderate')) return OPEN;
  const reasons: LockReason[] = [];

  if (rule.minRole && ROLE_RANK[viewer.role] < ROLE_RANK[rule.minRole]) {
    reasons.push({ type: 'role', minRole: rule.minRole });
  }

  if (rule.tierIds.length) {
    const tierId = await effectiveTierId(viewer.tierId);
    if (!tierId || !rule.tierIds.includes(tierId)) {
      const tiers = await getTiers();
      reasons.push({
        type: 'tier',
        tiers: tiers.filter((tier) => rule.tierIds.includes(tier.id)).map(({ id, name }) => ({ id, name })),
      });
    }
  }

  if (rule.minDays) {
    const unlocksAt = new Date(viewer.joinedAt.getTime() + rule.minDays * DAY_MS);
    if (unlocksAt.getTime() > Date.now()) {
      reasons.push({
        type: 'time',
        unlocksAt: unlocksAt.toISOString(),
        daysLeft: Math.ceil((unlocksAt.getTime() - Date.now()) / DAY_MS),
      });
    }
  }

  return { locked: reasons.length > 0, reasons };
}

export async function getRule(resourceType: ResourceType, resourceId: string) {
  return (await getRules()).find((rule) => rule.resourceType === resourceType && rule.resourceId === resourceId) ?? null;
}

/** Access to every resource of a type that has a rule, keyed by resource id. */
export async function accessByResource(resourceType: ResourceType, viewer: AccessViewer) {
  const rules = (await getRules()).filter((rule) => rule.resourceType === resourceType);
  const results = new Map<string, AccessResult>();
  for (const rule of rules) results.set(rule.resourceId, await evaluateRule(rule, viewer));
  return results;
}

/** Ids of the resources of a type this viewer can't open. */
export async function lockedResourceIds(resourceType: ResourceType, viewer: AccessViewer) {
  const results = await accessByResource(resourceType, viewer);
  return [...results.entries()].filter(([, result]) => result.locked).map(([id]) => id);
}

/** A short sentence for API errors, e.g. "Unlocks in 12 days". */
export function describeLock(result: AccessResult) {
  return result.reasons
    .map((reason) =>
      reason.type === 'role'
        ? 'Only for the team'
        : reason.type === 'tier'
          ? `For ${reason.tiers.map((tier) => tier.name).join(' or ')} members`
          : `Unlocks in ${reason.daysLeft} day${reason.daysLeft === 1 ? '' : 's'}`,
    )
    .join(' · ');
}

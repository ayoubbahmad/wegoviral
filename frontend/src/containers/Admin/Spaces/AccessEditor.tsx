'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { ROLE_LABELS, UserRole } from '@/lib/roles';
import { useHowPointsWork } from '@/containers/Community/Leaderboard/api';
import { useSaveSpaceAccess, useTiers } from '../api/moderation';
import { AccessRule, AdminSpace, Tier } from '../types';

/** Short summary for lists, e.g. "Pro · 30+ days". */
export function summarizeAccess(rule: AccessRule | null, tiers: Tier[] = []) {
  if (!rule) return null;
  const parts = [
    rule.minRole && `${ROLE_LABELS[rule.minRole]}s+`,
    rule.tierIds.length && rule.tierIds.map((id) => tiers.find((tier) => tier.id === id)?.name ?? id).join(' / '),
    rule.minDays && `${rule.minDays}+ days`,
    rule.minLevel && `Level ${rule.minLevel}+`,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

/** "Any level" plus every level above the first. */
export const levelOptions = (levels: { level: number; name: string; minPoints: number }[] = []) => [
  { value: '', label: 'Any level' },
  ...levels.filter((level) => level.level > 1).map((level) => ({ value: String(level.level), label: `Level ${level.level} · ${level.name} (${level.minPoints} pts)` })),
];

const ROLE_OPTIONS: { value: '' | UserRole; label: string }[] = [
  { value: '', label: 'Every member' },
  { value: 'INSTRUCTOR', label: 'Instructors and the team' },
  { value: 'MODERATOR', label: 'Moderators and above' },
  { value: 'ADMIN', label: 'Admins and above' },
];

/** Who can open a space. All conditions must match; staff always can. */
export const AccessEditor = ({ space }: { space: AdminSpace }) => {
  const can = useCan();
  const { showToast } = useToast();
  const save = useSaveSpaceAccess();
  const { data: tiers = [] } = useTiers();
  const canSetTiers = can('tiers.manage');
  const [minRole, setMinRole] = useState<'' | UserRole>(space.access?.minRole ?? '');
  const [tierIds, setTierIds] = useState<string[]>(space.access?.tierIds ?? []);
  const [minDays, setMinDays] = useState(space.access?.minDays ? String(space.access.minDays) : '');
  const [minLevel, setMinLevel] = useState(space.access?.minLevel ? String(space.access.minLevel) : '');
  const { data: points } = useHowPointsWork();

  const parsedDays = minDays ? Number(minDays) : null;
  const daysValid = parsedDays === null || (Number.isInteger(parsedDays) && parsedDays >= 1 && parsedDays <= 3650);

  const handleSave = () =>
    save.mutate(
      { id: space.id, rule: { minRole: minRole || null, tierIds, minDays: parsedDays, minLevel: minLevel ? Number(minLevel) : null } },
      {
        onSuccess: (rule) => showToast(rule ? 'Access saved' : 'Space is open to every member'),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div>
        <h3 className="text-sm font-bold">Who can open this space</h3>
        <p className="text-xs text-muted-foreground">
          Members who don&apos;t match see it with a lock and the reason. All conditions must match; the team always has access.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Role</span>
          <Select aria-label="Minimum role" value={minRole} onChange={(e) => setMinRole(e.target.value as '' | UserRole)} options={ROLE_OPTIONS} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Days in the community</span>
          <input
            type="number"
            min={1}
            value={minDays}
            onChange={(e) => setMinDays(e.target.value)}
            placeholder="No minimum"
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Level</span>
          <Select aria-label="Minimum level" value={minLevel} onChange={(e) => setMinLevel(e.target.value)} options={levelOptions(points?.levels)} />
        </label>
      </div>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          Tiers {canSetTiers ? '(none ticked = every tier)' : '(only Super Admins can change this)'}
        </span>
        <div className="flex flex-wrap gap-3">
          {tiers.map((tier) => (
            <label key={tier.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                disabled={!canSetTiers}
                checked={tierIds.includes(tier.id)}
                onChange={(e) => setTierIds((ids) => (e.target.checked ? [...ids, tier.id] : ids.filter((id) => id !== tier.id)))}
                className="accent-[var(--primary)]"
              />
              {tier.name}
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={handleSave} disabled={!daysValid || save.isPending}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save access'}
        </Button>
      </div>
    </div>
  );
};

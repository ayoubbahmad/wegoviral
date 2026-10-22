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
import { useT } from '@/i18n/provider';
import { levelOptions } from '@/lib/levels';

/** Short summary for lists, e.g. "Pro · 30+ days". */
export function summarizeAccess(rule: AccessRule | null, tiers: Tier[] = [], t: ReturnType<typeof useT>) {
  if (!rule) return null;
  const parts = [
    rule.minRole && t('admin.spaces.summaryRole', { role: t(`common.roles.${rule.minRole}`) }),
    rule.tierIds.length && rule.tierIds.map((id) => tiers.find((tier) => tier.id === id)?.name ?? id).join(' / '),
    rule.minDays && t('admin.spaces.summaryDays', { count: rule.minDays }),
    rule.minLevel && t('admin.spaces.summaryLevel', { level: rule.minLevel }),
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

const roleOptions = (t: ReturnType<typeof useT>): { value: '' | UserRole; label: string }[] => [
  { value: '', label: t('common.access.everyMember') },
  { value: 'INSTRUCTOR', label: t('common.access.instructorsTeam') },
  { value: 'MODERATOR', label: t('common.access.moderatorsUp') },
  { value: 'ADMIN', label: t('admin.spaces.adminsUp') },
];

/** Who can open a space. All conditions must match; staff always can. */
export const AccessEditor = ({ space }: { space: AdminSpace }) => {
  const t = useT();
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
        onSuccess: (rule) => showToast(rule ? t('admin.spaces.accessSaved') : t('admin.spaces.accessOpen')),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div>
        <h3 className="text-sm font-bold">{t('admin.spaces.accessTitle')}</h3>
        <p className="text-xs text-muted-foreground">
          {t('admin.spaces.accessBody')}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('common.access.role')}</span>
          <Select aria-label={t('common.access.minRole')} value={minRole} onChange={(e) => setMinRole(e.target.value as '' | UserRole)} options={roleOptions(t)} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('common.access.days')}</span>
          <input
            type="number"
            min={1}
            value={minDays}
            onChange={(e) => setMinDays(e.target.value)}
            placeholder={t('common.access.noMinimum')}
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('common.access.level')}</span>
          <Select aria-label={t('common.access.minLevel')} value={minLevel} onChange={(e) => setMinLevel(e.target.value)} options={levelOptions(points?.levels, t)} />
        </label>
      </div>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          {canSetTiers ? t('common.access.tiers') : t('admin.spaces.tiersSuper')}
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
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.spaces.saveAccess')}
        </Button>
      </div>
    </div>
  );
};

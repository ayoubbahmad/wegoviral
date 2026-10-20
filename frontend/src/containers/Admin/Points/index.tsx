'use client';

import { useState } from 'react';
import { Archive, ArchiveRestore, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import { useArchiveBadge, useGamification, useSaveBadge, useSaveLevels, useSavePointRules } from '../api/gamification';
import { AdminBadge, AutoBadgeType, BadgeInput, GamificationConfig, PointRuleRow } from '../types';

const inputClass =
  'w-full h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

/** Point rules, levels and badges (Admins). */
export const AdminPointsContainer = () => {
  const { data, isPending, error } = useGamification();

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/points-and-badges-admin"
        title="Points & badges"
        description="Members earn points for taking part, level up as their points grow, and collect badges. Spaces and events can open at a level."
      />
      {isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : (
        <div className="space-y-6">
          <PointRulesCard key={JSON.stringify(data.rules)} rules={data.rules} />
          <LevelsCard key={JSON.stringify(data.levels)} levels={data.levels} />
          <BadgesCard config={data} />
        </div>
      )}
    </PageContainer>
  );
};

// ─── Point rules ─────────────────────────────────────────────────────────────

const PointRulesCard = ({ rules: saved }: { rules: PointRuleRow[] }) => {
  const { showToast } = useToast();
  const save = useSavePointRules();
  const [rules, setRules] = useState(saved.map((rule) => ({ ...rule, points: String(rule.points), dailyCap: rule.dailyCap ? String(rule.dailyCap) : '' })));
  const update = (action: string, patch: Partial<(typeof rules)[number]>) =>
    setRules((current) => current.map((rule) => (rule.action === action ? { ...rule, ...patch } : rule)));
  const valid = rules.every((rule) => Number.isInteger(Number(rule.points)) && rule.points !== '' && (rule.dailyCap === '' || Number(rule.dailyCap) >= 1));

  const handleSave = () =>
    save.mutate(
      rules.map((rule) => ({ action: rule.action, points: Number(rule.points), dailyCap: rule.dailyCap ? Number(rule.dailyCap) : null, enabled: rule.enabled })),
      { onSuccess: () => showToast('Point rules saved'), onError: (e) => showToast(e.message, 'error') },
    );

  return (
    <Card padding="none">
      <div className="space-y-1 px-5 pt-5">
        <h2 className="font-bold">Point rules</h2>
        <p className="text-sm text-muted-foreground">
          Changes apply to new actions; points already earned stay. Penalties (negative points) are off until you switch them on.
        </p>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Action</th>
              <th className="w-24 px-3 py-2 font-semibold">Points</th>
              <th className="w-28 px-3 py-2 font-semibold">Daily cap</th>
              <th className="w-16 px-3 py-2 font-semibold">On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rules.map((rule) => (
              <tr key={rule.action} className={cn(!rule.enabled && 'text-muted-foreground')}>
                <td className="px-3 py-2">{rule.label}</td>
                <td className="px-3 py-2">
                  <input type="number" aria-label={`Points for ${rule.label}`} value={rule.points} onChange={(e) => update(rule.action, { points: e.target.value })} className={inputClass} />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    aria-label={`Daily cap for ${rule.label}`}
                    value={rule.dailyCap}
                    onChange={(e) => update(rule.action, { dailyCap: e.target.value })}
                    placeholder="None"
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label={`${rule.label} on`}
                    checked={rule.enabled}
                    onChange={(e) => update(rule.action, { enabled: e.target.checked })}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end px-5 pb-5">
        <Button variant="primary" size="sm" onClick={handleSave} disabled={!valid || save.isPending}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save rules'}
        </Button>
      </div>
    </Card>
  );
};

// ─── Levels ──────────────────────────────────────────────────────────────────

const LevelsCard = ({ levels: saved }: { levels: GamificationConfig['levels'] }) => {
  const { showToast } = useToast();
  const save = useSaveLevels();
  const [levels, setLevels] = useState(saved.map((level) => ({ name: level.name, minPoints: String(level.minPoints) })));
  const numbers = levels.map((level) => Number(level.minPoints));
  const valid =
    levels.length > 0 &&
    levels.every((level) => level.name.trim() && level.minPoints !== '' && Number.isInteger(Number(level.minPoints)) && Number(level.minPoints) >= 0) &&
    numbers[0] === 0 &&
    numbers.every((value, index) => index === 0 || value > numbers[index - 1]);

  const update = (index: number, patch: Partial<(typeof levels)[number]>) =>
    setLevels((current) => current.map((level, i) => (i === index ? { ...level, ...patch } : level)));

  const handleSave = () =>
    save.mutate(
      levels.map((level) => ({ name: level.name.trim(), minPoints: Number(level.minPoints) })),
      { onSuccess: () => showToast('Levels saved'), onError: (e) => showToast(e.message, 'error') },
    );

  return (
    <Card padding="none">
      <div className="space-y-1 px-5 pt-5">
        <h2 className="font-bold">Levels</h2>
        <p className="text-sm text-muted-foreground">
          The first level starts at 0 points and each level needs more points than the one before. Spaces and events locked to a level number keep that number.
        </p>
      </div>
      <ul className="space-y-2 p-5">
        {levels.map((level, index) => (
          <li key={index} className="grid grid-cols-[40px_1fr_120px_36px] items-center gap-2">
            <span className="text-center text-sm font-bold text-muted-foreground">{index + 1}</span>
            <input aria-label={`Level ${index + 1} name`} value={level.name} maxLength={30} onChange={(e) => update(index, { name: e.target.value })} className={inputClass} />
            <input
              type="number"
              min={0}
              aria-label={`Level ${index + 1} points`}
              value={level.minPoints}
              disabled={index === 0}
              onChange={(e) => update(index, { minPoints: e.target.value })}
              className={inputClass}
            />
            {index > 0 && index === levels.length - 1 ? (
              <button aria-label="Remove level" onClick={() => setLevels((current) => current.slice(0, -1))} className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <span />
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-2 px-5 pb-5">
        <Button
          variant="ghost"
          size="sm"
          disabled={levels.length >= 50}
          onClick={() => setLevels((current) => [...current, { name: '', minPoints: String((Number(current.at(-1)?.minPoints) || 0) * 2 || 10) }])}
        >
          <Plus className="w-4 h-4" /> Add level
        </Button>
        <div className="flex items-center gap-3">
          {!valid && <span className="text-xs text-muted-foreground">Each level needs a name and more points than the last.</span>}
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!valid || save.isPending}>
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save levels'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ─── Badges ──────────────────────────────────────────────────────────────────

const describeAutoRule = (badge: AdminBadge, config: GamificationConfig) => {
  if (!badge.autoRule) return 'Given by the team';
  const label = config.autoBadgeTypes.find((type) => type.type === badge.autoRule!.type)?.label ?? badge.autoRule.type;
  return `Automatic: ${badge.autoRule.threshold.toLocaleString()} ${label.toLowerCase()}`;
};

const BadgesCard = ({ config }: { config: GamificationConfig }) => {
  const { showToast } = useToast();
  const archive = useArchiveBadge();
  const [editing, setEditing] = useState<AdminBadge | 'new' | null>(null);

  return (
    <Card padding="none">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="space-y-1">
          <h2 className="font-bold">Badges</h2>
          <p className="text-sm text-muted-foreground">
            Automatic badges are given as soon as a member reaches the milestone (and to everyone who already has). Give the others by hand from the member panel.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setEditing('new')}>
          <Plus className="w-4 h-4" /> New badge
        </Button>
      </div>
      {editing && (
        <div className="px-5 pt-4">
          <BadgeForm key={editing === 'new' ? 'new' : editing.id} badge={editing === 'new' ? null : editing} config={config} onDone={() => setEditing(null)} />
        </div>
      )}
      <ul className="divide-y divide-border/50 p-2">
        {config.badges.map((badge) => (
          <li key={badge.id} className={cn('flex items-center gap-3 px-3 py-3', badge.archivedAt && 'opacity-60')}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: `${badge.color}26` }}>
              {badge.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {badge.name}
                {badge.archivedAt && <span className="ml-2 text-xs font-normal text-muted-foreground">Archived</span>}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {describeAutoRule(badge, config)} · {badge.holderCount} member{badge.holderCount === 1 ? '' : 's'}
                {badge.description && ` · ${badge.description}`}
              </p>
            </div>
            <button aria-label={`Edit ${badge.name}`} onClick={() => setEditing(badge)} className="rounded-lg p-2 hover:bg-secondary/50">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              aria-label={badge.archivedAt ? `Bring back ${badge.name}` : `Archive ${badge.name}`}
              disabled={archive.isPending}
              onClick={() =>
                (badge.archivedAt || window.confirm(`Archive ${badge.name}? It disappears from profiles and stops being given. You can bring it back later.`)) &&
                archive.mutate(
                  { id: badge.id, archived: !badge.archivedAt },
                  { onSuccess: () => showToast(badge.archivedAt ? 'Badge is back' : 'Badge archived'), onError: (e) => showToast(e.message, 'error') },
                )
              }
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50"
            >
              {badge.archivedAt ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const BadgeForm = ({ badge, config, onDone }: { badge: AdminBadge | null; config: GamificationConfig; onDone: () => void }) => {
  const { showToast } = useToast();
  const save = useSaveBadge();
  const [name, setName] = useState(badge?.name ?? '');
  const [emoji, setEmoji] = useState(badge?.emoji ?? '🏅');
  const [color, setColor] = useState(badge?.color ?? '#f59e0b');
  const [description, setDescription] = useState(badge?.description ?? '');
  const [autoType, setAutoType] = useState<'' | AutoBadgeType>(badge?.autoRule?.type ?? '');
  const [threshold, setThreshold] = useState(badge?.autoRule ? String(badge.autoRule.threshold) : '');
  const thresholdValid = !autoType || (Number.isInteger(Number(threshold)) && Number(threshold) >= 1);
  const valid = name.trim().length >= 2 && emoji.trim() && thresholdValid;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const input: BadgeInput = {
      name: name.trim(),
      emoji: emoji.trim(),
      color,
      description: description.trim(),
      autoRule: autoType ? { type: autoType, threshold: Number(threshold) } : null,
    };
    save.mutate(
      { id: badge?.id, input },
      {
        onSuccess: () => {
          showToast(badge ? 'Badge updated' : 'Badge created');
          onDone();
        },
        onError: (e) => showToast(e.message, 'error'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-[80px_1fr_110px]">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Emoji</span>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={8} className={cn(inputClass, 'text-center text-lg')} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="e.g. Top helper" className={inputClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Color</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg border border-border bg-background px-1" />
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Description (members see it)</span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} placeholder="What it's for" className={inputClass} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">How members get it</span>
          <Select
            aria-label="How members get it"
            value={autoType}
            onChange={(e) => setAutoType(e.target.value as '' | AutoBadgeType)}
            options={[{ value: '', label: 'Given by the team' }, ...config.autoBadgeTypes.map((type) => ({ value: type.type, label: `Automatic: ${type.label.toLowerCase()}` }))]}
          />
        </label>
        {autoType && (
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Milestone</span>
            <input type="number" min={1} value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="e.g. 10" className={inputClass} />
          </label>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" size="sm" disabled={!valid || save.isPending}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : badge ? 'Save badge' : 'Create badge'}
        </Button>
      </div>
    </form>
  );
};

'use client';

import { useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { Textarea } from '@/components/Textarea';
import { useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { useTiers } from '@/containers/Admin/api/moderation';
import { levelOptions } from '@/containers/Admin/Spaces/AccessEditor';
import { useHowPointsWork } from '@/containers/Community/Leaderboard/api';
import { ChallengeDetail, ChallengeInput, ChallengeStatus, CheckInType } from '@/types/challenges';
import { uploadImage } from '../../api';
import type { AccessRuleInput } from '../../Events/api';
import { useChallengeAccess, useSaveChallenge, useSaveChallengeAccess } from '../api';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
    {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

/** ISO → value for <input type="datetime-local"> in the browser's time zone. */
const toLocalInput = (iso: string) => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const startOfDay = (offsetDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

const viewerTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

interface Props {
  challenge: ChallengeDetail | null;
  onClose: () => void;
  onSaved: (challenge: ChallengeDetail) => void;
}

/** Loads the current access rule first when editing. */
export const ChallengeFormDialog = ({ challenge, onClose, onSaved }: Props) => {
  const { data: rule, isPending } = useChallengeAccess(challenge?.id);
  return (
    <Modal isOpen onClose={onClose} title={challenge ? 'Edit challenge' : 'New challenge'} maxWidth="2xl">
      {challenge && isPending ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <ChallengeForm
          challenge={challenge}
          initialRule={{ minRole: rule?.minRole ?? null, tierIds: rule?.tierIds ?? [], minDays: rule?.minDays ?? null, minLevel: rule?.minLevel ?? null }}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
};

const ChallengeForm = ({ challenge, initialRule, onClose, onSaved }: Props & { initialRule: AccessRuleInput }) => {
  const can = useCan();
  const { showToast } = useToast();
  const save = useSaveChallenge();
  const saveAccess = useSaveChallengeAccess();
  const canSetTiers = can('tiers.manage');
  const { data: tiers = [] } = useTiers(canSetTiers);
  const { data: points } = useHowPointsWork();
  const [rule, setRule] = useState(initialRule);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: challenge?.title ?? '',
    description: challenge?.description ?? '',
    rules: challenge?.rules ?? '',
    prizes: challenge?.prizes ?? '',
    coverUrl: challenge?.coverUrl ?? null,
    startsAt: toLocalInput(challenge?.startsAt ?? startOfDay(1)),
    endsAt: toLocalInput(challenge?.endsAt ?? startOfDay(31)),
    checkInType: (challenge?.checkInType ?? 'DAILY') as CheckInType,
    requiredCheckIns: challenge && challenge.checkInType === 'DAILY' && challenge.requiredCheckIns !== challenge.totalDays ? String(challenge.requiredCheckIns) : '',
    status: (challenge?.status ?? 'DRAFT') as ChallengeStatus,
    completionBadgeId: challenge?.completionBadge?.id ?? '',
    winnerBadgeId: challenge?.winnerBadge?.id ?? '',
  });
  const update = (change: Partial<typeof form>) => setForm((current) => ({ ...current, ...change }));
  const badgeOptions = (empty: string) => [{ value: '', label: empty }, ...(points?.badges ?? []).map((badge) => ({ value: badge.id, label: `${badge.emoji} ${badge.name}` }))];

  const required = form.requiredCheckIns ? Number(form.requiredCheckIns) : null;
  const valid =
    form.title.trim().length >= 3 &&
    form.startsAt &&
    form.endsAt &&
    new Date(form.endsAt) > new Date(form.startsAt) &&
    (required === null || (Number.isInteger(required) && required >= 1));

  const handleCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      update({ coverUrl: await uploadImage(file) });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not upload the cover', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const input: ChallengeInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      rules: form.rules.trim(),
      prizes: form.prizes.trim(),
      coverUrl: form.coverUrl,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      timezone: challenge?.timezone ?? viewerTimezone(),
      checkInType: form.checkInType,
      requiredCheckIns: form.checkInType === 'DAILY' ? required : null,
      status: form.status,
      completionBadgeId: form.completionBadgeId || null,
      winnerBadgeId: form.winnerBadgeId || null,
    };
    try {
      const saved = await save.mutateAsync({ id: challenge?.id, input });
      await saveAccess.mutateAsync({ id: saved.id, rule });
      showToast(challenge ? 'Challenge updated' : form.status === 'PUBLISHED' ? 'Challenge published' : 'Draft saved: publish it when ready');
      onSaved(saved);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not save the challenge', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Title">
        <input value={form.title} maxLength={120} onChange={(e) => update({ title: e.target.value })} placeholder="e.g. 30 days of Reels" className={inputClass} />
      </Field>
      <Field label="Short description" hint="Shown on the challenge card.">
        <input value={form.description} maxLength={1000} onChange={(e) => update({ description: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Rules" hint="What counts as a check-in, and anything else members should know.">
        <Textarea value={form.rules} maxLength={5000} onChange={(e) => update({ rules: e.target.value })} className="min-h-[110px]" />
      </Field>
      <Field label="Prizes">
        <input value={form.prizes} maxLength={1000} onChange={(e) => update({ prizes: e.target.value })} placeholder="e.g. A 1:1 strategy call for the winner" className={inputClass} />
      </Field>

      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Cover image</span>
        {form.coverUrl ? (
          <div className="relative">
            <img src={form.coverUrl} alt="" className="h-36 w-full rounded-xl object-cover" />
            <button type="button" aria-label="Remove cover" onClick={() => update({ coverUrl: null })} className="absolute right-2 top-2 rounded-lg bg-background/90 p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:bg-secondary/30">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />} Upload a cover
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCover} className="hidden" />
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starts">
          <input type="datetime-local" value={form.startsAt} onChange={(e) => update({ startsAt: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Ends">
          <input type="datetime-local" value={form.endsAt} onChange={(e) => update({ endsAt: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">Days and streaks follow the {(challenge?.timezone ?? viewerTimezone()).replace('_', ' ')} time zone.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Check-ins">
          <Select
            aria-label="Check-ins"
            value={form.checkInType}
            onChange={(e) => update({ checkInType: e.target.value as CheckInType })}
            options={[
              { value: 'DAILY', label: 'Daily (streaks count)' },
              { value: 'ONE_TIME', label: 'One submission' },
            ]}
          />
        </Field>
        {form.checkInType === 'DAILY' && (
          <Field label="Check-ins to finish" hint="Leave empty to require every day.">
            <input type="number" min={1} value={form.requiredCheckIns} onChange={(e) => update({ requiredCheckIns: e.target.value })} placeholder="Every day" className={inputClass} />
          </Field>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Status">
          <Select
            aria-label="Status"
            value={form.status}
            onChange={(e) => update({ status: e.target.value as ChallengeStatus })}
            options={[
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PUBLISHED', label: 'Published' },
              ...(challenge ? [{ value: 'CANCELLED', label: 'Cancelled' }] : []),
            ]}
          />
        </Field>
        <Field label="Extra badge for finishing">
          <Select aria-label="Extra badge for finishing" value={form.completionBadgeId} onChange={(e) => update({ completionBadgeId: e.target.value })} options={badgeOptions('None')} />
        </Field>
        <Field label="Extra badge for winners">
          <Select aria-label="Extra badge for winners" value={form.winnerBadgeId} onChange={(e) => update({ winnerBadgeId: e.target.value })} options={badgeOptions('None')} />
        </Field>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">Everyone who finishes gets 🔥 Challenge finisher and points; winners get 🏆 Challenge winner and points.</p>

      <div className="space-y-3 rounded-xl border border-border p-4">
        <p className="text-sm font-bold">Who can take part</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Role">
            <Select
              aria-label="Minimum role"
              value={rule.minRole ?? ''}
              onChange={(e) => setRule({ ...rule, minRole: e.target.value || null })}
              options={[
                { value: '', label: 'Every member' },
                { value: 'INSTRUCTOR', label: 'Instructors and the team' },
              ]}
            />
          </Field>
          <Field label="Days in the community">
            <input
              type="number"
              min={1}
              value={rule.minDays ?? ''}
              onChange={(e) => setRule({ ...rule, minDays: e.target.value ? Number(e.target.value) : null })}
              placeholder="No minimum"
              className={inputClass}
            />
          </Field>
          <Field label="Level">
            <Select
              aria-label="Minimum level"
              value={rule.minLevel ? String(rule.minLevel) : ''}
              onChange={(e) => setRule({ ...rule, minLevel: e.target.value ? Number(e.target.value) : null })}
              options={levelOptions(points?.levels)}
            />
          </Field>
        </div>
        {canSetTiers && tiers.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <span className="w-full text-xs font-semibold text-muted-foreground">Tiers (none ticked = every tier)</span>
            {tiers.map((tier) => (
              <label key={tier.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rule.tierIds.includes(tier.id)}
                  onChange={(e) => setRule({ ...rule, tierIds: e.target.checked ? [...rule.tierIds, tier.id] : rule.tierIds.filter((id) => id !== tier.id) })}
                  className="accent-[var(--primary)]"
                />
                {tier.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={!valid || save.isPending || saveAccess.isPending || uploading}>
          {save.isPending || saveAccess.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : challenge ? 'Save' : 'Create challenge'}
        </Button>
      </div>
    </form>
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { CommunityEvent, EventInput, EventStatus } from '@/types/communityFeed';
import { uploadImage } from '../../api';
import { useTiers } from '@/containers/Admin/api/moderation';
import { levelOptions } from '@/lib/levels';
import { useHowPointsWork } from '@/containers/Community/Leaderboard/api';
import { AccessRuleInput, useEventAccess, useEventCategories, useSaveEvent, useSaveEventAccess } from '../api';
import { viewerTimezone } from '../utils';
import { useT } from '@/i18n/provider';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

/** ISO → value for <input type="datetime-local"> in the browser's time zone. */
const toLocalInput = (iso: string) => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const defaultStart = () => {
  const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  date.setHours(18, 0, 0, 0);
  return date.toISOString();
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
    {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

interface EventFormDialogProps {
  event: CommunityEvent | null; // null = new event
  onClose: () => void;
  onSaved: (event: CommunityEvent) => void;
}

export const EventFormDialog = ({ event, onClose, onSaved }: EventFormDialogProps) => {
  const t = useT();
  const { showToast } = useToast();
  const can = useCan();
  const save = useSaveEvent();
  const saveAccess = useSaveEventAccess();
  const { data: categories = [] } = useEventCategories();
  const { data: currentRule, isPending: isRulePending } = useEventAccess(event?.id ?? '', Boolean(event));
  const canSetTiers = can('tiers.manage');
  const { data: tiers = [] } = useTiers(canSetTiers);
  const coverInput = useRef<HTMLInputElement>(null);

  const start = event?.startsAt ?? defaultStart();
  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    coverUrl: event?.coverUrl ?? null,
    startsAt: toLocalInput(start),
    endsAt: toLocalInput(event?.endsAt ?? new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString()),
    locationType: event?.locationType ?? 'ONLINE',
    location: event?.location ?? '',
    link: event?.link ?? '',
    category: event?.category ?? '',
    capacity: event?.capacity ? String(event.capacity) : '',
    status: (event?.status ?? 'DRAFT') as EventStatus,
    recordingUrl: event?.recordingUrl ?? '',
  });
  const [rule, setRule] = useState<AccessRuleInput>({ minRole: null, tierIds: [], minDays: null, minLevel: null });
  const { data: points } = useHowPointsWork();
  const [ruleLoaded, setRuleLoaded] = useState(!event);
  const [isUploading, setIsUploading] = useState(false);

  // Fill the access section once the event's current rule has loaded
  useEffect(() => {
    if (event && !isRulePending && !ruleLoaded) {
      setRule({ minRole: currentRule?.minRole ?? null, tierIds: currentRule?.tierIds ?? [], minDays: currentRule?.minDays ?? null, minLevel: currentRule?.minLevel ?? null });
      setRuleLoaded(true);
    }
  }, [event, isRulePending, currentRule, ruleLoaded]);

  useEffect(() => {
    const handleKeyDown = (keyEvent: KeyboardEvent) => keyEvent.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const update = (change: Partial<typeof form>) => setForm((current) => ({ ...current, ...change }));

  const handleCover = async (fileEvent: React.ChangeEvent<HTMLInputElement>) => {
    const file = fileEvent.target.files?.[0];
    fileEvent.target.value = '';
    if (!file) return;
    setIsUploading(true);
    try {
      update({ coverUrl: await uploadImage(file) });
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('events.form.coverFailed'), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const valid =
    form.title.trim().length >= 3 &&
    form.startsAt &&
    form.endsAt &&
    new Date(form.endsAt) > new Date(form.startsAt) &&
    (!form.capacity || Number(form.capacity) >= 1);

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    const input: EventInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      coverUrl: form.coverUrl,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      timezone: event?.timezone ?? viewerTimezone(),
      locationType: form.locationType,
      location: form.locationType === 'IN_PERSON' ? form.location.trim() || null : null,
      link: form.link.trim() || null,
      category: form.category.trim() || null,
      capacity: form.capacity ? Number(form.capacity) : null,
      status: form.status,
      ...(event ? { recordingUrl: form.recordingUrl.trim() || null } : {}),
    };
    try {
      const saved = await save.mutateAsync({ id: event?.id, input });
      await saveAccess.mutateAsync({ id: saved.id, rule });
      showToast(event ? t('events.form.updated') : form.status === 'PUBLISHED' ? t('events.published') : t('events.form.draftSaved'));
      onSaved(saved);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('events.form.saveFailed'), 'error');
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(mouseEvent) => mouseEvent.target === mouseEvent.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={event ? t('events.form.edit') : t('events.form.new')}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">{event ? t('events.form.edit') : t('events.form.new')}</h2>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            {form.coverUrl ? (
              <div className="group relative">
                <img src={form.coverUrl} alt="" className="h-36 w-full rounded-xl object-cover" />
                <button type="button" onClick={() => update({ coverUrl: null })} className="absolute end-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-white">
                  {t('events.form.removeCover')}
                </button>
              </div>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => coverInput.current?.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />} {t('events.form.addCover')}
              </Button>
            )}
            <input ref={coverInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleCover} />
          </div>

          <Field label={t('events.form.title')}>
            <input value={form.title} onChange={(e) => update({ title: e.target.value })} maxLength={120} placeholder={t('events.form.titlePlaceholder')} className={inputClass} />
          </Field>
          <Field label={t('events.form.description')}>
            <Textarea value={form.description} onChange={(e) => update({ description: e.target.value })} maxLength={5000} className="min-h-[110px]" />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('events.form.starts')}>
              <input type="datetime-local" value={form.startsAt} onChange={(e) => update({ startsAt: e.target.value })} className={inputClass} />
            </Field>
            <Field label={t('events.form.ends')}>
              <input type="datetime-local" value={form.endsAt} onChange={(e) => update({ endsAt: e.target.value })} className={inputClass} />
            </Field>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            {t('events.form.zoneNote', { zone: (event?.timezone ?? viewerTimezone()).replace('_', ' ') })}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('events.form.where')}>
              <Select
                aria-label={t('events.form.where')}
                value={form.locationType}
                onChange={(e) => update({ locationType: e.target.value as 'ONLINE' | 'IN_PERSON' })}
                options={[
                  { value: 'ONLINE', label: t('events.online') },
                  { value: 'IN_PERSON', label: t('events.inPerson') },
                ]}
              />
            </Field>
            {form.locationType === 'IN_PERSON' && (
              <Field label={t('events.form.venue')}>
                <input value={form.location} onChange={(e) => update({ location: e.target.value })} maxLength={200} className={inputClass} />
              </Field>
            )}
          </div>
          <Field label={t('events.form.link')} hint={t('events.form.linkHint')}>
            <input value={form.link} onChange={(e) => update({ link: e.target.value })} placeholder="https://…" className={inputClass} />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t('events.form.category')}>
              <input list="event-categories" value={form.category} onChange={(e) => update({ category: e.target.value })} maxLength={40} placeholder={t('events.form.categoryPlaceholder')} className={inputClass} />
              <datalist id="event-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </Field>
            <Field label={t('events.form.spots')}>
              <input type="number" min={1} value={form.capacity} onChange={(e) => update({ capacity: e.target.value })} placeholder={t('events.form.unlimited')} className={inputClass} />
            </Field>
            <Field label={t('events.form.status')}>
              <Select
                aria-label={t('events.form.status')}
                value={form.status}
                onChange={(e) => update({ status: e.target.value as EventStatus })}
                options={[
                  { value: 'DRAFT', label: t('events.form.draftOption') },
                  { value: 'PUBLISHED', label: t('common.published') },
                  ...(event ? [{ value: 'CANCELLED', label: t('common.cancelled') }] : []),
                ]}
              />
            </Field>
          </div>

          {event && (
            <Field label={t('events.form.recording')} hint={t('events.form.recordingHint')}>
              <input value={form.recordingUrl} onChange={(e) => update({ recordingUrl: e.target.value })} placeholder="https://…" className={inputClass} />
            </Field>
          )}

          <div className="space-y-3 rounded-xl border border-border p-4">
            <p className="text-sm font-bold">{t('events.form.whoCanAttend')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t('common.access.role')}>
                <Select
                  aria-label={t('common.access.minRole')}
                  value={rule.minRole ?? ''}
                  onChange={(e) => setRule({ ...rule, minRole: e.target.value || null })}
                  options={[
                    { value: '', label: t('common.access.everyMember') },
                    { value: 'INSTRUCTOR', label: t('common.access.instructorsTeam') },
                    { value: 'MODERATOR', label: t('common.access.moderatorsUp') },
                  ]}
                />
              </Field>
              <Field label={t('common.access.days')}>
                <input
                  type="number"
                  min={1}
                  value={rule.minDays ?? ''}
                  onChange={(e) => setRule({ ...rule, minDays: e.target.value ? Number(e.target.value) : null })}
                  placeholder={t('common.access.noMinimum')}
                  className={inputClass}
                />
              </Field>
              <Field label={t('common.access.level')}>
                <Select
                  aria-label={t('common.access.minLevel')}
                  value={rule.minLevel ? String(rule.minLevel) : ''}
                  onChange={(e) => setRule({ ...rule, minLevel: e.target.value ? Number(e.target.value) : null })}
                  options={levelOptions(points?.levels, t)}
                />
              </Field>
            </div>
            {canSetTiers && tiers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">{t('common.access.tiers')}</span>
                <div className="flex flex-wrap gap-3">
                  {tiers.map((tier) => (
                    <label key={tier.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={rule.tierIds.includes(tier.id)}
                        onChange={(e) =>
                          setRule({ ...rule, tierIds: e.target.checked ? [...rule.tierIds, tier.id] : rule.tierIds.filter((id) => id !== tier.id) })
                        }
                        className="accent-[var(--primary)]"
                      />
                      {tier.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border bg-secondary/10 px-6 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={!valid || !ruleLoaded || save.isPending || saveAccess.isPending || isUploading}>
            {save.isPending || saveAccess.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : event ? t('common.save') : t('events.form.create')}
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

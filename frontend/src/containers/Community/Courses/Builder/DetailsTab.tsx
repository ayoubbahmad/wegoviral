'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { Textarea } from '@/components/Textarea';
import { useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { useAdminMembers } from '@/containers/Admin/api';
import { useTiers } from '@/containers/Admin/api/moderation';
import { levelOptions } from '@/lib/levels';
import { useHowPointsWork } from '@/containers/Community/Leaderboard/api';
import { CourseStatus, EditableCourse } from '@/types/courses';
import { uploadImage } from '../../api';
import type { AccessRuleInput } from '../../Events/api';
import { useCourseAccess, useDeleteCourse, useSaveCourseAccess, useUpdateCourse } from '../api';
import { useT } from '@/i18n/provider';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
    {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
  </label>
);


export const DetailsTab = ({ course }: { course: EditableCourse }) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <DetailsCard course={course} />
    <div className="space-y-6">
      <AccessCard courseId={course.id} />
      <DangerCard course={course} />
    </div>
  </div>
);

const DetailsCard = ({ course }: { course: EditableCourse }) => {
  const t = useT();
  const { showToast } = useToast();
  const save = useUpdateCourse();
  const { data: points } = useHowPointsWork();
  const [form, setForm] = useState({
    title: course.title,
    description: course.description,
    coverUrl: course.coverUrl,
    status: course.status,
    completionBadgeId: course.completionBadgeId ?? '',
    ownerId: course.ownerId,
  });
  const [uploading, setUploading] = useState(false);
  const update = (change: Partial<typeof form>) => setForm((current) => ({ ...current, ...change }));

  const handleCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      update({ coverUrl: await uploadImage(file) });
    } catch (error) {
      showToast(error instanceof Error ? error.message : t('courses.builder.details.coverFailed'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () =>
    save.mutate(
      {
        id: course.id,
        input: {
          title: form.title.trim(),
          description: form.description.trim(),
          coverUrl: form.coverUrl,
          status: form.status,
          completionBadgeId: form.completionBadgeId || null,
          ...(course.canChangeOwner ? { ownerId: form.ownerId } : {}),
        },
      },
      {
        onSuccess: () => showToast(form.status === 'PUBLISHED' && course.status !== 'PUBLISHED' ? t('courses.builder.details.published') : t('courses.builder.details.saved')),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Card className="space-y-4">
      <h2 className="font-bold">{t('courses.builder.details.title')}</h2>
      <Field label={t('courses.builder.details.courseTitle')}>
        <input value={form.title} maxLength={120} onChange={(e) => update({ title: e.target.value })} className={inputClass} />
      </Field>
      <Field label={t('courses.builder.details.description')} hint={t('courses.builder.details.descriptionHint')}>
        <Textarea value={form.description} maxLength={5000} onChange={(e) => update({ description: e.target.value })} className="min-h-[120px]" />
      </Field>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">{t('courses.builder.details.cover')}</span>
        {form.coverUrl ? (
          <div className="relative">
            <img src={form.coverUrl} alt="" className="h-40 w-full rounded-xl object-cover" />
            <button aria-label={t('courses.builder.details.removeCover')} onClick={() => update({ coverUrl: null })} className="absolute end-2 top-2 rounded-lg bg-background/90 p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-28 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:bg-secondary/30">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />} {t('courses.builder.details.uploadCover')}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCover} className="hidden" />
          </label>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('courses.builder.details.status')}>
          <Select
            aria-label={t('courses.builder.details.status')}
            value={form.status}
            onChange={(e) => update({ status: e.target.value as CourseStatus })}
            options={[
              { value: 'DRAFT', label: t('courses.builder.details.statusDraft') },
              { value: 'PUBLISHED', label: t('courses.builder.details.statusPublished') },
              { value: 'ARCHIVED', label: t('courses.builder.details.statusArchived') },
            ]}
          />
        </Field>
        <Field label={t('courses.builder.details.badge')} hint={t('courses.builder.details.badgeHint')}>
          <Select
            aria-label={t('courses.builder.details.badge')}
            value={form.completionBadgeId}
            onChange={(e) => update({ completionBadgeId: e.target.value })}
            options={[{ value: '', label: t('courses.builder.details.noBadge') }, ...(points?.badges ?? []).map((badge) => ({ value: badge.id, label: `${badge.emoji} ${badge.name}` }))]}
          />
        </Field>
      </div>
      {course.canChangeOwner && <OwnerField value={form.ownerId} current={course} onChange={(ownerId) => update({ ownerId })} />}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={form.title.trim().length < 3 || save.isPending || uploading}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('courses.builder.details.save')}
        </Button>
      </div>
    </Card>
  );
};

/** Admins can hand a course to another instructor or admin. */
const OwnerField = ({ value, current, onChange }: { value: string; current: EditableCourse; onChange: (id: string) => void }) => {
  const t = useT();
  const filters = { sort: 'name' as const, page: 1 };
  const instructors = useAdminMembers({ ...filters, role: 'INSTRUCTOR' });
  const admins = useAdminMembers({ ...filters, role: 'ADMIN' });
  const superAdmins = useAdminMembers({ ...filters, role: 'SUPER_ADMIN' });
  const people = [current.owner, ...[instructors, admins, superAdmins].flatMap((query) => query.data?.members ?? [])];
  const unique = [...new Map(people.map((person) => [person.id, person])).values()];
  return (
    <Field label={t('courses.builder.details.instructor')}>
      <Select
        aria-label={t('courses.builder.details.instructor')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={unique.map((person) => ({ value: person.id, label: person.name ? `${person.name} (@${person.username})` : `@${person.username}` }))}
      />
    </Field>
  );
};

const AccessCard = ({ courseId }: { courseId: string }) => {
  const { data: currentRule, isPending } = useCourseAccess(courseId);
  if (isPending) return <Skeleton className="h-48 rounded-2xl" />;
  return (
    <AccessForm
      courseId={courseId}
      initial={{ minRole: currentRule?.minRole ?? null, tierIds: currentRule?.tierIds ?? [], minDays: currentRule?.minDays ?? null, minLevel: currentRule?.minLevel ?? null }}
    />
  );
};

const AccessForm = ({ courseId, initial }: { courseId: string; initial: AccessRuleInput }) => {
  const t = useT();
  const can = useCan();
  const { showToast } = useToast();
  const save = useSaveCourseAccess();
  const canSetTiers = can('tiers.manage');
  const { data: tiers = [] } = useTiers(canSetTiers);
  const { data: points } = useHowPointsWork();
  const [rule, setRule] = useState<AccessRuleInput>(initial);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-bold">{t('courses.builder.details.accessTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('courses.builder.details.accessBody')}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t('common.access.role')}>
          <Select
            aria-label={t('common.access.minRole')}
            value={rule.minRole ?? ''}
            onChange={(e) => setRule({ ...rule, minRole: e.target.value || null })}
            options={[
              { value: '', label: t('common.access.everyMember') },
              { value: 'INSTRUCTOR', label: t('common.access.instructorsTeam') },
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
                  onChange={(e) => setRule({ ...rule, tierIds: e.target.checked ? [...rule.tierIds, tier.id] : rule.tierIds.filter((id) => id !== tier.id) })}
                  className="accent-[var(--primary)]"
                />
                {tier.name}
              </label>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{t('courses.builder.details.dripHint')}</p>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() =>
            save.mutate(
              { id: courseId, rule },
              { onSuccess: (saved) => showToast(saved ? t('courses.builder.details.accessSaved') : t('courses.builder.details.accessOpen')), onError: (error) => showToast(error.message, 'error') },
            )
          }
          disabled={save.isPending || (rule.minDays !== null && (!Number.isInteger(rule.minDays) || rule.minDays < 1))}
        >
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('courses.builder.details.saveAccess')}
        </Button>
      </div>
    </Card>
  );
};

const DangerCard = ({ course }: { course: EditableCourse }) => {
  const t = useT();
  const router = useRouter();
  const { showToast } = useToast();
  const remove = useDeleteCourse();
  return (
    <Card className="space-y-3">
      <h2 className="font-bold">{t('courses.builder.details.deleteTitle')}</h2>
      <p className="text-sm text-muted-foreground">{t('courses.builder.details.deleteBody')}</p>
      <Button
        variant="ghost"
        className="text-red-500 hover:bg-red-500/10"
        disabled={remove.isPending}
        onClick={() =>
          window.confirm(t('courses.builder.details.deleteConfirm', { title: course.title })) &&
          remove.mutate(course.id, {
            onSuccess: () => {
              showToast(t('courses.builder.details.deleted'));
              router.push('/community/courses');
            },
            onError: (error) => showToast(error.message, 'error'),
          })
        }
      >
        {t('courses.builder.details.deleteTitle')}
      </Button>
    </Card>
  );
};

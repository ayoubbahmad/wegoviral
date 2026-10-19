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
import { levelOptions } from '@/containers/Admin/Spaces/AccessEditor';
import { useHowPointsWork } from '@/containers/Community/Leaderboard/api';
import { CourseStatus, EditableCourse } from '@/types/courses';
import { uploadImage } from '../../api';
import type { AccessRuleInput } from '../../Events/api';
import { useCourseAccess, useDeleteCourse, useSaveCourseAccess, useUpdateCourse } from '../api';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
    {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

const STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft (only you and admins)' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived (kept for members who started)' },
];

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
      showToast(error instanceof Error ? error.message : 'Could not upload the cover', 'error');
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
        onSuccess: () => showToast(form.status === 'PUBLISHED' && course.status !== 'PUBLISHED' ? 'Course published 🎉' : 'Course saved'),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Card className="space-y-4">
      <h2 className="font-bold">Details</h2>
      <Field label="Title">
        <input value={form.title} maxLength={120} onChange={(e) => update({ title: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Description" hint="What members will learn and who it's for.">
        <Textarea value={form.description} maxLength={5000} onChange={(e) => update({ description: e.target.value })} className="min-h-[120px]" />
      </Field>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Cover image</span>
        {form.coverUrl ? (
          <div className="relative">
            <img src={form.coverUrl} alt="" className="h-40 w-full rounded-xl object-cover" />
            <button aria-label="Remove cover" onClick={() => update({ coverUrl: null })} className="absolute right-2 top-2 rounded-lg bg-background/90 p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex h-28 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:bg-secondary/30">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />} Upload a cover (16:9 works best)
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCover} className="hidden" />
          </label>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status">
          <Select aria-label="Status" value={form.status} onChange={(e) => update({ status: e.target.value as CourseStatus })} options={STATUS_OPTIONS} />
        </Field>
        <Field label="Badge for finishing" hint="Members who finish also get the Course graduate badge and points.">
          <Select
            aria-label="Badge for finishing"
            value={form.completionBadgeId}
            onChange={(e) => update({ completionBadgeId: e.target.value })}
            options={[{ value: '', label: 'No extra badge' }, ...(points?.badges ?? []).map((badge) => ({ value: badge.id, label: `${badge.emoji} ${badge.name}` }))]}
          />
        </Field>
      </div>
      {course.canChangeOwner && <OwnerField value={form.ownerId} current={course} onChange={(ownerId) => update({ ownerId })} />}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={form.title.trim().length < 3 || save.isPending || uploading}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save details'}
        </Button>
      </div>
    </Card>
  );
};

/** Admins can hand a course to another instructor or admin. */
const OwnerField = ({ value, current, onChange }: { value: string; current: EditableCourse; onChange: (id: string) => void }) => {
  const filters = { sort: 'name' as const, page: 1 };
  const instructors = useAdminMembers({ ...filters, role: 'INSTRUCTOR' });
  const admins = useAdminMembers({ ...filters, role: 'ADMIN' });
  const superAdmins = useAdminMembers({ ...filters, role: 'SUPER_ADMIN' });
  const people = [current.owner, ...[instructors, admins, superAdmins].flatMap((query) => query.data?.members ?? [])];
  const unique = [...new Map(people.map((person) => [person.id, person])).values()];
  return (
    <Field label="Instructor">
      <Select
        aria-label="Instructor"
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
        <h2 className="font-bold">Who can take this course</h2>
        <p className="text-sm text-muted-foreground">Members who don&apos;t match see the course with a lock and the reason. The team always has access.</p>
      </div>
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
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Tiers (none ticked = every tier)</span>
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
      <p className="text-xs text-muted-foreground">To release modules over time, set &ldquo;Opens … days after a member starts&rdquo; on each module in the Content tab.</p>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() =>
            save.mutate(
              { id: courseId, rule },
              { onSuccess: (saved) => showToast(saved ? 'Access saved' : 'Open to every member'), onError: (error) => showToast(error.message, 'error') },
            )
          }
          disabled={save.isPending || (rule.minDays !== null && (!Number.isInteger(rule.minDays) || rule.minDays < 1))}
        >
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save access'}
        </Button>
      </div>
    </Card>
  );
};

const DangerCard = ({ course }: { course: EditableCourse }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const remove = useDeleteCourse();
  return (
    <Card className="space-y-3">
      <h2 className="font-bold">Delete course</h2>
      <p className="text-sm text-muted-foreground">Removes it for everyone, including members who started. To hide it but keep it for them, archive it instead.</p>
      <Button
        variant="ghost"
        className="text-red-500 hover:bg-red-500/10"
        disabled={remove.isPending}
        onClick={() =>
          window.confirm(`Delete “${course.title}”? This can't be undone.`) &&
          remove.mutate(course.id, {
            onSuccess: () => {
              showToast('Course deleted');
              router.push('/community/courses');
            },
            onError: (error) => showToast(error.message, 'error'),
          })
        }
      >
        Delete course
      </Button>
    </Card>
  );
};

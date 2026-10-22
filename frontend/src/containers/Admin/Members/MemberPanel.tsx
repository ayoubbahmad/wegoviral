'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { useAuth } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { avatarFor, formatRelativeDate } from '@/lib/utils';
import { UserRole } from '@/lib/roles';
import { useAdminMember, useChangeRole, useLiftRestriction, useRestrictMember } from '../api';
import { RoleBadge, StatusBadge } from '../components/Badges';
import { describeActivity } from '../components/describeActivity';
import { MemberDetail, RestrictionInput } from '../types';
import { JoiningSection } from './JoiningSection';
import { PointsSection } from './PointsSection';
import { useWarnMember } from '../api/moderation';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

const DURATIONS = [1, 3, 7, 30, 90];

interface MemberPanelProps {
  memberId: string | null;
  onClose: () => void;
}

export const MemberPanel = ({ memberId, onClose }: MemberPanelProps) => {
  const t = useT();
  const { data: member, isPending, error } = useAdminMember(memberId);

  useEffect(() => {
    if (!memberId) return;
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [memberId, onClose]);

  if (!memberId) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('admin.panel.label')}
        className="relative h-full w-full max-w-md overflow-y-auto border-s border-border bg-card shadow-2xl animate-in slide-in-from-right rtl:slide-in-from-left duration-200"
      >
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          className="absolute end-4 top-4 p-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {isPending ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="p-6 text-sm text-muted-foreground">{error.message}</p>
        ) : (
          // Remount per member so forms start fresh
          <MemberDetails key={member.id} member={member} />
        )}
      </aside>
    </div>,
    document.body,
  );
};

const MemberDetails = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { user } = useAuth();
  const { allowedActions } = member;
  const isSelf = user?.id === member.id;
  const canAct = allowedActions.changeRole || allowedActions.restrict || allowedActions.setSpecial;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4 pe-10">
        <img src={avatarFor(member)} alt="" className="w-14 h-14 rounded-full border border-border" />
        <div className="min-w-0">
          <h2 className="text-lg font-bold truncate">{member.name || `@${member.username}`}</h2>
          <p className="text-sm text-muted-foreground truncate">@{member.username}</p>
          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <RoleBadge role={member.role} />
        <StatusBadge status={member.status} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        {[
          [t('admin.panel.posts'), member.postCount],
          [t('admin.panel.comments'), member.commentCount],
          [t('admin.panel.likesGiven'), member.likesGiven],
          [t('admin.panel.likesReceived'), member.likesReceived],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-secondary/30 p-3">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-lg font-bold tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="col-span-2 rounded-xl bg-secondary/30 p-3">
          <dt className="text-xs text-muted-foreground">{t('admin.panel.joined')}</dt>
          <dd className="font-semibold">{new Date(member.createdAt).toLocaleDateString(activeIntl())}</dd>
        </div>
      </dl>

      {member.deletionRequestedAt && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {t('admin.panel.deletionRequested', { date: new Date(member.deletionRequestedAt).toLocaleDateString(activeIntl(), { dateStyle: 'long' }) })}
        </p>
      )}

      <JoiningSection member={member} />

      <PointsSection member={member} />

      {member.status !== 'ACTIVE' && <CurrentRestriction member={member} />}

      {!canAct && (
        <p className="flex items-start gap-2 rounded-xl border border-border p-3 text-sm text-muted-foreground">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          {isSelf
            ? t('admin.panel.isYou')
            : t('admin.panel.cantManage')}
        </p>
      )}

      {allowedActions.changeRole && <RoleForm member={member} />}
      {allowedActions.restrict && <WarnForm member={member} />}
      {allowedActions.restrict && member.status === 'ACTIVE' && <RestrictForm member={member} />}

      <section className="space-y-3">
        <h3 className="text-sm font-bold">{t('admin.panel.history')}</h3>
        {member.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('admin.panel.noHistory')}</p>
        ) : (
          <ul className="space-y-3">
            {member.history.map((entry) => (
              <li key={entry.id} className="text-sm">
                <span className="font-semibold">{entry.actor ? `@${entry.actor.username}` : t('admin.panel.someone')}</span>{' '}
                {describeActivity(entry, t)}
                <span className="block text-xs text-muted-foreground">{formatRelativeDate(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const CurrentRestriction = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const lift = useLiftRestriction();
  const canLift = member.allowedActions.restrict && (member.status !== 'BANNED' || member.allowedActions.ban);

  return (
    <section className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
      <p className="font-semibold">
        {t(`common.statuses.${member.status}`)}{' '}
        {member.statusUntil ? t('admin.panel.until', { date: new Date(member.statusUntil).toLocaleString(activeIntl()) }) : t('admin.panel.untilLifted')}
      </p>
      {member.statusReason && <p className="text-muted-foreground">{t('admin.panel.reason', { reason: member.statusReason })}</p>}
      {canLift && (
        <Button
          variant="outline"
          size="sm"
          disabled={lift.isPending}
          onClick={() =>
            lift.mutate(member.id, {
              onSuccess: () => showToast(t('admin.panel.lifted')),
              onError: (error) => showToast(error.message, 'error'),
            })
          }
        >
          {lift.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.panel.lift')}
        </Button>
      )}
    </section>
  );
};

const RoleForm = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const changeRole = useChangeRole();
  const [role, setRole] = useState<UserRole>(member.role);

  const handleSave = () => {
    const isPowerful = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (isPowerful && !window.confirm(t('admin.panel.makeConfirm', { username: member.username, role: t(`common.roles.${role}`) }))) {
      return;
    }
    changeRole.mutate(
      { id: member.id, role },
      {
        onSuccess: () => showToast(t('admin.panel.roleChanged', { username: member.username, role: t(`common.roles.${role}`) })),
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-bold">{t('admin.panel.role')}</h3>
      <div className="flex gap-2">
        <Select
          aria-label={t('admin.panel.role')}
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          options={member.allowedActions.assignableRoles.map((value) => ({ value, label: t(`common.roles.${value}`) }))}
        />
        <Button variant="primary" onClick={handleSave} disabled={role === member.role || changeRole.isPending}>
          {changeRole.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.save')}
        </Button>
      </div>
    </section>
  );
};

const RestrictForm = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const restrict = useRestrictMember();
  const { allowedActions } = member;
  const [status, setStatus] = useState<RestrictionInput['status']>('MUTED');
  const [duration, setDuration] = useState('3');
  const [reason, setReason] = useState('');

  const durationOptions = [
    ...DURATIONS.filter((days) => allowedActions.maxRestrictionDays === null || days <= allowedActions.maxRestrictionDays).map(
      (days) => ({ value: String(days), label: t('admin.panel.days', { count: days }) }),
    ),
    ...(allowedActions.indefinite ? [{ value: 'indefinite', label: t('admin.panel.untilLiftedOption') }] : []),
  ];
  const isBan = status === 'BANNED';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (reason.trim().length < 3) return;
    if (isBan && !window.confirm(t('admin.panel.banConfirm', { username: member.username }))) return;
    restrict.mutate(
      {
        id: member.id,
        input: {
          status,
          reason: reason.trim(),
          // A ban never expires on its own
          durationDays: isBan || duration === 'indefinite' ? null : Number(duration),
        },
      },
      {
        onSuccess: () => {
          showToast(t('admin.panel.restricted', { username: member.username, status: t(`common.statuses.${status}`).toLowerCase() }));
          setReason('');
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-bold">{t('admin.panel.restrict')}</h3>
      <div className="grid grid-cols-2 gap-2">
        <Select
          aria-label={t('admin.panel.restriction')}
          value={status}
          onChange={(event) => setStatus(event.target.value as RestrictionInput['status'])}
          options={[
            { value: 'MUTED', label: t('admin.panel.mute') },
            { value: 'SUSPENDED', label: t('admin.panel.suspend') },
            ...(allowedActions.ban ? [{ value: 'BANNED', label: t('admin.panel.ban') }] : []),
          ]}
        />
        <Select
          aria-label={t('admin.panel.duration')}
          value={isBan ? 'indefinite' : duration}
          disabled={isBan}
          onChange={(event) => setDuration(event.target.value)}
          options={isBan ? [{ value: 'indefinite', label: t('admin.panel.permanent') }] : durationOptions}
        />
      </div>
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder={t('admin.panel.reasonPlaceholder')}
        maxLength={500}
        className="min-h-[80px]"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={reason.trim().length < 3 || restrict.isPending}
        className={isBan ? 'bg-red-500 hover:bg-red-600' : undefined}
      >
        {restrict.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isBan ? t('admin.panel.banMember') : t('admin.panel.apply')}
      </Button>
    </form>
  );
};

const WarnForm = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const warn = useWarnMember();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {t('admin.panel.sendWarning')}
      </Button>
    );
  }

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold">{t('admin.panel.warning')}</h3>
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder={t('admin.panel.warningPlaceholder')}
        maxLength={500}
        className="min-h-[80px]"
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>{t('common.cancel')}</Button>
        <Button
          variant="primary"
          size="sm"
          disabled={reason.trim().length < 3 || warn.isPending}
          onClick={() =>
            warn.mutate(
              { id: member.id, reason: reason.trim() },
              {
                onSuccess: () => {
                  showToast(t('admin.panel.warningSent', { username: member.username }));
                  setReason('');
                  setIsOpen(false);
                },
                onError: (error) => showToast(error.message, 'error'),
              },
            )
          }
        >
          {warn.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.panel.send')}
        </Button>
      </div>
    </section>
  );
};

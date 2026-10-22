'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { useToast } from '@/providers/Toast';
import { formatRelativeDate } from '@/lib/utils';
import { useAdjustPoints, useAwardBadge, useGamification, useRemoveBadge } from '../api/gamification';
import { MemberDetail } from '../types';
import { useT } from '@/i18n/provider';

const inputClass =
  'w-full h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

/** Level, points and badges; admins can award badges and adjust points. */
export const PointsSection = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { level, points, badges, allowedActions } = member;
  const { showToast } = useToast();
  const remove = useRemoveBadge();
  const [form, setForm] = useState<'badge' | 'points' | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold">{t('admin.pointsSection.title')}</h3>
        <span className="text-sm text-muted-foreground">
          {t('admin.pointsSection.summary', { points, level: level.level, name: level.name })}
        </span>
      </div>

      {badges.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('admin.pointsSection.noBadges')}</p>
      ) : (
        <ul className="space-y-2">
          {badges.map((row) => (
            <li key={row.badge.id} className="flex items-start gap-3 rounded-xl bg-secondary/30 px-3 py-2 text-sm">
              <span className="text-lg leading-none">{row.badge.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {row.badge.name}
                  {row.badge.archivedAt && <span className="ms-1 text-xs font-normal text-muted-foreground">{t('admin.pointsSection.archived')}</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.awardedBy ? t('admin.pointsSection.givenBy', { username: row.awardedBy.username }) : t('admin.pointsSection.automatic')} · {formatRelativeDate(row.awardedAt)}
                  {row.note && ` · “${row.note}”`}
                </p>
              </div>
              {allowedActions.manageGamification && (
                <button
                  aria-label={t('admin.pointsSection.removeLabel', { name: row.badge.name })}
                  disabled={remove.isPending}
                  onClick={() =>
                    window.confirm(t('admin.pointsSection.removeConfirm', { name: row.badge.name, username: member.username })) &&
                    remove.mutate(
                      { memberId: member.id, badgeId: row.badge.id },
                      { onSuccess: () => showToast(t('admin.pointsSection.removed')), onError: (error) => showToast(error.message, 'error') },
                    )
                  }
                  className="rounded-lg p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {allowedActions.manageGamification &&
        (form === 'badge' ? (
          <AwardBadgeForm member={member} onDone={() => setForm(null)} />
        ) : form === 'points' ? (
          <AdjustPointsForm member={member} onDone={() => setForm(null)} />
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setForm('badge')}>{t('admin.pointsSection.giveBadge')}</Button>
            <Button variant="outline" size="sm" onClick={() => setForm('points')}>{t('admin.pointsSection.adjustPoints')}</Button>
          </div>
        ))}
    </section>
  );
};

const AwardBadgeForm = ({ member, onDone }: { member: MemberDetail; onDone: () => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const { data } = useGamification();
  const award = useAwardBadge();
  const held = new Set(member.badges.map((row) => row.badge.id));
  const available = (data?.badges ?? []).filter((badge) => !badge.archivedAt && !held.has(badge.id));
  const [badgeId, setBadgeId] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      {data && available.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('admin.pointsSection.hasAll')}</p>
      ) : (
        <>
          <Select
            aria-label={t('admin.pointsSection.badge')}
            value={badgeId}
            onChange={(event) => setBadgeId(event.target.value)}
            options={[
              { value: '', label: t('admin.pointsSection.chooseBadge') },
              ...available.map((badge) => ({ value: badge.id, label: `${badge.emoji} ${badge.name}${badge.autoRule ? t('admin.pointsSection.automaticTag') : ''}` })),
            ]}
          />
          <input value={note} onChange={(event) => setNote(event.target.value)} maxLength={200} placeholder={t('admin.pointsSection.notePlaceholder')} className={inputClass} />
        </>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone}>{t('common.cancel')}</Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!badgeId || award.isPending}
          onClick={() =>
            award.mutate(
              { memberId: member.id, badgeId, note: note.trim() },
              {
                onSuccess: () => {
                  showToast(t('admin.pointsSection.given', { username: member.username }));
                  onDone();
                },
                onError: (error) => showToast(error.message, 'error'),
              },
            )
          }
        >
          {award.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.pointsSection.give')}
        </Button>
      </div>
    </div>
  );
};

const AdjustPointsForm = ({ member, onDone }: { member: MemberDetail; onDone: () => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const adjust = useAdjustPoints();
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const value = Number(points);
  const valid = Number.isInteger(value) && value !== 0 && Math.abs(value) <= 10000 && reason.trim().length >= 3;

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <div className="grid grid-cols-[110px_1fr] gap-2">
        <input type="number" value={points} onChange={(event) => setPoints(event.target.value)} placeholder={t('admin.pointsSection.pointsPlaceholder')} aria-label={t('admin.pointsSection.points')} className={inputClass} />
        <input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={200} placeholder={t('admin.pointsSection.reasonPlaceholder')} className={inputClass} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone}>{t('common.cancel')}</Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!valid || adjust.isPending}
          onClick={() =>
            adjust.mutate(
              { memberId: member.id, points: value, reason: reason.trim() },
              {
                onSuccess: (result) => {
                  showToast(t('admin.pointsSection.adjusted', { username: member.username, points: result.points }));
                  onDone();
                },
                onError: (error) => showToast(error.message, 'error'),
              },
            )
          }
        >
          {adjust.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.save')}
        </Button>
      </div>
    </div>
  );
};

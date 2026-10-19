'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { useToast } from '@/providers/Toast';
import { formatRelativeDate } from '@/lib/utils';
import { useAdjustPoints, useAwardBadge, useGamification, useRemoveBadge } from '../api/gamification';
import { MemberDetail } from '../types';

const inputClass =
  'w-full h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

/** Level, points and badges; admins can award badges and adjust points. */
export const PointsSection = ({ member }: { member: MemberDetail }) => {
  const { level, points, badges, allowedActions } = member;
  const { showToast } = useToast();
  const remove = useRemoveBadge();
  const [form, setForm] = useState<'badge' | 'points' | null>(null);

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold">Points & badges</h3>
        <span className="text-sm text-muted-foreground">
          {points.toLocaleString()} pts · Level {level.level} ({level.name})
        </span>
      </div>

      {badges.length === 0 ? (
        <p className="text-sm text-muted-foreground">No badges yet.</p>
      ) : (
        <ul className="space-y-2">
          {badges.map((row) => (
            <li key={row.badge.id} className="flex items-start gap-3 rounded-xl bg-secondary/30 px-3 py-2 text-sm">
              <span className="text-lg leading-none">{row.badge.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {row.badge.name}
                  {row.badge.archivedAt && <span className="ml-1 text-xs font-normal text-muted-foreground">(archived)</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.awardedBy ? `Given by @${row.awardedBy.username}` : 'Earned automatically'} · {formatRelativeDate(row.awardedAt)}
                  {row.note && ` · “${row.note}”`}
                </p>
              </div>
              {allowedActions.manageGamification && (
                <button
                  aria-label={`Remove ${row.badge.name}`}
                  disabled={remove.isPending}
                  onClick={() =>
                    window.confirm(`Remove the ${row.badge.name} badge from @${member.username}?`) &&
                    remove.mutate(
                      { memberId: member.id, badgeId: row.badge.id },
                      { onSuccess: () => showToast('Badge removed'), onError: (error) => showToast(error.message, 'error') },
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
            <Button variant="outline" size="sm" onClick={() => setForm('badge')}>Give a badge</Button>
            <Button variant="outline" size="sm" onClick={() => setForm('points')}>Adjust points</Button>
          </div>
        ))}
    </section>
  );
};

const AwardBadgeForm = ({ member, onDone }: { member: MemberDetail; onDone: () => void }) => {
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
        <p className="text-sm text-muted-foreground">This member already has every badge.</p>
      ) : (
        <>
          <Select
            aria-label="Badge"
            value={badgeId}
            onChange={(event) => setBadgeId(event.target.value)}
            options={[
              { value: '', label: 'Choose a badge' },
              ...available.map((badge) => ({ value: badge.id, label: `${badge.emoji} ${badge.name}${badge.autoRule ? ' (automatic)' : ''}` })),
            ]}
          />
          <input value={note} onChange={(event) => setNote(event.target.value)} maxLength={200} placeholder="Why? (optional, only the team sees it)" className={inputClass} />
        </>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!badgeId || award.isPending}
          onClick={() =>
            award.mutate(
              { memberId: member.id, badgeId, note: note.trim() },
              {
                onSuccess: () => {
                  showToast(`Badge given to @${member.username}`);
                  onDone();
                },
                onError: (error) => showToast(error.message, 'error'),
              },
            )
          }
        >
          {award.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Give badge'}
        </Button>
      </div>
    </div>
  );
};

const AdjustPointsForm = ({ member, onDone }: { member: MemberDetail; onDone: () => void }) => {
  const { showToast } = useToast();
  const adjust = useAdjustPoints();
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const value = Number(points);
  const valid = Number.isInteger(value) && value !== 0 && Math.abs(value) <= 10000 && reason.trim().length >= 3;

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <div className="grid grid-cols-[110px_1fr] gap-2">
        <input type="number" value={points} onChange={(event) => setPoints(event.target.value)} placeholder="+50 or -20" aria-label="Points" className={inputClass} />
        <input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={200} placeholder="Reason (shown in the activity log)" className={inputClass} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!valid || adjust.isPending}
          onClick={() =>
            adjust.mutate(
              { memberId: member.id, points: value, reason: reason.trim() },
              {
                onSuccess: (result) => {
                  showToast(`@${member.username} now has ${result.points.toLocaleString()} points`);
                  onDone();
                },
                onError: (error) => showToast(error.message, 'error'),
              },
            )
          }
        >
          {adjust.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};

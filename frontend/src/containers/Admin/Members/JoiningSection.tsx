'use client';

import { Check, Loader2, Phone, Star, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast } from '@/providers/Toast';
import { useReviewApplication, useSetSpecialMember } from '../api/joining';
import { useSetMemberTier, useTiers } from '../api/moderation';
import { Select } from '@/components/Select';
import { MemberDetail } from '../types';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

/** How the member joined: application answers, referrer, rules acceptance and special status. */
export const JoiningSection = ({ member }: { member: MemberDetail }) => {
  const t = useT();
  const { showToast } = useToast();
  const setSpecial = useSetSpecialMember();
  const review = useReviewApplication();
  const { joining, allowedActions } = member;
  const { data: tiers = [] } = useTiers(allowedActions.setTier);
  const setTier = useSetMemberTier();
  const defaultTier = tiers.find((tier) => tier.isDefault);
  const application = joining.application;

  const toggleSpecial = () =>
    setSpecial.mutate(
      { id: member.id, specialMember: !member.specialMember },
      {
        onSuccess: () => showToast(member.specialMember ? t('admin.joining.specialRemoved') : t('admin.joining.specialGranted', { username: member.username })),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  const decide = (decision: 'approve' | 'reject') => {
    const note = decision === 'reject' ? window.prompt(t('admin.joining.rejectPrompt')) ?? undefined : undefined;
    review.mutate(
      { userId: member.id, decision, note: note || undefined },
      {
        onSuccess: () => showToast(decision === 'approve' ? t('admin.joining.approved') : t('admin.joining.rejected')),
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-bold">{t('admin.joining.title')}</h3>

      {member.joinStatus === 'PENDING' && (
        <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <p className="font-semibold">{application ? t('admin.joining.waiting') : t('admin.joining.noForm')}</p>
          {application && allowedActions.reviewApplication && (
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={() => decide('approve')} disabled={review.isPending}>
                {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> {t('admin.joining.approve')}</>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => decide('reject')} disabled={review.isPending}>
                <X className="w-4 h-4" /> {t('admin.joining.dontApprove')}
              </Button>
            </div>
          )}
        </div>
      )}

      {allowedActions.setSpecial && (
        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border p-3">
          <span className="text-sm">
            <span className="flex items-center gap-1.5 font-semibold">
              <Star className="w-4 h-4 text-amber-400" /> {t('admin.joining.special')}
            </span>
            <span className="block text-xs text-muted-foreground">{t('admin.joining.specialHint')}</span>
          </span>
          <input
            type="checkbox"
            checked={member.specialMember}
            onChange={toggleSpecial}
            disabled={setSpecial.isPending}
            className="mt-1 accent-[var(--primary)]"
          />
        </label>
      )}

      {allowedActions.setTier && tiers.length > 0 && (
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('admin.joining.tier')}</span>
          <Select
            aria-label={t('admin.joining.tierLabel')}
            value={member.tierId ?? ''}
            disabled={setTier.isPending}
            onChange={(event) =>
              setTier.mutate(
                { id: member.id, tierId: event.target.value || null },
                { onSuccess: () => showToast(t('admin.joining.tierUpdated')), onError: (error) => showToast(error.message, 'error') },
              )
            }
            options={[
              { value: '', label: t('admin.joining.defaultTier', { name: defaultTier?.name ?? t('admin.joining.defaultName') }) },
              ...tiers.filter((tier) => !tier.isDefault).map((tier) => ({ value: tier.id, label: tier.name })),
            ]}
          />
        </label>
      )}

      <dl className="space-y-2 text-sm">
        {(joining.phone || application?.phone) && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            <a href={`tel:${joining.phone ?? application?.phone}`} className="hover:text-primary">{joining.phone ?? application?.phone}</a>
          </div>
        )}
        {application && (
          <>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.joining.creates')}</dt>
              <dd>{application.niche}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.joining.postsOn')}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {application.platforms.map((platform, index) => (
                  <span key={index} className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs">
                    <span className="font-semibold capitalize">{platform.platform}</span> {platform.handle}
                  </span>
                ))}
              </dd>
            </div>
            {application.followerRange && (
              <div>
                <dt className="text-xs text-muted-foreground">{t('admin.joining.followers')}</dt>
                <dd>{application.followerRange}</dd>
              </div>
            )}
            {application.about && (
              <div>
                <dt className="text-xs text-muted-foreground">{t('admin.joining.about')}</dt>
                <dd className="whitespace-pre-wrap">{application.about}</dd>
              </div>
            )}
          </>
        )}
        <div>
          <dt className="text-xs text-muted-foreground">{t('admin.joining.joinedThrough')}</dt>
          <dd>
            {joining.referredBy
              ? t('admin.joining.viaReferral', { username: joining.referredBy.username })
              : application?.invite
                ? t('admin.joining.viaInvite', { label: application.invite.label })
                : t('admin.joining.viaSignup')}
            {application?.reviewedBy && t('admin.joining.approvedBy', { username: application.reviewedBy.username })}
          </dd>
        </div>
        {joining.referralCount > 0 && (
          <div>
            <dt className="text-xs text-muted-foreground">{t('admin.joining.referred')}</dt>
            <dd>
              {t('admin.joining.referredCount', { count: joining.referralCount })}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted-foreground">{t('admin.joining.probation')}</dt>
          <dd>
            {joining.probation.onProbation
              ? t('admin.joining.onProbation', { approved: joining.probation.approvedPosts, required: joining.probation.required }) +
                (joining.probation.pendingPosts ? t('admin.joining.probationWaiting', { count: joining.probation.pendingPosts }) : '')
              : t('admin.joining.notOnProbation')}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{t('admin.joining.guide')}</dt>
          <dd>
            {joining.rulesAcceptedVersion
              ? t('admin.joining.acceptedVersion', { version: joining.rulesAcceptedVersion, date: new Date(joining.rulesAcceptedAt!).toLocaleString(activeIntl()) })
              : t('admin.joining.notAccepted')}
          </dd>
          {joining.rulesAcceptances.length > 1 && (
            <dd className="mt-1 text-xs text-muted-foreground">
              {t('admin.joining.earlier', {
                list: joining.rulesAcceptances
                  .slice(1)
                  .map((entry) => `v${entry.version} (${new Date(entry.acceptedAt).toLocaleDateString(activeIntl())})`)
                  .join(', '),
              })}
            </dd>
          )}
        </div>
      </dl>
    </section>
  );
};

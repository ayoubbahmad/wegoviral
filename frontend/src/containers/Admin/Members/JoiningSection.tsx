'use client';

import { Check, Loader2, Phone, Star, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast } from '@/providers/Toast';
import { useReviewApplication, useSetSpecialMember } from '../api/joining';
import { useSetMemberTier, useTiers } from '../api/moderation';
import { Select } from '@/components/Select';
import { MemberDetail } from '../types';

/** How the member joined: application answers, referrer, rules acceptance and special status. */
export const JoiningSection = ({ member }: { member: MemberDetail }) => {
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
        onSuccess: () => showToast(member.specialMember ? 'Special status removed' : `@${member.username} is now a special member`),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  const decide = (decision: 'approve' | 'reject') => {
    const note = decision === 'reject' ? window.prompt('Message for the applicant (optional)') ?? undefined : undefined;
    review.mutate(
      { userId: member.id, decision, note: note || undefined },
      {
        onSuccess: () => showToast(decision === 'approve' ? 'Member approved' : 'Application not approved'),
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-bold">Joining</h3>

      {member.joinStatus === 'PENDING' && (
        <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <p className="font-semibold">{application ? 'Waiting for approval' : "Hasn't sent the sign-up form yet"}</p>
          {application && allowedActions.reviewApplication && (
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={() => decide('approve')} disabled={review.isPending}>
                {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve</>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => decide('reject')} disabled={review.isPending}>
                <X className="w-4 h-4" /> Don&apos;t approve
              </Button>
            </div>
          )}
        </div>
      )}

      {allowedActions.setSpecial && (
        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border p-3">
          <span className="text-sm">
            <span className="flex items-center gap-1.5 font-semibold">
              <Star className="w-4 h-4 text-amber-400" /> Special member
            </span>
            <span className="block text-xs text-muted-foreground">Skips approval, the guide and the first-posts review.</span>
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
          <span className="text-xs font-semibold text-muted-foreground">Tier (set by hand until payments are connected)</span>
          <Select
            aria-label="Tier"
            value={member.tierId ?? ''}
            disabled={setTier.isPending}
            onChange={(event) =>
              setTier.mutate(
                { id: member.id, tierId: event.target.value || null },
                { onSuccess: () => showToast('Tier updated'), onError: (error) => showToast(error.message, 'error') },
              )
            }
            options={[
              { value: '', label: `${defaultTier?.name ?? 'Default'} (default)` },
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
              <dt className="text-xs text-muted-foreground">Creates</dt>
              <dd>{application.niche}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Posts on</dt>
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
                <dt className="text-xs text-muted-foreground">Followers</dt>
                <dd>{application.followerRange}</dd>
              </div>
            )}
            {application.about && (
              <div>
                <dt className="text-xs text-muted-foreground">About</dt>
                <dd className="whitespace-pre-wrap">{application.about}</dd>
              </div>
            )}
          </>
        )}
        <div>
          <dt className="text-xs text-muted-foreground">Joined through</dt>
          <dd>
            {joining.referredBy
              ? `Referral by @${joining.referredBy.username}`
              : application?.invite
                ? `Invite link “${application.invite.label}”`
                : 'Sign-up'}
            {application?.reviewedBy && ` · approved by @${application.reviewedBy.username}`}
          </dd>
        </div>
        {joining.referralCount > 0 && (
          <div>
            <dt className="text-xs text-muted-foreground">Referred</dt>
            <dd>
              {joining.referralCount} member{joining.referralCount === 1 ? '' : 's'}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted-foreground">First posts review</dt>
          <dd>
            {joining.probation.onProbation
              ? `On probation: ${joining.probation.approvedPosts}/${joining.probation.required} posts approved${
                  joining.probation.pendingPosts ? `, ${joining.probation.pendingPosts} waiting` : ''
                }`
              : 'Not on probation'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Community guide</dt>
          <dd>
            {joining.rulesAcceptedVersion
              ? `Accepted version ${joining.rulesAcceptedVersion} on ${new Date(joining.rulesAcceptedAt!).toLocaleString()}`
              : 'Not accepted yet'}
          </dd>
          {joining.rulesAcceptances.length > 1 && (
            <dd className="mt-1 text-xs text-muted-foreground">
              Earlier: {joining.rulesAcceptances
                .slice(1)
                .map((entry) => `v${entry.version} (${new Date(entry.acceptedAt).toLocaleDateString()})`)
                .join(', ')}
            </dd>
          )}
        </div>
      </dl>
    </section>
  );
};

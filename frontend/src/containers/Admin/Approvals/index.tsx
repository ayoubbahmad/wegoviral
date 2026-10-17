'use client';

import { useState } from 'react';
import { Check, Loader2, Phone, Ticket, UserCheck, Users, X } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/providers/Toast';
import { avatarFor, cn, formatRelativeDate } from '@/lib/utils';
import { useApplications, useReviewApplication } from '../api/joining';
import { ApplicationWithUser, JoinStatus } from '../types';

const TABS: { id: JoinStatus; label: string }[] = [
  { id: 'PENDING', label: 'Waiting' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Not approved' },
];

export const AdminApprovalsContainer = () => {
  const [status, setStatus] = useState<JoinStatus>('PENDING');
  const { data, isPending, error } = useApplications(status);

  return (
    <PageContainer>
      <PageHeader title="Approvals" description="New members waiting to join the community." />

      <div className="flex gap-2" role="tablist" aria-label="Application status">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={status === tab.id}
            onClick={() => setStatus(tab.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              status === tab.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
            {tab.id === 'PENDING' && status === 'PENDING' && data ? ` (${data.total})` : ''}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="space-y-3">
          {[0, 1].map((index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : data.applications.length === 0 ? (
        <EmptyState
          icon={status === 'PENDING' ? UserCheck : Users}
          title={status === 'PENDING' ? 'Nobody waiting' : 'Nothing here yet'}
          description={status === 'PENDING' ? 'New applications will show up here.' : undefined}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

const ApplicationCard = ({ application }: { application: ApplicationWithUser }) => {
  const { showToast } = useToast();
  const review = useReviewApplication();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');
  const { user } = application;
  const isPending = user.joinStatus === 'PENDING';

  const decide = (decision: 'approve' | 'reject') =>
    review.mutate(
      { userId: user.id, decision, note: note.trim() || undefined },
      {
        onSuccess: () =>
          showToast(decision === 'approve' ? `${application.fullName} can now join` : 'Application not approved'),
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <img src={avatarFor(user)} alt="" className="w-11 h-11 rounded-full border border-border" />
        <div className="min-w-0 flex-1">
          <p className="font-bold truncate">{application.fullName}</p>
          <p className="text-xs text-muted-foreground truncate">
            @{user.username} · {user.email}
          </p>
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{formatRelativeDate(application.submittedAt)}</span>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
          <a href={`tel:${application.phone}`} className="hover:text-primary">{application.phone}</a>
        </div>
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
        {(user.referredBy || application.invite) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ticket className="w-3.5 h-3.5" />
            {user.referredBy ? `Referred by @${user.referredBy.username}` : `Invite: ${application.invite?.label}`}
          </div>
        )}
      </dl>

      {isPending ? (
        rejecting ? (
          <div className="space-y-2">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Message for the applicant (optional)"
              maxLength={500}
              className="w-full min-h-[70px] rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>
                Cancel
              </Button>
              <Button variant="outline" size="sm" onClick={() => decide('reject')} disabled={review.isPending}>
                {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setRejecting(true)}>
              <X className="w-4 h-4" /> Don&apos;t approve
            </Button>
            <Button variant="primary" size="sm" onClick={() => decide('approve')} disabled={review.isPending}>
              {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Approve</>}
            </Button>
          </div>
        )
      ) : (
        <p className="text-xs text-muted-foreground">
          {user.joinStatus === 'APPROVED' ? 'Approved' : 'Not approved'}
          {application.reviewedBy ? ` by @${application.reviewedBy.username}` : ' automatically'}
          {application.reviewedAt ? ` · ${new Date(application.reviewedAt).toLocaleDateString()}` : ''}
          {application.reviewNote ? ` — “${application.reviewNote}”` : ''}
        </p>
      )}
    </Card>
  );
};

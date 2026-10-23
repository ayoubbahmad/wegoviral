'use client';

import { Loader2, MessageSquare, PenLine, UserX } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { BackNavigation } from '@/components/BackNavigation';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { Button } from '@/components/Button';
import { SocialIcon } from '@/components/SocialIcon';
import { useCan } from '@/providers/Auth';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';
import { PostCard } from '../components/Feed/PostCard';
import { usePostActions } from '../Feed/controller/postActions';
import { useSpaces } from '../api';
import { avatarOf } from '../Members';
import { useMemberPosts, useMemberProfile } from '../Members/api';

export const MemberProfileContainer = ({ username }: { username: string }) => {
  const t = useT();
  const can = useCan();
  const { data: member, isPending, isError } = useMemberProfile(username);
  const postsQuery = useMemberPosts(member?.id);
  const { data: spaces = [] } = useSpaces();
  const actions = usePostActions();
  const spacesById = Object.fromEntries(spaces.map((space) => [space.id, space]));
  const posts = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];

  if (isPending) {
    return (
      <PageContainer>
        <Skeleton className='h-48 rounded-2xl' />
        <Skeleton className='h-64 rounded-2xl' />
      </PageContainer>
    );
  }

  if (isError || !member) {
    return (
      <PageContainer>
        <BackNavigation href='/community/members' label={t('members.profile.back')} />
        <EmptyState icon={UserX} title={t('members.profile.notFoundTitle')} description={t('members.profile.notFoundBody')} />
      </PageContainer>
    );
  }

  const stats = [
    t('members.profile.points', { count: member.points }),
    t('members.profile.posts', { count: member.postCount }),
    t('members.profile.comments', { count: member.commentCount }),
  ];

  return (
    <PageContainer>
      <BackNavigation href='/community/members' label={t('members.profile.back')} />

      <Card padding='lg' className='space-y-6'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
          {/* eslint-disable-next-line @next/next/no-img-element -- avatars come from storage, Google or DiceBear */}
          <img src={avatarOf(member)} alt='' className='h-24 w-24 shrink-0 rounded-full border border-border object-cover' />
          <div className='min-w-0 flex-1 space-y-3'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='min-w-0'>
                <h1 className='flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight'>
                  {member.name || `@${member.username}`}
                  {member.role !== 'MEMBER' && (
                    <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary'>
                      {t(`common.roleBadges.${member.role}`)}
                    </span>
                  )}
                </h1>
                <p className='text-sm text-muted-foreground' dir='ltr'>@{member.username}</p>
              </div>
              {member.isSelf && (
                <Link href='/settings/profile'>
                  <Button variant='outline' size='sm'>
                    <PenLine className='h-4 w-4' /> {t('members.profile.editProfile')}
                  </Button>
                </Link>
              )}
            </div>
            {member.niche && <p className='font-medium text-foreground/90'>{member.niche}</p>}
            <p className='whitespace-pre-line text-sm leading-relaxed text-muted-foreground'>{member.bio || t('members.profile.noBio')}</p>
            {member.socialLinks.length > 0 && (
              <ul className='flex flex-wrap gap-2'>
                {member.socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer nofollow'
                      title={t('members.profile.openLink', { platform: t(`settings.profile.platforms.${link.platform}`) })}
                      aria-label={t('members.profile.openLink', { platform: t(`settings.profile.platforms.${link.platform}`) })}
                      className='flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground'
                    >
                      <SocialIcon platform={link.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5 text-sm'>
          <span className='font-semibold'>{t('members.level', { level: member.level.level, name: member.level.name })}</span>
          {stats.map((stat) => (
            <span key={stat} className='text-muted-foreground'>{stat}</span>
          ))}
          <span className='text-muted-foreground'>
            {t('members.profile.joined', { date: new Date(member.createdAt).toLocaleDateString(activeIntl(), { month: 'long', year: 'numeric' }) })}
          </span>
        </div>

        {member.badges.length > 0 && (
          <div className='space-y-2'>
            <h2 className='text-sm font-semibold'>{t('members.profile.badges')}</h2>
            <ul className='flex flex-wrap gap-2'>
              {member.badges.map((badge) => (
                <li key={badge.id} className='flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium'>
                  <span role='img' aria-hidden className='flex h-5 w-5 items-center justify-center rounded-full' style={{ backgroundColor: `${badge.color}26` }}>
                    {badge.emoji}
                  </span>
                  {badge.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <section className='space-y-4'>
        <h2 className='text-lg font-bold'>{t('members.profile.recentPosts')}</h2>
        {postsQuery.isPending ? (
          <Skeleton className='h-40 rounded-2xl' />
        ) : posts.length === 0 ? (
          <EmptyState icon={MessageSquare} title={member.isSelf ? t('members.profile.noPostsSelf') : t('members.profile.noPosts')} />
        ) : (
          <div className='space-y-4'>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                space={spacesById[post.spaceId]}
                currentUser={actions.currentUser}
                isStaff={can('community.moderate')}
                onLike={actions.handleLikePost}
                onBookmark={actions.handleBookmarkPost}
                onVote={actions.handleVotePoll}
                onCopyLink={actions.handleCopyPostLink}
                onPin={actions.handlePinPost}
                onDelete={actions.handleDeletePost}
              />
            ))}
            {postsQuery.hasNextPage && (
              <div className='flex justify-center'>
                <Button variant='outline' onClick={() => postsQuery.fetchNextPage()} disabled={postsQuery.isFetchingNextPage}>
                  {postsQuery.isFetchingNextPage && <Loader2 className='h-4 w-4 animate-spin' />}
                  {t('members.profile.loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </PageContainer>
  );
};

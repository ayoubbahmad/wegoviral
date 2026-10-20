'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  Heart,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
  Hourglass,
  XCircle,
  Pencil,
  Flag,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { avatarFor, cn, formatRelativeDate } from '@/lib/utils';
import { CommunityPost, CommunitySpace, CommunityUser } from '@/types/communityFeed';
import { ROLE_BADGES } from '@/lib/roles';
import { MemberBadges } from '@/components/MemberBadges';
import { PostPoll } from './PostPoll';
import { CommentsThread } from './CommentsThread';
import { ReportDialog } from '../Moderation/ReportDialog';
import { EditPostDialog } from '../Moderation/EditPostDialog';

// Longer posts are clamped with a "See more" toggle
const CLAMP_CHARACTERS = 280;
const CLAMP_LINES = 5;

interface PostCardProps {
  post: CommunityPost;
  space?: CommunitySpace;
  currentUser?: CommunityUser;
  isStaff: boolean;
  onLike: (post: CommunityPost) => void;
  onBookmark: (post: CommunityPost) => void;
  onVote: (postId: string, optionId: string) => void;
  onCopyLink: (post: CommunityPost) => void;
  onPin: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
  onSpaceClick?: (spaceId: string) => void;
}

export const PostCard = ({
  post,
  space,
  currentUser,
  isStaff,
  onLike,
  onBookmark,
  onVote,
  onCopyLink,
  onPin,
  onDelete,
  onSpaceClick,
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const isLong =
    post.content.length > CLAMP_CHARACTERS ||
    post.content.split('\n').length > CLAMP_LINES;
  const isOwn = post.author.id === currentUser?.id;
  const canDelete = isStaff || isOwn;
  const [dialog, setDialog] = useState<'edit' | 'report' | null>(null);

  const actions = (
    <PostActions
      post={post}
      canPin={isStaff}
      canDelete={canDelete}
      canEdit={canDelete}
      canReport={!isOwn}
      onBookmark={onBookmark}
      onCopyLink={onCopyLink}
      onPin={onPin}
      onDelete={onDelete}
      onEdit={() => setDialog('edit')}
      onReport={() => setDialog('report')}
    />
  );

  return (
    <Card padding="none" className={cn('overflow-hidden', post.pinned && 'border-primary/40')}>
      {post.coverUrl && (
        <img
          src={post.coverUrl}
          alt=""
          className="h-56 w-full object-cover border-b border-border"
        />
      )}

      <div className="p-6 space-y-4">
        {post.reviewStatus === 'PENDING' && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            <Hourglass className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              {post.heldForReview ? (
                <>
                  <strong>Held for the team.</strong> It contains a word the team checks first. Only you can see it for now.
                </>
              ) : (
                <>
                  <strong>Waiting for review.</strong> Only you can see it until a reviewer approves it.{' '}
                  <Link href="/community/help/your-first-posts" className="underline underline-offset-2">Why?</Link>
                </>
              )}
            </span>
          </div>
        )}
        {post.reviewStatus === 'REJECTED' && (
          <div className="flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">
            <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              <strong>Not approved.</strong> Only you can see it.{post.reviewNote ? ` Reviewer's note: “${post.reviewNote}”` : ''}
            </span>
          </div>
        )}
        {post.pinned && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Pin className="w-3.5 h-3.5" /> Pinned
          </div>
        )}

        {post.title && (
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight leading-snug">{post.title}</h2>
            {actions}
          </div>
        )}

        <div className="flex items-center gap-3">
          <img
            src={avatarFor(post.author)}
            alt={post.author.username}
            className="w-10 h-10 rounded-full border border-border shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">@{post.author.username}</span>
              <MemberBadges badges={post.author.badges} />
              {post.author.role && ROLE_BADGES[post.author.role] && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {ROLE_BADGES[post.author.role]}
                </span>
              )}
              <span className="text-xs text-muted-foreground shrink-0">
                {formatRelativeDate(post.createdAt)}
                {post.editedAt && (
                  <span title={new Date(post.editedAt).toLocaleString()}>
                    {post.editedByStaff ? ' · edited by the team' : ' · edited'}
                  </span>
                )}
              </span>
            </div>
            {space && (
              <button
                onClick={() => onSpaceClick?.(space.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Posted in {space.emoji} {space.name}
              </button>
            )}
          </div>
          {!post.title && actions}
        </div>

        {post.content && (
          <div>
            <p
              className={cn(
                'text-sm leading-relaxed whitespace-pre-wrap break-words',
                isLong && !isExpanded && 'line-clamp-5',
              )}
            >
              {post.content}
            </p>
            {isLong && (
              <button
                onClick={() => setIsExpanded((expanded) => !expanded)}
                className="mt-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        )}

        {post.images && <PostImages images={post.images} />}

        {post.poll && (
          <PostPoll poll={post.poll} onVote={(optionId) => onVote(post.id, optionId)} />
        )}

        {post.reviewStatus === 'PUBLISHED' && (
        <div className="flex items-center gap-5 pt-1 text-xs text-muted-foreground">
          <button
            onClick={() => onLike(post)}
            aria-pressed={post.likedByMe}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Heart
              className={cn('w-4 h-4', post.likedByMe && 'fill-red-500 text-red-500')}
            />
            <span className="font-medium">{post.likeCount}</span>
          </button>
          <button
            onClick={() => setIsCommentsOpen((open) => !open)}
            aria-expanded={isCommentsOpen}
            className={cn(
              'flex items-center gap-1.5 hover:text-foreground transition-colors',
              isCommentsOpen && 'text-foreground',
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{post.commentCount}</span>
          </button>
        </div>

        )}

        {isCommentsOpen && post.reviewStatus === 'PUBLISHED' && (
          <CommentsThread postId={post.id} currentUser={currentUser} isStaff={isStaff} />
        )}
      </div>
      {dialog === 'edit' && <EditPostDialog post={post} isOwn={isOwn} onClose={() => setDialog(null)} />}
      {dialog === 'report' && <ReportDialog target="post" id={post.id} onClose={() => setDialog(null)} />}
    </Card>
  );
};

const PostImages = ({ images }: { images: string[] }) => {
  const visible = images.slice(0, 4);
  const hidden = images.length - visible.length;

  return (
    <div
      className={cn(
        'grid gap-2 overflow-hidden rounded-xl',
        visible.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
      )}
    >
      {visible.map((src, index) => (
        <a
          key={src}
          href={src}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'relative block bg-secondary/30',
            visible.length === 3 && index === 0 && 'row-span-2',
          )}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className={cn(
              'h-full w-full object-cover',
              visible.length === 1 ? 'max-h-96' : 'aspect-[4/3]',
            )}
          />
          {hidden > 0 && index === visible.length - 1 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-bold text-white">
              +{hidden}
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

interface PostActionsProps {
  post: CommunityPost;
  canPin: boolean;
  canDelete: boolean;
  canEdit: boolean;
  canReport: boolean;
  onEdit: () => void;
  onReport: () => void;
  onBookmark: (post: CommunityPost) => void;
  onCopyLink: (post: CommunityPost) => void;
  onPin: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
}

const PostActions = ({
  post,
  canPin,
  canDelete,
  canEdit,
  canReport,
  onEdit,
  onReport,
  onBookmark,
  onCopyLink,
  onPin,
  onDelete,
}: PostActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const menuItem = (label: string, icon: React.ReactNode, onClick: () => void, danger = false) => (
    <button
      role="menuitem"
      onClick={() => {
        onClick();
        setIsMenuOpen(false);
      }}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
        danger ? 'text-red-500 hover:bg-red-500/10' : 'hover:bg-secondary/50',
      )}
    >
      {icon} {label}
    </button>
  );

  const isPublished = post.reviewStatus === 'PUBLISHED';

  return (
    <div className="flex items-center gap-1 shrink-0">
      {isPublished && (
        <button
          onClick={() => onBookmark(post)}
          title={post.bookmarkedByMe ? 'Remove bookmark' : 'Bookmark'}
          aria-pressed={post.bookmarkedByMe}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <Bookmark
            className={cn('w-4 h-4', post.bookmarkedByMe && 'fill-primary text-primary')}
          />
        </button>
      )}

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Post options"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150"
          >
            {menuItem('Copy link', <Link2 className="w-4 h-4" />, () => onCopyLink(post))}
            {canEdit && menuItem('Edit post', <Pencil className="w-4 h-4" />, onEdit)}
            {canReport && isPublished && menuItem('Report', <Flag className="w-4 h-4" />, onReport)}
            {canPin && isPublished &&
              menuItem(
                post.pinned ? 'Unpin post' : 'Pin post',
                post.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />,
                () => onPin(post),
              )}
            {canDelete &&
              menuItem('Delete post', <Trash2 className="w-4 h-4" />, () => onDelete(post.id), true)}
          </div>
        )}
      </div>
    </div>
  );
};

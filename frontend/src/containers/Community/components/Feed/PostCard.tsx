'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  Heart,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { cn, formatRelativeDate } from '@/lib/utils';
import { CommunityPost, CommunitySpace } from '@/types/communityFeed';
import { PostPoll } from './PostPoll';

// Longer posts are clamped with a "See more" toggle
const CLAMP_CHARACTERS = 280;
const CLAMP_LINES = 5;

interface PostCardProps {
  post: CommunityPost;
  space?: CommunitySpace;
  isOwn?: boolean;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onCopyLink: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
  onSpaceClick?: (spaceId: string) => void;
}

export const PostCard = ({
  post,
  space,
  isOwn = false,
  onLike,
  onBookmark,
  onVote,
  onCopyLink,
  onDelete,
  onSpaceClick,
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong =
    post.content.length > CLAMP_CHARACTERS ||
    post.content.split('\n').length > CLAMP_LINES;

  return (
    <Card padding="none" className="overflow-hidden">
      {post.coverUrl && (
        <img
          src={post.coverUrl}
          alt=""
          className="h-56 w-full object-cover border-b border-border"
        />
      )}

      <div className="p-6 space-y-4">
        {post.title && (
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight leading-snug">{post.title}</h2>
            <PostActions
              post={post}
              isOwn={isOwn}
              onBookmark={onBookmark}
              onCopyLink={onCopyLink}
              onDelete={onDelete}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.username}
            className="w-10 h-10 rounded-full border border-border shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">@{post.author.username}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatRelativeDate(post.createdAt)}
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
          {!post.title && (
            <PostActions
              post={post}
              isOwn={isOwn}
              onBookmark={onBookmark}
              onCopyLink={onCopyLink}
              onDelete={onDelete}
            />
          )}
        </div>

        {post.content && (
          <div>
            <p
              className={cn(
                'text-sm leading-relaxed whitespace-pre-wrap',
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

        <div className="flex items-center gap-5 pt-1 text-xs text-muted-foreground">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Heart
              className={cn('w-4 h-4', post.likedByMe && 'fill-red-500 text-red-500')}
            />
            <span className="font-medium">{post.likeCount}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{post.commentCount}</span>
          </div>
        </div>
      </div>
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
        <div
          key={src}
          className={cn(
            'relative bg-secondary/30',
            visible.length === 3 && index === 0 && 'row-span-2',
          )}
        >
          <img
            src={src}
            alt=""
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
        </div>
      ))}
    </div>
  );
};

interface PostActionsProps {
  post: CommunityPost;
  isOwn: boolean;
  onBookmark: (postId: string) => void;
  onCopyLink: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
}

const PostActions = ({ post, isOwn, onBookmark, onCopyLink, onDelete }: PostActionsProps) => {
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

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => onBookmark(post.id)}
        title={post.bookmarkedByMe ? 'Remove bookmark' : 'Bookmark'}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
      >
        <Bookmark
          className={cn('w-4 h-4', post.bookmarkedByMe && 'fill-primary text-primary')}
        />
      </button>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              role="menuitem"
              onClick={() => {
                onCopyLink(post);
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary/50 transition-colors"
            >
              <Link2 className="w-4 h-4" /> Copy link
            </button>
            {isOwn && (
              <button
                role="menuitem"
                onClick={() => {
                  onDelete(post.id);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

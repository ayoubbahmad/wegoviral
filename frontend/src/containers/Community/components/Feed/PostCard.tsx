'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { Card } from '@/components/Card';
import { cn, formatRelativeDate } from '@/lib/utils';
import { CommunityPost, CommunitySpace } from '@/types/communityFeed';

interface PostCardProps {
  post: CommunityPost;
  space?: CommunitySpace;
  onLike: (postId: string) => void;
  onSpaceClick?: (spaceId: string) => void;
}

export const PostCard = ({ post, space, onLike, onSpaceClick }: PostCardProps) => {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <img
          src={post.author.avatarUrl}
          alt={post.author.username}
          className="w-10 h-10 rounded-full border border-border"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">@{post.author.username}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeDate(post.createdAt)}
            </span>
            {space && (
              <button
                onClick={() => onSpaceClick?.(space.id)}
                className="ml-auto shrink-0 rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {space.emoji} {space.name}
              </button>
            )}
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Heart
                className={cn(
                  'w-3.5 h-3.5',
                  post.likedByMe && 'fill-red-500 text-red-500',
                )}
              />
              <span className="font-medium">{post.likeCount}</span>
            </button>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-medium">{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

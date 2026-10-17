'use client';

import { useState } from 'react';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/providers/Toast';
import { useAuth } from '@/providers/Auth';
import { avatarFor, formatRelativeDate } from '@/lib/utils';
import { CommunityUser } from '@/types/communityFeed';
import { useComments, useCreateComment, useDeleteComment } from '../../api';

interface CommentsThreadProps {
  postId: string;
  currentUser?: CommunityUser;
  isStaff: boolean;
}

export const CommentsThread = ({ postId, currentUser, isStaff }: CommentsThreadProps) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [draft, setDraft] = useState('');
  const commentsQuery = useComments(postId, true);
  const createComment = useCreateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    createComment.mutate(content, {
      onSuccess: () => setDraft(''),
      onError: (error) => showToast(error.message || 'Could not add the comment', 'error'),
    });
  };

  const handleDelete = (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;
    deleteComment.mutate(commentId, {
      onError: (error) => showToast(error.message || 'Could not delete the comment', 'error'),
    });
  };

  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      {commentsQuery.isPending ? (
        <div className="flex justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : commentsQuery.isError ? (
        <p className="text-sm text-muted-foreground">
          Could not load comments.{' '}
          <button onClick={() => commentsQuery.refetch()} className="font-semibold text-primary hover:underline">
            Retry
          </button>
        </p>
      ) : commentsQuery.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-3">
          {commentsQuery.data.map((comment) => {
            const canDelete = isStaff || comment.author.id === currentUser?.id;
            return (
              <li key={comment.id} className="group flex items-start gap-3">
                <img
                  src={avatarFor(comment.author)}
                  alt={comment.author.username}
                  className="w-8 h-8 rounded-full border border-border shrink-0"
                />
                <div className="min-w-0 flex-1 rounded-xl bg-secondary/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">@{comment.author.username}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeDate(comment.createdAt)}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        aria-label="Delete comment"
                        className="ml-auto p-1 rounded-md text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {user?.status === 'MUTED' ? (
        <p className="text-xs text-muted-foreground">You&apos;re muted, so you can&apos;t comment for now.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {currentUser && (
            <img
              src={avatarFor(currentUser)}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full border border-border shrink-0"
            />
          )}
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a comment..."
            maxLength={2000}
            className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!draft.trim() || createComment.isPending}
            aria-label="Send comment"
            className="p-2.5 rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {createComment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      )}
    </div>
  );
};

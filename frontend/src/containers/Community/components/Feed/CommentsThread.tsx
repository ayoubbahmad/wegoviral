'use client';

import { useState } from 'react';
import { Flag, Loader2, Pencil, Send, Trash2 } from 'lucide-react';
import { useToast } from '@/providers/Toast';
import { useAuth } from '@/providers/Auth';
import { avatarFor, formatRelativeDate } from '@/lib/utils';
import { CommunityComment, CommunityUser } from '@/types/communityFeed';
import { useComments, useCreateComment, useDeleteComment, useEditComment } from '../../api';
import { ReportDialog } from '../Moderation/ReportDialog';

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
          {commentsQuery.data.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              isOwn={comment.author.id === currentUser?.id}
              isStaff={isStaff}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {user?.status === 'MUTED' ? (
        <p className="text-xs text-muted-foreground">You&apos;re muted, so you can&apos;t comment for now.</p>
      ) : user?.onboarding.step !== 'DONE' ? (
        <p className="text-xs text-muted-foreground">Accept the community guide to join the conversation.</p>
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

interface CommentItemProps {
  comment: CommunityComment;
  postId: string;
  isOwn: boolean;
  isStaff: boolean;
  onDelete: (commentId: string) => void;
}

const CommentItem = ({ comment, postId, isOwn, isStaff, onDelete }: CommentItemProps) => {
  const { showToast } = useToast();
  const editComment = useEditComment(postId);
  const [isEditing, setIsEditing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const canManage = isOwn || isStaff;

  const save = () => {
    const content = draft.trim();
    if (!content || content === comment.content) return setIsEditing(false);
    editComment.mutate(
      { commentId: comment.id, content },
      {
        onSuccess: () => setIsEditing(false),
        onError: (error) => showToast(error.message || 'Could not edit the comment', 'error'),
      },
    );
  };

  const iconButton =
    'p-1 rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100';

  return (
    <li className="group flex items-start gap-3">
      <img src={avatarFor(comment.author)} alt={comment.author.username} className="w-8 h-8 rounded-full border border-border shrink-0" />
      <div className="min-w-0 flex-1 rounded-xl bg-secondary/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">@{comment.author.username}</span>
          <span className="text-[11px] text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
            {comment.editedAt && (comment.editedByStaff ? ' · edited by the team' : ' · edited')}
          </span>
          <span className="ml-auto flex items-center gap-0.5">
            {canManage && !isEditing && (
              <button onClick={() => setIsEditing(true)} aria-label="Edit comment" className={`${iconButton} hover:text-foreground`}>
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {!isOwn && !comment.heldForReview && (
              <button onClick={() => setIsReporting(true)} aria-label="Report comment" className={`${iconButton} hover:text-foreground`}>
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
            {canManage && (
              <button onClick={() => onDelete(comment.id)} aria-label="Delete comment" className={`${iconButton} hover:text-red-500`}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </span>
        </div>
        {comment.heldForReview && (
          <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            Held for the team: only you can see it until they check it.
          </p>
        )}
        {isEditing ? (
          <div className="mt-1 space-y-1.5">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={2000}
              autoFocus
              className="w-full min-h-[60px] rounded-lg border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button onClick={() => { setDraft(comment.content); setIsEditing(false); }} className="text-muted-foreground hover:text-foreground">
                Cancel
              </button>
              <button onClick={save} disabled={editComment.isPending} className="text-primary hover:underline disabled:opacity-60">
                {editComment.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-0.5 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
        )}
      </div>
      {isReporting && <ReportDialog target="comment" id={comment.id} onClose={() => setIsReporting(false)} />}
    </li>
  );
};

'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import { useToast } from '@/providers/Toast';
import { CommunityPost } from '@/types/communityFeed';
import { useEditPost } from '../../api';
import { Dialog } from './Dialog';
import { useT } from '@/i18n/provider';

/** Edits a post's title and text (images and polls stay as they are). */
export const EditPostDialog = ({ post, isOwn, onClose }: { post: CommunityPost; isOwn: boolean; onClose: () => void }) => {
  const { showToast } = useToast();
  const t = useT();
  const editPost = useEditPost();
  const [title, setTitle] = useState(post.title ?? '');
  const [content, setContent] = useState(post.content);
  const unchanged = title === (post.title ?? '') && content === post.content;

  const handleSave = () =>
    editPost.mutate(
      { postId: post.id, title: title.trim(), content: content.trim() },
      {
        onSuccess: (updated) => {
          showToast(updated.reviewStatus === 'PENDING' && updated.heldForReview ? t('feed.editPost.heldAgain') : t('feed.editPost.updated'));
          onClose();
        },
        onError: (error) => showToast(error.message, 'error'),
      },
    );

  return (
    <Dialog title={t('feed.editPost.title')} onClose={onClose}>
      <div className="space-y-3">
        {!isOwn && (
          <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            {t('feed.editPost.staffNote')}
          </p>
        )}
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t('feed.editPost.titlePlaceholder')}
          maxLength={120}
          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Textarea value={content} onChange={(event) => setContent(event.target.value)} className="min-h-[160px]" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={unchanged || !(title.trim() || content.trim()) || editPost.isPending}>
            {editPost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.save')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

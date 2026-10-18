'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BarChart3,
  ImageIcon,
  ImagePlus,
  Maximize2,
  Minimize2,
  Plus,
  Loader2,
  Smile,
  X,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { cn } from '@/lib/utils';
import { CommunitySpace, NewPostDraft } from '@/types/communityFeed';

const EMOJIS = ['🔥', '🚀', '💯', '🎉', '🙌', '👏', '😂', '😍', '🤯', '🤔', '👀', '💡', '🎬', '📈', '💰', '🏆', '❤️', '✨', '✅', '🙏'];
const MAX_IMAGES = 8;
const MAX_POLL_OPTIONS = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

interface PickedImage {
  file: File;
  url: string; // local preview
}

/** Returns an error message, or null when the file can be uploaded. */
const validateImage = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `${file.name}: use PNG, JPG, WebP or GIF`;
  if (file.size > MAX_IMAGE_BYTES) return `${file.name} is larger than 5 MB`;
  return null;
};

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: CommunitySpace[];
  activeSpace: CommunitySpace | null;
  /** Moderators and admins can also post in team-only spaces */
  canPostInAdminSpaces: boolean;
  onSubmit: (draft: NewPostDraft) => Promise<void>;
}

export const CreatePostModal = ({ isOpen, ...props }: CreatePostModalProps) => {
  // Only ever opened by a click, so this never runs during server render
  if (!isOpen) return null;
  // Mounting the form only while open gives a fresh draft every time
  return createPortal(<CreatePostForm {...props} />, document.body);
};

type CreatePostFormProps = Omit<CreatePostModalProps, 'isOpen'>;

const CreatePostForm = ({
  onClose,
  spaces,
  activeSpace,
  canPostInAdminSpaces,
  onSubmit,
}: CreatePostFormProps) => {
  const canPostIn = (space: CommunitySpace) =>
    (!space.adminOnly || canPostInAdminSpaces) && !space.access.locked;
  const postableSpaces = spaces.filter(canPostIn);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState<PickedImage>();
  const [pickedImages, setPickedImages] = useState<PickedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coverUrl = cover?.url;
  const images = pickedImages.map((image) => image.url);
  const [pollOptions, setPollOptions] = useState<string[] | null>(null);
  const [spaceId, setSpaceId] = useState(
    activeSpace && canPostIn(activeSpace) ? activeSpace.id : '',
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const filledPollOptions = pollOptions?.filter((option) => option.trim()) ?? [];
  const isPollValid = !pollOptions || filledPollOptions.length >= 2;
  const hasBody = Boolean(title.trim() || content.trim());
  const isDirty = hasBody || Boolean(coverUrl) || images.length > 0 || Boolean(pollOptions);
  const canPublish = hasBody && Boolean(spaceId) && isPollValid && !isSubmitting;

  // Free the local preview URLs
  const releaseUploads = () => {
    [coverUrl, ...images].forEach((url) => url && URL.revokeObjectURL(url));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    if (isDirty && !window.confirm('Discard this post?')) return;
    releaseUploads();
    onClose();
  };

  const onEscape = useEffectEvent(() => handleClose());

  useEffect(() => {
    titleRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const invalid = validateImage(file);
    if (invalid) return setError(invalid);
    setError(null);
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCover({ file, url: URL.createObjectURL(file) });
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_IMAGES - images.length);
    event.target.value = '';
    const invalid = files.map(validateImage).find(Boolean);
    setError(invalid ?? null);
    const valid = files.filter((file) => !validateImage(file));
    setPickedImages((prev) => [
      ...prev,
      ...valid.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (url: string) => {
    URL.revokeObjectURL(url);
    setPickedImages((prev) => prev.filter((image) => image.url !== url));
  };

  const insertEmoji = (emoji: string) => {
    const textarea = contentRef.current;
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;
    setContent(content.slice(0, start) + emoji + content.slice(end));
    setIsEmojiOpen(false);
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const handlePublish = async () => {
    if (!canPublish) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        spaceId,
        title,
        content,
        coverFile: cover?.file,
        imageFiles: pickedImages.map((image) => image.file),
        pollOptions: pollOptions ? filledPollOptions : undefined,
      });
      releaseUploads();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish the post');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(event) => event.target === event.currentTarget && handleClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 transition-[max-width,height] ease-out',
          isExpanded ? 'max-w-5xl h-[90vh]' : 'max-w-2xl max-h-[90vh]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
          <h2 id="create-post-title" className="text-lg font-bold">
            Create post
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
              <ImagePlus className="w-4 h-4" />
              {coverUrl ? 'Change cover' : 'Add cover'}
            </Button>
            <IconButton
              label={isExpanded ? 'Collapse' : 'Expand'}
              onClick={() => setIsExpanded((expanded) => !expanded)}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </IconButton>
            <IconButton label="Close" onClick={handleClose}>
              <X className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {coverUrl && (
            <div className="group relative">
              <img src={coverUrl} alt="" className="h-48 w-full object-cover" />
              <button
                onClick={() => {
                  URL.revokeObjectURL(coverUrl);
                  setCover(undefined);
                }}
                className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                Remove cover
              </button>
            </div>
          )}

          <div className="space-y-4 px-6 py-5">
            <input
              ref={titleRef}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              maxLength={120}
              className="w-full bg-transparent text-2xl font-bold tracking-tight placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <textarea
              ref={contentRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Share a win, ask for feedback, start a conversation..."
              className={cn(
                'w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none',
                isExpanded ? 'min-h-[45vh]' : 'min-h-40',
              )}
            />

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url) => (
                  <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => removeImage(url)}
                      aria-label="Remove image"
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pollOptions && (
              <div className="space-y-2 rounded-xl border border-border bg-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <BarChart3 className="w-4 h-4 text-primary" /> Poll
                  </span>
                  <button
                    onClick={() => setPollOptions(null)}
                    className="text-xs font-semibold text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Remove poll
                  </button>
                </div>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={option}
                      onChange={(event) =>
                        setPollOptions((prev) =>
                          prev!.map((value, i) => (i === index ? event.target.value : value)),
                        )
                      }
                      placeholder={`Option ${index + 1}`}
                      maxLength={80}
                      className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => setPollOptions((prev) => prev!.filter((_, i) => i !== index))}
                        aria-label={`Remove option ${index + 1}`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < MAX_POLL_OPTIONS && (
                  <button
                    onClick={() => setPollOptions((prev) => [...prev!, ''])}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add option
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="relative flex items-center gap-1 border-t border-border px-4 py-2">
          <IconButton
            label="Add images"
            onClick={() => imagesInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
          >
            <ImageIcon className="w-4 h-4" />
          </IconButton>
          <IconButton
            label="Add poll"
            onClick={() => setPollOptions((prev) => prev ?? ['', ''])}
            active={Boolean(pollOptions)}
          >
            <BarChart3 className="w-4 h-4" />
          </IconButton>
          <IconButton
            label="Emoji"
            onClick={() => setIsEmojiOpen((open) => !open)}
            active={isEmojiOpen}
          >
            <Smile className="w-4 h-4" />
          </IconButton>

          {isEmojiOpen && (
            <div className="absolute bottom-full left-4 mb-2 grid grid-cols-10 gap-1 rounded-xl border border-border bg-card p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="rounded-lg p-1.5 text-lg hover:bg-secondary/50"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="border-t border-red-500/20 bg-red-500/10 px-6 py-2.5 text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-border bg-secondary/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-60">
            <Select
              aria-label="Space to post in"
              value={spaceId}
              onChange={(event) => setSpaceId(event.target.value)}
              className="h-10"
              options={[
                { value: '', label: 'Choose a space…' },
                ...postableSpaces.map((space) => ({
                  value: space.id,
                  label: `${space.emoji} ${space.name}`,
                })),
              ]}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePublish} disabled={!canPublish}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing…
                </>
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </div>

        <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
        <input
          ref={imagesInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleImagesChange}
        />
      </div>
    </div>
  );
};

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const IconButton = ({ label, onClick, children, active, disabled }: IconButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={cn(
      'rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none',
      active && 'bg-secondary/60 text-foreground',
    )}
  >
    {children}
  </button>
);

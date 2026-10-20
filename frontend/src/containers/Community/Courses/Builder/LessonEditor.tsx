'use client';

import { useRef, useState } from 'react';
import { ExternalLink, FileText, Link2, Loader2, PlayCircle, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Textarea } from '@/components/Textarea';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import { AttachmentInput, EditableLesson, LessonType } from '@/types/courses';
import { uploadCourseFile, useDeleteLesson, useSaveLesson } from '../api';
import { formatBytes, videoSource } from '../utils';
import { useT } from '@/i18n/provider';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

const MAX_FILE_BYTES = 50 * 1024 * 1024;

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
    {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
  </label>
);

export const LessonEditor = ({ courseId, lesson, onDeleted }: { courseId: string; lesson: EditableLesson; onDeleted: () => void }) => {
  const t = useT();
  const { showToast } = useToast();
  const save = useSaveLesson();
  const remove = useDeleteLesson();
  const fileInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: lesson.title,
    type: lesson.type,
    videoUrl: lesson.videoUrl ?? '',
    content: lesson.content,
    durationMinutes: lesson.durationMinutes ? String(lesson.durationMinutes) : '',
  });
  const [attachments, setAttachments] = useState<(AttachmentInput & { key: string })[]>(
    lesson.attachments.map((a) => ({ key: a.id, name: a.name, url: a.storagePath ? null : a.url, storagePath: a.storagePath, size: a.size })),
  );
  const [link, setLink] = useState({ name: '', url: '' });
  const [uploading, setUploading] = useState(0);
  const update = (change: Partial<typeof form>) => setForm((current) => ({ ...current, ...change }));

  const duration = form.durationMinutes ? Number(form.durationMinutes) : null;
  const valid = form.title.trim().length > 0 && (duration === null || (Number.isInteger(duration) && duration >= 1 && duration <= 1000));
  const preview = form.type === 'VIDEO' && /^https?:\/\//.test(form.videoUrl) ? videoSource(form.videoUrl) : null;

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        showToast(t('courses.builder.lesson.tooBig', { file: file.name }), 'error');
        continue;
      }
      setUploading((count) => count + 1);
      try {
        const uploaded = await uploadCourseFile(courseId, file);
        setAttachments((current) => [...current, { ...uploaded, key: uploaded.storagePath! }]);
      } catch (error) {
        showToast(error instanceof Error ? error.message : t('courses.builder.lesson.uploadFailed', { file: file.name }), 'error');
      } finally {
        setUploading((count) => count - 1);
      }
    }
  };

  const addLink = () => {
    const url = link.url.trim();
    if (!/^https?:\/\//.test(url)) return showToast(t('courses.builder.lesson.fullLink'), 'error');
    setAttachments((current) => [...current, { key: url + Date.now(), name: link.name.trim() || url, url }]);
    setLink({ name: '', url: '' });
  };

  const handleSave = () =>
    save.mutate(
      {
        id: lesson.id,
        input: {
          title: form.title.trim(),
          type: form.type,
          videoUrl: form.type === 'VIDEO' ? form.videoUrl.trim() || null : null,
          content: form.content,
          durationMinutes: duration,
          attachments: attachments.map(({ name, url, storagePath, size }) => ({ name, url: url ?? null, storagePath: storagePath ?? null, size: size ?? null })),
        },
      },
      { onSuccess: () => showToast(t('courses.builder.lesson.saved')), onError: (error) => showToast(error.message, 'error') },
    );

  const handleDelete = () => {
    if (!window.confirm(t('courses.builder.lesson.deleteConfirm', { title: lesson.title }))) return;
    remove.mutate(lesson.id, {
      onSuccess: () => {
        showToast(t('courses.builder.lesson.deleted'));
        onDeleted();
      },
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">{t('courses.builder.lesson.title')}</h2>
        <button aria-label={t('courses.builder.lesson.delete')} onClick={handleDelete} disabled={remove.isPending} className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <Field label={t('courses.builder.lesson.lessonTitle')}>
        <input value={form.title} maxLength={150} onChange={(e) => update({ title: e.target.value })} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('courses.builder.lesson.type')}</span>
          <div role="radiogroup" aria-label={t('courses.builder.lesson.type')} className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {(['VIDEO', 'TEXT'] as LessonType[]).map((type) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={form.type === type}
                onClick={() => update({ type })}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  form.type === type ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {type === 'VIDEO' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {type === 'VIDEO' ? t('courses.builder.lesson.video') : t('courses.builder.lesson.text')}
              </button>
            ))}
          </div>
        </div>
        <Field label={t('courses.builder.lesson.length')}>
          <input type="number" min={1} value={form.durationMinutes} onChange={(e) => update({ durationMinutes: e.target.value })} placeholder={t('common.optional')} className={inputClass} />
        </Field>
      </div>

      {form.type === 'VIDEO' && (
        <Field label={t('courses.builder.lesson.videoLink')} hint={t('courses.builder.lesson.videoHint')}>
          <input value={form.videoUrl} onChange={(e) => update({ videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" className={inputClass} />
        </Field>
      )}
      {preview && (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
          {preview.kind === 'embed' ? (
            <iframe src={preview.src} title={t('courses.builder.lesson.preview')} className="h-full w-full" allowFullScreen />
          ) : (
            <video src={preview.src} controls className="h-full w-full" />
          )}
        </div>
      )}

      <Field label={form.type === 'VIDEO' ? t('courses.builder.lesson.notes') : t('courses.builder.lesson.lessonText')} hint={t('courses.builder.lesson.lineBreaks')}>
        <Textarea value={form.content} onChange={(e) => update({ content: e.target.value })} maxLength={50000} className="min-h-[180px]" />
      </Field>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-muted-foreground">{t('courses.builder.lesson.resources')}</span>
        {attachments.length > 0 && (
          <ul className="space-y-1.5">
            {attachments.map((attachment) => (
              <li key={attachment.key} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                {attachment.storagePath ? <FileText className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground" />}
                <input
                  aria-label={t('courses.builder.lesson.resourceName')}
                  value={attachment.name}
                  maxLength={120}
                  onChange={(e) => setAttachments((current) => current.map((a) => (a.key === attachment.key ? { ...a, name: e.target.value } : a)))}
                  className="min-w-0 flex-1 bg-transparent focus:outline-none"
                />
                {attachment.size ? <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(attachment.size)}</span> : null}
                <button aria-label={t('courses.builder.lesson.removeResource', { name: attachment.name })} onClick={() => setAttachments((current) => current.filter((a) => a.key !== attachment.key))} className="rounded p-1 text-muted-foreground hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          <input ref={fileInput} type="file" multiple onChange={handleFiles} className="hidden" />
          <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={uploading > 0}>
            {uploading > 0 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {t('courses.builder.lesson.upload')}
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
          <input value={link.name} onChange={(e) => setLink({ ...link, name: e.target.value })} placeholder={t('courses.builder.lesson.linkName')} className={inputClass} />
          <input value={link.url} onChange={(e) => setLink({ ...link, url: e.target.value })} placeholder="https://…" className={inputClass} />
          <Button type="button" variant="ghost" size="sm" onClick={addLink} disabled={!link.url.trim()}>
            <Link2 className="w-4 h-4" /> {t('courses.builder.lesson.addLink')}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{t('courses.builder.lesson.filesHint')}</p>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={!valid || save.isPending || uploading > 0}>
          {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('courses.builder.lesson.save')}
        </Button>
      </div>
    </Card>
  );
};

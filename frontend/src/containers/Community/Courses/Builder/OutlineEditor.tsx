'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, FileText, GripVertical, Loader2, Paperclip, PlayCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import { EditableCourse, EditableModule } from '@/types/courses';
import { courseKeys, useDeleteModule, useSaveLesson, useSaveModule, useSaveOutline } from '../api';
import { LessonEditor } from './LessonEditor';
import { useT } from '@/i18n/provider';

type Outline = { id: string; lessonIds: string[] }[];
type Drag = { type: 'lesson' | 'module'; id: string } | null;

const toOutline = (course: EditableCourse): Outline => course.modules.map((m) => ({ id: m.id, lessonIds: m.lessons.map((l) => l.id) }));

/** Rebuilds the course in a new order so the screen updates before the server answers. */
const applyOutline = (course: EditableCourse, outline: Outline): EditableCourse => {
  const modules = new Map(course.modules.map((m) => [m.id, m]));
  const lessons = new Map(course.modules.flatMap((m) => m.lessons).map((l) => [l.id, l]));
  return {
    ...course,
    modules: outline.map((entry) => ({ ...modules.get(entry.id)!, lessons: entry.lessonIds.map((id) => ({ ...lessons.get(id)!, moduleId: entry.id })) })),
  };
};

export const OutlineEditor = ({ course }: { course: EditableCourse }) => {
  const t = useT();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const saveOutline = useSaveOutline();
  const saveModule = useSaveModule();
  const saveLesson = useSaveLesson();
  const [selectedId, setSelectedId] = useState<string | null>(course.modules[0]?.lessons[0]?.id ?? null);
  const [drag, setDrag] = useState<Drag>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const selected = course.modules.flatMap((m) => m.lessons).find((lesson) => lesson.id === selectedId) ?? null;

  const commit = (outline: Outline) => {
    queryClient.setQueryData(courseKeys.edit(course.id), applyOutline(course, outline));
    saveOutline.mutate(
      { courseId: course.id, modules: outline },
      {
        onError: (error) => {
          showToast(error.message, 'error');
          queryClient.invalidateQueries({ queryKey: courseKeys.edit(course.id) });
        },
      },
    );
  };

  /** Puts a lesson before another one, or at the end of a module. */
  const moveLesson = (lessonId: string, toModuleId: string, beforeLessonId: string | null) => {
    if (lessonId === beforeLessonId) return;
    const outline = toOutline(course).map((m) => ({ ...m, lessonIds: m.lessonIds.filter((id) => id !== lessonId) }));
    const target = outline.find((m) => m.id === toModuleId)!;
    const index = beforeLessonId ? target.lessonIds.indexOf(beforeLessonId) : -1;
    target.lessonIds.splice(index === -1 ? target.lessonIds.length : index, 0, lessonId);
    commit(outline);
  };

  const moveModule = (moduleId: string, beforeModuleId: string | null) => {
    if (moduleId === beforeModuleId) return;
    const outline = toOutline(course);
    const moving = outline.find((m) => m.id === moduleId)!;
    const rest = outline.filter((m) => m.id !== moduleId);
    const index = beforeModuleId ? rest.findIndex((m) => m.id === beforeModuleId) : -1;
    rest.splice(index === -1 ? rest.length : index, 0, moving);
    commit(rest);
  };

  /** Keyboard-friendly reordering: a lesson can step into the next or previous module. */
  const nudgeLesson = (lessonId: string, direction: -1 | 1) => {
    const outline = toOutline(course);
    const moduleIndex = outline.findIndex((m) => m.lessonIds.includes(lessonId));
    const lessons = outline[moduleIndex].lessonIds;
    const index = lessons.indexOf(lessonId);
    const swapWith = index + direction;
    if (swapWith >= 0 && swapWith < lessons.length) {
      [lessons[index], lessons[swapWith]] = [lessons[swapWith], lessons[index]];
    } else {
      const neighbour = outline[moduleIndex + direction];
      if (!neighbour) return;
      lessons.splice(index, 1);
      if (direction === 1) neighbour.lessonIds.unshift(lessonId);
      else neighbour.lessonIds.push(lessonId);
    }
    commit(outline);
  };

  const nudgeModule = (moduleId: string, direction: -1 | 1) => {
    const outline = toOutline(course);
    const index = outline.findIndex((m) => m.id === moduleId);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= outline.length) return;
    [outline[index], outline[swapWith]] = [outline[swapWith], outline[index]];
    commit(outline);
  };

  const addModule = () =>
    saveModule.mutate(
      { courseId: course.id, input: { title: t('courses.builder.outline.newModule', { number: course.modules.length + 1 }) } },
      { onError: (error) => showToast(error.message, 'error') },
    );

  const addLesson = (moduleId: string) =>
    saveLesson.mutate(
      { moduleId, input: { title: t('courses.builder.outline.newLesson'), type: 'VIDEO' } },
      { onSuccess: (lesson) => setSelectedId(lesson.id), onError: (error) => showToast(error.message, 'error') },
    );

  const handleDrop = (event: React.DragEvent, moduleId: string, beforeLessonId: string | null, beforeModuleId: string | null) => {
    event.preventDefault();
    event.stopPropagation();
    setDropTarget(null);
    if (!drag) return;
    if (drag.type === 'lesson') moveLesson(drag.id, moduleId, beforeLessonId);
    else moveModule(drag.id, beforeModuleId);
    setDrag(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-3">
        {course.modules.length === 0 && (
          <Card className="text-sm text-muted-foreground">{t('courses.builder.outline.empty')}</Card>
        )}
        {course.modules.map((module, moduleIndex) => (
          <ModuleCard
            key={module.id}
            module={module}
            isFirst={moduleIndex === 0}
            isLast={moduleIndex === course.modules.length - 1}
            courseId={course.id}
            selectedId={selectedId}
            drag={drag}
            dropTarget={dropTarget}
            onSelect={setSelectedId}
            onAddLesson={() => addLesson(module.id)}
            onNudgeModule={(direction) => nudgeModule(module.id, direction)}
            onNudgeLesson={nudgeLesson}
            onDragStart={setDrag}
            onDragEnd={() => {
              setDrag(null);
              setDropTarget(null);
            }}
            onDragOver={(event, target) => {
              event.preventDefault();
              setDropTarget(target);
            }}
            onDrop={(event, beforeLessonId) => handleDrop(event, module.id, beforeLessonId, module.id)}
            isFirstLesson={(lessonId) => moduleIndex === 0 && module.lessons[0]?.id === lessonId}
            isLastLesson={(lessonId) => moduleIndex === course.modules.length - 1 && module.lessons.at(-1)?.id === lessonId}
            addingLesson={saveLesson.isPending}
          />
        ))}
        <Button variant="outline" size="sm" onClick={addModule} disabled={saveModule.isPending}>
          {saveModule.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {t('courses.builder.outline.addModule')}
        </Button>
        <p className="text-xs text-muted-foreground">{t('courses.builder.outline.hint')}</p>
      </div>

      <div className="min-w-0">
        {selected ? (
          <LessonEditor key={selected.id} courseId={course.id} lesson={selected} onDeleted={() => setSelectedId(null)} />
        ) : (
          <Card className="text-sm text-muted-foreground">{t('courses.builder.outline.select')}</Card>
        )}
      </div>
    </div>
  );
};

interface ModuleCardProps {
  module: EditableModule;
  courseId: string;
  isFirst: boolean;
  isLast: boolean;
  selectedId: string | null;
  drag: Drag;
  dropTarget: string | null;
  addingLesson: boolean;
  onSelect: (id: string) => void;
  onAddLesson: () => void;
  onNudgeModule: (direction: -1 | 1) => void;
  onNudgeLesson: (lessonId: string, direction: -1 | 1) => void;
  onDragStart: (drag: Drag) => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent, target: string) => void;
  onDrop: (event: React.DragEvent, beforeLessonId: string | null) => void;
  isFirstLesson: (id: string) => boolean;
  isLastLesson: (id: string) => boolean;
}

const iconButton = 'rounded p-1 text-muted-foreground hover:bg-secondary/60 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent';

const ModuleCard = (props: ModuleCardProps) => {
  const t = useT();
  const { module, selectedId, drag, dropTarget } = props;
  const { showToast } = useToast();
  const saveModule = useSaveModule();
  const deleteModule = useDeleteModule();
  const [title, setTitle] = useState(module.title);
  const [dripDays, setDripDays] = useState(module.dripDays ? String(module.dripDays) : '');

  const save = (input: { title?: string; dripDays?: number | null }) =>
    saveModule.mutate({ courseId: props.courseId, id: module.id, input }, { onError: (error) => showToast(error.message, 'error') });

  const handleDelete = () => {
    const count = module.lessons.length;
    if (count && !window.confirm(t('courses.builder.outline.deleteModuleConfirm', { title: module.title, count }))) return;
    deleteModule.mutate(module.id, { onError: (error) => showToast(error.message, 'error') });
  };

  return (
    <div
      className={cn('rounded-2xl', drag?.type === 'module' && dropTarget === `module:${module.id}` && 'ring-2 ring-primary')}
      onDragOver={drag?.type === 'module' ? (event) => props.onDragOver(event, `module:${module.id}`) : undefined}
      onDrop={drag?.type === 'module' ? (event) => props.onDrop(event, null) : undefined}
    >
    <Card padding="none" className="overflow-hidden">
      <div className="space-y-2 border-b border-border bg-secondary/20 p-3">
        <div className="flex items-center gap-1.5">
          <span
            draggable
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = 'move';
              props.onDragStart({ type: 'module', id: module.id });
            }}
            onDragEnd={props.onDragEnd}
            className="cursor-grab text-muted-foreground active:cursor-grabbing"
            aria-hidden
          >
            <GripVertical className="w-4 h-4" />
          </span>
          <input
            aria-label={t('courses.builder.outline.moduleTitle')}
            value={title}
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => title.trim() && title.trim() !== module.title && save({ title: title.trim() })}
            className="min-w-0 flex-1 rounded-md bg-transparent px-1.5 py-1 text-sm font-bold focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button aria-label={t('courses.builder.outline.moveModuleUp')} disabled={props.isFirst} onClick={() => props.onNudgeModule(-1)} className={iconButton}>
            <ChevronUp className="w-4 h-4" />
          </button>
          <button aria-label={t('courses.builder.outline.moveModuleDown')} disabled={props.isLast} onClick={() => props.onNudgeModule(1)} className={iconButton}>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button aria-label={t('courses.builder.outline.deleteModule')} onClick={handleDelete} disabled={deleteModule.isPending} className={cn(iconButton, 'hover:text-red-500')}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 ps-6 text-xs text-muted-foreground">
          {t('courses.builder.outline.opens')}
          <input
            type="number"
            min={1}
            aria-label={t('courses.builder.outline.daysAfter')}
            value={dripDays}
            placeholder="0"
            onChange={(event) => setDripDays(event.target.value)}
            onBlur={() => {
              const next = dripDays ? Number(dripDays) : null;
              if (next !== module.dripDays && (next === null || (Number.isInteger(next) && next >= 1))) save({ dripDays: next });
            }}
            className="h-7 w-14 rounded-md border border-border bg-background px-2 text-xs"
          />
          {t('courses.builder.outline.daysAfterText')} {dripDays ? '' : t('courses.builder.outline.rightAway')}
        </label>
      </div>
      <ul
        className="space-y-0.5 p-2"
        onDragOver={drag?.type === 'lesson' ? (event) => props.onDragOver(event, `end:${module.id}`) : undefined}
        onDrop={drag?.type === 'lesson' ? (event) => props.onDrop(event, null) : undefined}
      >
        {module.lessons.map((lesson) => (
          <li
            key={lesson.id}
            draggable
            onDragStart={(event) => {
              event.stopPropagation();
              event.dataTransfer.effectAllowed = 'move';
              props.onDragStart({ type: 'lesson', id: lesson.id });
            }}
            onDragEnd={props.onDragEnd}
            onDragOver={drag?.type === 'lesson' ? (event) => props.onDragOver(event, lesson.id) : undefined}
            onDrop={drag?.type === 'lesson' ? (event) => props.onDrop(event, lesson.id) : undefined}
            className={cn(
              'group/lesson flex items-center gap-1.5 rounded-lg border-t-2 border-transparent px-1.5 py-1.5 text-sm',
              selectedId === lesson.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/40',
              drag?.type === 'lesson' && dropTarget === lesson.id && drag.id !== lesson.id && 'border-primary',
              drag?.id === lesson.id && 'opacity-40',
            )}
          >
            <GripVertical className="w-4 h-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
            <button onClick={() => props.onSelect(lesson.id)} className="flex min-w-0 flex-1 items-center gap-2 text-start">
              {lesson.type === 'VIDEO' ? <PlayCircle className="w-4 h-4 shrink-0" /> : <FileText className="w-4 h-4 shrink-0" />}
              <span className="truncate">{lesson.title}</span>
              {lesson.attachments.length > 0 && <Paperclip className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
            </button>
            <span className="flex shrink-0 opacity-0 transition-opacity group-hover/lesson:opacity-100 group-focus-within/lesson:opacity-100">
              <button aria-label={t('courses.builder.outline.moveUp', { title: lesson.title })} disabled={props.isFirstLesson(lesson.id)} onClick={() => props.onNudgeLesson(lesson.id, -1)} className={iconButton}>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button aria-label={t('courses.builder.outline.moveDown', { title: lesson.title })} disabled={props.isLastLesson(lesson.id)} onClick={() => props.onNudgeLesson(lesson.id, 1)} className={iconButton}>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </span>
          </li>
        ))}
        {drag?.type === 'lesson' && (
          <li className={cn('rounded-lg border-2 border-dashed px-3 py-2 text-xs text-muted-foreground', dropTarget === `end:${module.id}` ? 'border-primary' : 'border-border')}>
            {t('courses.builder.outline.dropEnd')}
          </li>
        )}
        <li>
          <button
            onClick={props.onAddLesson}
            disabled={props.addingLesson}
            className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
          >
            <Plus className="w-4 h-4" /> {t('courses.builder.outline.addLesson')}
          </button>
        </li>
      </ul>
    </Card>
    </div>
  );
};

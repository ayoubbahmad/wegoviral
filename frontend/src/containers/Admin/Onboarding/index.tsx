'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { Textarea } from '@/components/Textarea';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import {
  useAdminGuide,
  useCommunitySettings,
  usePublishGuide,
  useSaveGuideSections,
  useSaveQuiz,
  useUpdateSettings,
} from '../api/joining';
import { AdminGuide, CommunitySettings, GuideSectionDraft, QuizQuestionDraft } from '../types';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

export const AdminOnboardingContainer = () => {
  const settings = useCommunitySettings();
  const guide = useAdminGuide();

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/onboarding-settings" title="Onboarding" description="How new members join: approval, community guide and quiz." />
      {settings.isPending || guide.isPending ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : settings.error || guide.error ? (
        <p className="text-sm text-muted-foreground">{(settings.error || guide.error)?.message}</p>
      ) : (
        <>
          <SettingsCard settings={settings.data} />
          {/* Remount when the saved guide changes so drafts start from the latest version */}
          <GuideEditor key={`guide-${guide.dataUpdatedAt}`} guide={guide.data} />
          <QuizEditor key={`quiz-${guide.dataUpdatedAt}`} guide={guide.data} settings={settings.data} />
        </>
      )}
    </PageContainer>
  );
};

// ─── Settings ────────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange, label, description }: { checked: boolean; onChange: (value: boolean) => void; label: string; description: string }) => (
  <label className="flex cursor-pointer items-start justify-between gap-4">
    <span>
      <span className="block text-sm font-semibold">{label}</span>
      <span className="block text-xs text-muted-foreground">{description}</span>
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-secondary')}
    >
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
    </button>
  </label>
);

const SettingsCard = ({ settings }: { settings: CommunitySettings }) => {
  const { showToast } = useToast();
  const update = useUpdateSettings();

  const save = (changes: Partial<CommunitySettings>) =>
    update.mutate(changes, {
      onSuccess: () => showToast('Settings saved'),
      onError: (error) => showToast(error.message, 'error'),
    });

  return (
    <Card className="space-y-5">
      <h2 className="font-bold">Joining rules</h2>
      <Toggle
        checked={settings.requireApproval}
        onChange={(requireApproval) => save({ requireApproval })}
        label="Approve new members"
        description="New members wait for a staff member to approve their application. Invite and referral links skip this."
      />
      <Toggle
        checked={settings.requireRules}
        onChange={(requireRules) => save({ requireRules })}
        label="Require accepting the community guide"
        description="Members can read but not post, comment or react until they accept the latest guide."
      />
      <Toggle
        checked={settings.requireQuiz}
        onChange={(requireQuiz) => save({ requireQuiz })}
        label="Require passing the quiz"
        description="After accepting the guide, members answer the quiz below before they can interact."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberSetting
          label="Quiz pass mark (%)"
          value={settings.quizPassPercent}
          min={1}
          max={100}
          onSave={(quizPassPercent) => save({ quizPassPercent })}
        />
        <NumberSetting
          label="Reviewed posts for new members"
          hint="New members' first posts wait for review by staff or trusted members. 0 turns review off."
          value={settings.probationPostCount}
          min={0}
          max={20}
          onSave={(probationPostCount) => save({ probationPostCount })}
        />
      </div>
    </Card>
  );
};

const NumberSetting = ({ label, hint, value, min, max, onSave }: { label: string; hint?: string; value: number; min: number; max: number; onSave: (value: number) => void }) => {
  const [draft, setDraft] = useState(String(value));
  const parsed = Number(draft);
  const valid = Number.isInteger(parsed) && parsed >= min && parsed <= max;
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex gap-2">
        <input type="number" min={min} max={max} value={draft} onChange={(e) => setDraft(e.target.value)} className={inputClass} />
        <Button variant="outline" size="sm" disabled={!valid || parsed === value} onClick={() => onSave(parsed)}>
          Save
        </Button>
      </div>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
};

// ─── Guide ───────────────────────────────────────────────────────────────────

const move = <T,>(items: T[], index: number, by: number) => {
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
};

const GuideEditor = ({ guide }: { guide: AdminGuide }) => {
  const { showToast } = useToast();
  const saveSections = useSaveGuideSections();
  const publish = usePublishGuide();
  const [sections, setSections] = useState<GuideSectionDraft[]>(guide.sections);
  const isDirty = JSON.stringify(sections.map(({ title, body, mediaUrl }) => ({ title, body, mediaUrl: mediaUrl || null }))) !==
    JSON.stringify(guide.sections.map(({ title, body, mediaUrl }) => ({ title, body, mediaUrl: mediaUrl || null })));
  const isValid = sections.every((section) => section.title.trim() && section.body.trim());

  const update = (index: number, change: Partial<GuideSectionDraft>) =>
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...change } : section)));

  const handleSave = () =>
    saveSections.mutate(sections, {
      onSuccess: () => showToast('Draft saved. Publish it when you are ready.'),
      onError: (error) => showToast(error.message, 'error'),
    });

  const handlePublish = () => {
    const message =
      guide.version === 0
        ? 'Publish the community guide? Every member will be asked to read and accept it.'
        : `Publish version ${guide.version + 1}? Every member will be asked to accept the guide again.`;
    if (!window.confirm(message)) return;
    publish.mutate(undefined, {
      onSuccess: ({ version }) => showToast(`Guide version ${version} published`),
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">Community guide</h2>
          <p className="text-xs text-muted-foreground">
            {guide.version === 0
              ? 'Not published yet.'
              : `Version ${guide.version} is live · ${guide.stats.acceptedLatest} of ${guide.stats.approvedMembers} members accepted it.`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!isDirty || !isValid || saveSections.isPending}>
            {saveSections.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save draft'}
          </Button>
          <Button variant="primary" size="sm" onClick={handlePublish} disabled={isDirty || !guide.sections.length || publish.isPending}>
            {publish.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : guide.version === 0 ? 'Publish' : 'Publish new version'}
          </Button>
        </div>
      </div>
      {isDirty && <p className="text-xs text-amber-500">Unsaved changes: save the draft before publishing.</p>}

      {sections.map((section, index) => (
        <div key={index} className="space-y-2 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">{index + 1}.</span>
            <input
              value={section.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="Section title, e.g. Be respectful"
              maxLength={120}
              className={inputClass}
            />
            <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => setSections((s) => move(s, index, -1))} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
              <ArrowUp className="w-4 h-4" />
            </button>
            <button type="button" aria-label="Move down" disabled={index === sections.length - 1} onClick={() => setSections((s) => move(s, index, 1))} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
              <ArrowDown className="w-4 h-4" />
            </button>
            <button type="button" aria-label="Remove section" onClick={() => setSections((s) => s.filter((_, i) => i !== index))} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Textarea value={section.body} onChange={(e) => update(index, { body: e.target.value })} placeholder="The rule or policy, in plain words" className="min-h-[100px]" />
          <input
            value={section.mediaUrl ?? ''}
            onChange={(e) => update(index, { mediaUrl: e.target.value })}
            placeholder="Optional image or video link"
            className={inputClass}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setSections((s) => [...s, { title: '', body: '', mediaUrl: '' }])}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="w-4 h-4" /> Add section
      </button>
    </Card>
  );
};

// ─── Quiz ────────────────────────────────────────────────────────────────────

const QuizEditor = ({ guide, settings }: { guide: AdminGuide; settings: CommunitySettings }) => {
  const { showToast } = useToast();
  const saveQuiz = useSaveQuiz();
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>(guide.questions);
  const isValid = questions.every(
    (q) => q.question.trim() && q.options.length >= 2 && q.options.every((option) => option.trim()) && q.correctIndex < q.options.length,
  );

  const update = (index: number, change: Partial<QuizQuestionDraft>) =>
    setQuestions((current) => current.map((q, i) => (i === index ? { ...q, ...change } : q)));

  const handleSave = () =>
    saveQuiz.mutate(questions, {
      onSuccess: () => showToast('Quiz saved'),
      onError: (error) => showToast(error.message, 'error'),
    });

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">Quiz</h2>
          <p className="text-xs text-muted-foreground">
            {settings.requireQuiz ? 'Required: members must pass it after accepting the guide.' : 'Off: turn on "Require passing the quiz" above to use it.'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSave} disabled={!isValid || saveQuiz.isPending}>
          {saveQuiz.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save quiz'}
        </Button>
      </div>

      {questions.map((question, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">{index + 1}.</span>
            <input value={question.question} onChange={(e) => update(index, { question: e.target.value })} placeholder="Question" maxLength={300} className={inputClass} />
            <button type="button" aria-label="Remove question" onClick={() => setQuestions((q) => q.filter((_, i) => i !== index))} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Select the correct answer.</p>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${index}`}
                checked={question.correctIndex === optionIndex}
                onChange={() => update(index, { correctIndex: optionIndex })}
                aria-label={`Option ${optionIndex + 1} is correct`}
                className="accent-[var(--primary)]"
              />
              <input
                value={option}
                onChange={(e) => update(index, { options: question.options.map((o, i) => (i === optionIndex ? e.target.value : o)) })}
                placeholder={`Option ${optionIndex + 1}`}
                maxLength={200}
                className={inputClass}
              />
              {question.options.length > 2 && (
                <button
                  type="button"
                  aria-label="Remove option"
                  onClick={() =>
                    update(index, {
                      options: question.options.filter((_, i) => i !== optionIndex),
                      correctIndex: question.correctIndex === optionIndex ? 0 : question.correctIndex > optionIndex ? question.correctIndex - 1 : question.correctIndex,
                    })
                  }
                  className="p-2 rounded-lg text-muted-foreground hover:bg-secondary/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {question.options.length < 6 && (
            <button type="button" onClick={() => update(index, { options: [...question.options, ''] })} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add option
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setQuestions((q) => [...q, { question: '', options: ['', ''], correctIndex: 0 }])}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="w-4 h-4" /> Add question
      </button>
    </Card>
  );
};

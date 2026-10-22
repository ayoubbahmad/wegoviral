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
import { useT } from '@/i18n/provider';
import { LanguageTabs } from '@/components/LanguageTabs';
import { bindField, cleanTranslations, ContentLanguage, isTranslated, readListItem, removeListItem, writeListItem } from '@/lib/translations';

const inputClass =
  'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20';

export const AdminOnboardingContainer = () => {
  const t = useT();
  const settings = useCommunitySettings();
  const guide = useAdminGuide();

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/onboarding-settings" title={t('admin.onboardingPage.title')} description={t('admin.onboardingPage.description')} />
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
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all', checked ? 'start-[22px]' : 'start-0.5')} />
    </button>
  </label>
);

const SettingsCard = ({ settings }: { settings: CommunitySettings }) => {
  const t = useT();
  const { showToast } = useToast();
  const update = useUpdateSettings();

  const save = (changes: Partial<CommunitySettings>) =>
    update.mutate(changes, {
      onSuccess: () => showToast(t('admin.onboardingPage.settingsSaved')),
      onError: (error) => showToast(error.message, 'error'),
    });

  return (
    <Card className="space-y-5">
      <h2 className="font-bold">{t('admin.onboardingPage.rulesTitle')}</h2>
      <Toggle
        checked={settings.requireApproval}
        onChange={(requireApproval) => save({ requireApproval })}
        label={t('admin.onboardingPage.approve')}
        description={t('admin.onboardingPage.approveHint')}
      />
      <Toggle
        checked={settings.requireRules}
        onChange={(requireRules) => save({ requireRules })}
        label={t('admin.onboardingPage.requireGuide')}
        description={t('admin.onboardingPage.requireGuideHint')}
      />
      <Toggle
        checked={settings.requireQuiz}
        onChange={(requireQuiz) => save({ requireQuiz })}
        label={t('admin.onboardingPage.requireQuiz')}
        description={t('admin.onboardingPage.requireQuizHint')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberSetting
          label={t('admin.onboardingPage.passMark')}
          value={settings.quizPassPercent}
          min={1}
          max={100}
          onSave={(quizPassPercent) => save({ quizPassPercent })}
        />
        <NumberSetting
          label={t('admin.onboardingPage.reviewed')}
          hint={t('admin.onboardingPage.reviewedHint')}
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
  const t = useT();
  const [draft, setDraft] = useState(String(value));
  const parsed = Number(draft);
  const valid = Number.isInteger(parsed) && parsed >= min && parsed <= max;
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex gap-2">
        <input type="number" min={min} max={max} value={draft} onChange={(e) => setDraft(e.target.value)} className={inputClass} />
        <Button variant="outline" size="sm" disabled={!valid || parsed === value} onClick={() => onSave(parsed)}>
          {t('admin.onboardingPage.save')}
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
  const t = useT();
  const { showToast } = useToast();
  const saveSections = useSaveGuideSections();
  const publish = usePublishGuide();
  const [sections, setSections] = useState<GuideSectionDraft[]>(guide.sections);
  const [language, setLanguage] = useState<ContentLanguage>('en');
  const comparable = (list: GuideSectionDraft[]) =>
    JSON.stringify(list.map(({ title, body, mediaUrl, translations }) => ({ title, body, mediaUrl: mediaUrl || null, translations: cleanTranslations(translations) })));
  const isDirty = comparable(sections) !== comparable(guide.sections);
  const isValid = sections.every((section) => section.title.trim() && section.body.trim());

  const update = (index: number, change: Partial<GuideSectionDraft>) =>
    setSections((current) => current.map((section, i) => (i === index ? { ...section, ...change } : section)));

  const handleSave = () =>
    saveSections.mutate(sections, {
      onSuccess: () => showToast(t('admin.onboardingPage.draftSaved')),
      onError: (error) => showToast(error.message, 'error'),
    });

  const handlePublish = () => {
    const message =
      guide.version === 0
        ? t('admin.onboardingPage.publishFirst')
        : t('admin.onboardingPage.publishNext', { version: guide.version + 1 });
    if (!window.confirm(message)) return;
    publish.mutate(undefined, {
      onSuccess: ({ version }) => showToast(t('admin.onboardingPage.published', { version })),
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">{t('admin.onboardingPage.guideTitle')}</h2>
          <p className="text-xs text-muted-foreground">
            {guide.version === 0
              ? t('admin.onboardingPage.notPublished')
              : t('admin.onboardingPage.live', { version: guide.version, accepted: guide.stats.acceptedLatest, members: guide.stats.approvedMembers })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!isDirty || !isValid || saveSections.isPending}>
            {saveSections.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.onboardingPage.saveDraft')}
          </Button>
          <Button variant="primary" size="sm" onClick={handlePublish} disabled={isDirty || !guide.sections.length || publish.isPending}>
            {publish.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : guide.version === 0 ? t('admin.onboardingPage.publish') : t('admin.onboardingPage.publishNew')}
          </Button>
        </div>
      </div>
      {isDirty && <p className="text-xs text-amber-500">{t('admin.onboardingPage.unsaved')}</p>}
      <LanguageTabs value={language} onChange={setLanguage} isMissing={(lang) => sections.some((section) => !isTranslated(section, ['title', 'body'], lang))} />

      {sections.map((section, index) => {
        const field = bindField(section, (next) => update(index, next), language);
        return (
        <div key={index} className="space-y-2 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">{index + 1}.</span>
            <input {...field('title', t('admin.onboardingPage.sectionTitle'))} maxLength={120} className={inputClass} />
            <button type="button" aria-label={t('admin.onboardingPage.moveUp')} disabled={index === 0} onClick={() => setSections((s) => move(s, index, -1))} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
              <ArrowUp className="w-4 h-4" />
            </button>
            <button type="button" aria-label={t('admin.onboardingPage.moveDown')} disabled={index === sections.length - 1} onClick={() => setSections((s) => move(s, index, 1))} className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-30">
              <ArrowDown className="w-4 h-4" />
            </button>
            <button type="button" aria-label={t('admin.onboardingPage.removeSection')} onClick={() => setSections((s) => s.filter((_, i) => i !== index))} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Textarea {...field('body', t('admin.onboardingPage.sectionBody'))} className="min-h-[100px]" />
          <input
            value={section.mediaUrl ?? ''}
            onChange={(e) => update(index, { mediaUrl: e.target.value })}
            placeholder={t('admin.onboardingPage.media')}
            className={inputClass}
          />
        </div>
        );
      })}
      <button
        type="button"
        onClick={() => setSections((s) => [...s, { title: '', body: '', mediaUrl: '' }])}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="w-4 h-4" /> {t('admin.onboardingPage.addSection')}
      </button>
    </Card>
  );
};

// ─── Quiz ────────────────────────────────────────────────────────────────────

const QuizEditor = ({ guide, settings }: { guide: AdminGuide; settings: CommunitySettings }) => {
  const t = useT();
  const { showToast } = useToast();
  const saveQuiz = useSaveQuiz();
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>(guide.questions);
  const [language, setLanguage] = useState<ContentLanguage>('en');
  const isValid = questions.every(
    (q) => q.question.trim() && q.options.length >= 2 && q.options.every((option) => option.trim()) && q.correctIndex < q.options.length,
  );

  const update = (index: number, change: Partial<QuizQuestionDraft>) =>
    setQuestions((current) => current.map((q, i) => (i === index ? { ...q, ...change } : q)));

  const handleSave = () =>
    saveQuiz.mutate(questions, {
      onSuccess: () => showToast(t('admin.onboardingPage.quizSaved')),
      onError: (error) => showToast(error.message, 'error'),
    });

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">{t('admin.onboardingPage.quizTitle')}</h2>
          <p className="text-xs text-muted-foreground">
            {settings.requireQuiz ? t('admin.onboardingPage.quizOn') : t('admin.onboardingPage.quizOff')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSave} disabled={!isValid || saveQuiz.isPending}>
          {saveQuiz.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.onboardingPage.saveQuiz')}
        </Button>
      </div>

      <LanguageTabs value={language} onChange={setLanguage} isMissing={(lang) => questions.some((question) => !isTranslated(question, ['question', 'options'], lang))} />

      {questions.map((question, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">{index + 1}.</span>
            <input {...bindField(question, (next) => update(index, next), language)('question', t('admin.onboardingPage.question'))} maxLength={300} className={inputClass} />
            <button type="button" aria-label={t('admin.onboardingPage.removeQuestion')} onClick={() => setQuestions((q) => q.filter((_, i) => i !== index))} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{t('admin.onboardingPage.selectCorrect')}</p>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${index}`}
                checked={question.correctIndex === optionIndex}
                onChange={() => update(index, { correctIndex: optionIndex })}
                aria-label={t('admin.onboardingPage.optionCorrect', { number: optionIndex + 1 })}
                className="accent-[var(--primary)]"
              />
              <input
                value={readListItem(question, 'options', optionIndex, language)}
                onChange={(e) => update(index, writeListItem(question, 'options', optionIndex, language, e.target.value))}
                placeholder={language === 'en' ? t('admin.onboardingPage.option', { number: optionIndex + 1 }) : option}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                maxLength={200}
                className={inputClass}
              />
              {question.options.length > 2 && (
                <button
                  type="button"
                  aria-label={t('admin.onboardingPage.removeOption')}
                  onClick={() =>
                    update(index, {
                      ...removeListItem(question, 'options', optionIndex),
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
              <Plus className="w-3.5 h-3.5" /> {t('admin.onboardingPage.addOption')}
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setQuestions((q) => [...q, { question: '', options: ['', ''], correctIndex: 0 }])}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <Plus className="w-4 h-4" /> {t('admin.onboardingPage.addQuestion')}
      </button>
    </Card>
  );
};

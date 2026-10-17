'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { useAuth, useRefreshUser } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { cn } from '@/lib/utils';
import { Guide, QuizResult, useAcceptRules, useGuide, useSubmitQuiz } from './api';

/** The community rules and policy; members accept them (logged) and may need to pass a quiz. */
export function GuidePage() {
  const { user } = useAuth();
  const { data: guide, isPending, error } = useGuide();
  const step = user?.onboarding.step;
  const isApproved = user?.onboarding.joinStatus === 'APPROVED' || step === 'DONE';

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-32">
      <Link
        href={isApproved ? '/community/feed' : '/'}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> {isApproved ? 'Back to the community' : 'Back'}
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Community guide</h1>
        <p className="text-muted-foreground">The rules and policy every WeGoViral member agrees to.</p>
      </div>

      {isPending ? (
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : guide.version === 0 ? (
        <EmptyState icon={BookOpen} title="No guide yet" description="The team hasn't published the community guide yet." />
      ) : (
        <>
          <div className="space-y-4">
            {guide.sections.map((section, index) => (
              <Card key={section.id} className="space-y-3">
                <h2 className="text-lg font-bold">
                  {index + 1}. {section.title}
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{section.body}</p>
                {section.mediaUrl &&
                  (/\.(png|jpe?g|webp|gif)(\?|$)/i.test(section.mediaUrl) ? (
                    <img src={section.mediaUrl} alt="" className="max-h-80 rounded-xl border border-border" />
                  ) : (
                    <a href={section.mediaUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
                      Open the attached video or link ↗
                    </a>
                  ))}
              </Card>
            ))}
          </div>

          <AcceptRules guide={guide} />
          {guide.quiz && (guide.acceptedVersion ?? 0) >= guide.version && isApproved && <Quiz guide={guide} />}
        </>
      )}
    </div>
  );
}

const AcceptRules = ({ guide }: { guide: Guide }) => {
  const refreshUser = useRefreshUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const accept = useAcceptRules();
  const [checked, setChecked] = useState(false);
  const accepted = (guide.acceptedVersion ?? 0) >= guide.version;

  if (accepted) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-500">
        <CheckCircle2 className="w-4 h-4" />
        You accepted this guide{guide.acceptedAt ? ` on ${new Date(guide.acceptedAt).toLocaleDateString()}` : ''}.
      </p>
    );
  }

  const handleAccept = () =>
    accept.mutate(guide.version, {
      onSuccess: async () => {
        await refreshUser();
        await queryClient.invalidateQueries({ queryKey: ['onboarding', 'guide'] });
        showToast('Thanks for accepting the community guide');
        if (!guide.quiz) router.push('/community/feed');
      },
      onError: (error) => {
        showToast(error.message, 'error');
        // The guide may have just changed: show the latest version
        queryClient.invalidateQueries({ queryKey: ['onboarding', 'guide'] });
      },
    });

  return (
    <Card className="space-y-4">
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
        />
        <span>I&apos;ve read the community guide and I accept the rules and policy.</span>
      </label>
      <Button variant="primary" onClick={handleAccept} disabled={!checked || accept.isPending}>
        {accept.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept and continue'}
      </Button>
    </Card>
  );
};

const Quiz = ({ guide }: { guide: Guide }) => {
  const refreshUser = useRefreshUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const submit = useSubmitQuiz();
  const quiz = guide.quiz!;
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const alreadyPassed = (guide.quizPassedVersion ?? 0) >= guide.version;

  if (alreadyPassed) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-500">
        <CheckCircle2 className="w-4 h-4" /> You passed the community quiz.
      </p>
    );
  }

  const handleSubmit = () =>
    submit.mutate(answers as number[], {
      onSuccess: async (outcome) => {
        setResult(outcome);
        if (outcome.passed) {
          await refreshUser();
          await queryClient.invalidateQueries({ queryKey: ['onboarding', 'guide'] });
          showToast('Quiz passed, welcome to WeGoViral!');
          router.push('/community/feed');
        }
      },
      onError: (error) => showToast(error.message, 'error'),
    });

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Quick quiz</h2>
        <p className="text-sm text-muted-foreground">
          {quiz.questions.length} questions · you need {quiz.passPercent}% to pass. You can retry as often as you need.
        </p>
      </div>
      {quiz.questions.map((question, index) => (
        <fieldset key={question.id} className="space-y-2">
          <legend className="flex items-center gap-2 text-sm font-semibold">
            {result && (result.results[index] ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />)}
            {index + 1}. {question.question}
          </legend>
          {question.options.map((option, optionIndex) => (
            <label
              key={optionIndex}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors',
                answers[index] === optionIndex ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/30',
              )}
            >
              <input
                type="radio"
                name={question.id}
                checked={answers[index] === optionIndex}
                onChange={() => {
                  setResult(null);
                  setAnswers((current) => current.map((value, i) => (i === index ? optionIndex : value)));
                }}
                className="accent-[var(--primary)]"
              />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
      {result && !result.passed && (
        <p className="text-sm font-medium text-red-500">
          You scored {result.score}% (you need {result.passPercent}%). Check the questions marked in red and try again.
        </p>
      )}
      <Button variant="primary" onClick={handleSubmit} disabled={answers.some((answer) => answer === null) || submit.isPending}>
        {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit answers'}
      </Button>
    </Card>
  );
};

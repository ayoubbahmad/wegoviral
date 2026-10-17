import { prisma } from './prisma';

const CACHE_MS = 30_000;

export interface Settings {
  requireApproval: boolean;
  requireRules: boolean;
  requireQuiz: boolean;
  quizPassPercent: number;
  probationPostCount: number;
  guideVersion: number;
  quizQuestionCount: number;
}

let cached: { value: Settings; at: number } | null = null;

/** Community settings, read on almost every request, so cached briefly in memory. */
export async function getSettings(): Promise<Settings> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;
  const [settings, quizQuestionCount] = await Promise.all([
    prisma.communitySettings.upsert({ where: { id: 'default' }, create: { id: 'default' }, update: {} }),
    prisma.quizQuestion.count(),
  ]);
  const value: Settings = {
    requireApproval: settings.requireApproval,
    requireRules: settings.requireRules,
    requireQuiz: settings.requireQuiz,
    quizPassPercent: settings.quizPassPercent,
    probationPostCount: settings.probationPostCount,
    guideVersion: settings.guideVersion,
    quizQuestionCount,
  };
  cached = { value, at: Date.now() };
  return value;
}

/** Call after changing settings, the guide or the quiz. */
export function invalidateSettings() {
  cached = null;
}

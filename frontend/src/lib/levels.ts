import type { MessageKey } from '@/i18n/messages';
import type { Vars } from '@/i18n/types';

/** "Any level" plus every level above the first, for access rule pickers. */
export const levelOptions = (
  levels: { level: number; name: string; minPoints: number }[] = [],
  t: (key: MessageKey, vars?: Vars) => string,
) => [
  { value: '', label: t('common.access.anyLevel') },
  ...levels
    .filter((level) => level.level > 1)
    .map((level) => ({ value: String(level.level), label: t('common.access.levelOption', { level: level.level, name: level.name, points: level.minPoints }) })),
];

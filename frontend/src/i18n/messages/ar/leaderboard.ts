import type { Shape } from '../../types';
import type { leaderboard as en } from '../en/leaderboard';

export const leaderboard: Shape<typeof en> = {
  title: 'لوحة الترتيب',
  description: 'اكسب النقاط بالنشر والتعليق والحضور. ارتقِ في المستويات لتفتح المزيد من المجتمع.',
  howPoints: 'كيف تعمل النقاط؟',
  periods: { '7d': 'آخر 7 أيام', '30d': 'آخر 30 يومًا', all: 'منذ البداية' },
  period: 'الفترة',
  emptyTitle: 'لا نقاط بعد',
  emptyBody: 'كن الأول: انشر منشورًا أو سجّل في فعالية لتظهر في الترتيب.',
  levelChip: 'م{level} · {name}',
  levelLine: 'المستوى {level} · {name}',
  progressNext: '{points} نقطة · تبقّت {toGo} لبلوغ المستوى {level} ({name})',
  progressTop: '{points} نقطة · لقد بلغت أعلى مستوى',
  myRank: 'ترتيبك رقم {rank} برصيد {points} نقطة في هذه الفترة.',
  notRanked: 'اكسب نقاطًا في هذه الفترة لتظهر في الترتيب.',
  levels: 'المستويات',
  pts: '{count} نقطة',
  rank: 'المرتبة {rank}',
  dialogTitle: 'كيف تعمل النقاط',
  earning: 'كسب النقاط',
  upToPerDay: 'حتى {count} يوميًا',
  earningNote: 'حذف منشور أو تعليق، أو سحب إعجاب، يسحب نقاطه أيضًا. تحتسب فترات الترتيب النقاط المكتسبة خلالها.',
  levelsNote: 'يحدَّد مستواك من مجموع نقاطك. بعض المساحات والفعاليات تُفتح عند مستوى معيّن.',
  badges: 'الشارات',
};

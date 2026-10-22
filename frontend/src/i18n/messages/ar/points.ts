import type { Shape } from '../../types';
import type { points as en } from '../en/points';

export const points: Shape<typeof en> = {
  actions: {
    POST_PUBLISHED: 'نشر منشور',
    COMMENT_ADDED: 'التعليق',
    LIKE_RECEIVED: 'الحصول على إعجاب على منشورك',
    EVENT_JOINED: 'التسجيل في فعالية',
    POST_REVIEWED: 'مراجعة منشور عضو جديد',
    GUIDE_ACCEPTED: 'الموافقة على دليل المجتمع',
    LESSON_COMPLETED: 'إكمال درس',
    COURSE_COMPLETED: 'إكمال دورة',
    CHALLENGE_CHECKIN: 'تسجيل إنجاز في تحدٍّ',
    CHALLENGE_COMPLETED: 'إكمال تحدٍّ',
    CHALLENGE_WON: 'الفوز بتحدٍّ',
    POST_REMOVED_BY_TEAM: 'حذف الفريق لأحد منشوراتك',
    VOUCHED_POST_REMOVED: 'حذف منشور وافقت عليه في المراجعة',
    WARNING_RECEIVED: 'تلقّي تنبيه',
    MANUAL: 'تعديل من الفريق',
  },
  autoTypes: {
    POSTS: { one: 'منشور واحد', two: 'منشوران', few: '{count} منشورات', many: '{count} منشورًا', other: '{count} منشور' },
    COMMENTS: { one: 'تعليق واحد', two: 'تعليقان', few: '{count} تعليقات', many: '{count} تعليقًا', other: '{count} تعليق' },
    LIKES_RECEIVED: { one: 'إعجاب واحد', two: 'إعجابان', few: '{count} إعجابات', many: '{count} إعجابًا', other: '{count} إعجاب' },
    EVENTS_JOINED: { one: 'فعالية واحدة', two: 'فعاليتان', few: '{count} فعاليات', many: '{count} فعالية', other: '{count} فعالية' },
    COURSES_COMPLETED: { one: 'دورة مكتملة', two: 'دورتان مكتملتان', few: '{count} دورات مكتملة', many: '{count} دورة مكتملة', other: '{count} دورة مكتملة' },
    CHALLENGES_COMPLETED: { one: 'تحدٍّ مكتمل', two: 'تحدّيان مكتملان', few: '{count} تحدّيات مكتملة', many: '{count} تحدّيًا مكتملًا', other: '{count} تحدٍّ مكتمل' },
    CHALLENGES_WON: { one: 'الفوز بتحدٍّ واحد', two: 'الفوز بتحدّيين', few: 'الفوز بـ {count} تحدّيات', many: 'الفوز بـ {count} تحدّيًا', other: 'الفوز بـ {count} تحدٍّ' },
    POINTS: { one: 'نقطة واحدة إجمالًا', two: 'نقطتان إجمالًا', few: '{count} نقاط إجمالًا', many: '{count} نقطة إجمالًا', other: '{count} نقطة إجمالًا' },
  },
  autoTypeNames: {
    POSTS: 'المنشورات',
    COMMENTS: 'التعليقات',
    LIKES_RECEIVED: 'الإعجابات المستلمة',
    EVENTS_JOINED: 'الفعاليات',
    COURSES_COMPLETED: 'الدورات المكتملة',
    CHALLENGES_COMPLETED: 'التحدّيات المكتملة',
    CHALLENGES_WON: 'التحدّيات المربوحة',
    POINTS: 'مجموع النقاط',
  },
  givenByTeam: 'يمنحها الفريق',
};

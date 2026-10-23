import type { Shape } from '../../types';
import type { members as en } from '../en/members';

export const members: Shape<typeof en> = {
  title: 'الأعضاء',
  description: 'صنّاع المحتوى في المجتمع. اعثر على أشخاص في مجالك لتتعلّم منهم وتتعاون معهم.',
  search: 'ابحث بالاسم أو اسم المستخدم أو المجال…',
  sort: 'الترتيب',
  sorts: { recent: 'الأحدث', points: 'الأكثر نقاطًا', name: 'الاسم' },
  count: { zero: 'لا أعضاء', one: 'عضو واحد', two: 'عضوان', few: '{count} أعضاء', many: '{count} عضوًا', other: '{count} عضو' },
  emptyTitle: 'لم يُعثر على أعضاء',
  emptyBody: 'جرّب اسمًا أو مجالًا آخر.',
  previous: 'السابق',
  next: 'التالي',
  pageOf: 'الصفحة {page} من {pages}',
  level: 'المستوى {level} · {name}',
  profile: {
    notFoundTitle: 'العضو غير موجود',
    notFoundBody: 'هذا العضو غير موجود، أو لم يعد جزءًا من المجتمع.',
    back: 'كل الأعضاء',
    editProfile: 'تعديل ملفك الشخصي',
    joined: 'عضو منذ {date}',
    points: { zero: '0 نقطة', one: 'نقطة واحدة', two: 'نقطتان', few: '{count} نقاط', many: '{count} نقطة', other: '{count} نقطة' },
    posts: { zero: 'لا منشورات', one: 'منشور واحد', two: 'منشوران', few: '{count} منشورات', many: '{count} منشورًا', other: '{count} منشور' },
    comments: { zero: 'لا تعليقات', one: 'تعليق واحد', two: 'تعليقان', few: '{count} تعليقات', many: '{count} تعليقًا', other: '{count} تعليق' },
    badges: 'الشارات',
    noBio: 'لا نبذة بعد.',
    recentPosts: 'المنشورات',
    noPosts: 'لا منشورات بعد.',
    noPostsSelf: 'لم تنشر بعد. شارك إنجازًا أو اطرح سؤالًا في الصفحة الرئيسية.',
    loadMore: 'عرض المزيد',
    openLink: 'فتح {platform}',
  },
};

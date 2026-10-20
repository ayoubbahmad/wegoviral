import type { Shape } from '../../types';
import type { help as en } from '../en/help';

export const help: Shape<typeof en> = {
  titles: {
    community: { title: 'مساعدة المجتمع', description: 'كيف يعمل المجتمع: الانضمام والنشر والفعاليات والدورات والتحدّيات والنقاط.' },
    creator: { title: 'مساعدة مساحة صانع المحتوى', description: 'كيف تستخدم أدواتك الشخصية لصناعة المحتوى.' },
    admin: { title: 'أدلّة الفريق', description: 'كيف تدير المجتمع، لكل دور في الفريق.' },
  },
  search: 'ابحث في مقالات المساعدة',
  nothingFound: 'لا نتائج لـ «{query}»',
  tryAnother: 'جرّب كلمة أخرى.',
  noArticles: 'لا توجد مقالات هنا بعد',
  audience: '{role}',
  forRole: ' · لفئة {role} فما فوق',
  draft: ' · مسودة',
  notFoundTitle: 'المقال غير موجود',
  notFoundBody: 'ربما نُقل، أو أنه غير موجّه لدورك.',
  updated: 'آخر تحديث {date}',
  editArticle: 'تعديل هذا المقال',
  moreIn: 'المزيد في {section}',
};

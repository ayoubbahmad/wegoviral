import type { Shape } from '../../types';
import type { contentLanguage as en } from '../en/contentLanguage';

export const contentLanguage: Shape<typeof en> = {
  label: 'لغة النص',
  main: 'الأساسية',
  missing: 'لم يُترجم بعد',
  hint: 'الحقل الذي يُترك فارغًا يُعرض بالنص الإنجليزي بدلًا من {language}.',
  names: { fr: 'الفرنسية', ar: 'العربية' },
};

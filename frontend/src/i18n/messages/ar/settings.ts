import type { Shape } from '../../types';
import type { settings as en } from '../en/settings';

export const settings: Shape<typeof en> = {
  title: 'ملفك الشخصي',
  description: 'إدارة حسابك وتفضيلاتك.',
  fullName: 'الاسم الكامل',
  email: 'البريد الإلكتروني',
  followers: 'المتابعون',
  engagement: 'نسبة التفاعل',
  avgLikes: 'متوسط الإعجابات',
  accounts: 'الحسابات المرتبطة',
  accountsSoon: 'ربط حساباتك على مواقع التواصل قادم قريبًا.',
  language: 'اللغة',
  languageHint: 'يستخدم التطبيق كله هذه اللغة، وتتبعك على كل جهاز تسجّل الدخول منه.',
  appearance: 'المظهر',
  light: 'فاتح',
  dark: 'داكن',
  system: 'حسب الجهاز',
  usingSystem: 'وفق إعدادات جهازك',
  usingLight: 'الوضع الفاتح',
  usingDark: 'الوضع الداكن',
};

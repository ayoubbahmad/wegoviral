import { Facebook, Globe, Instagram, Linkedin, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

const TikTok = ({ className }: { className?: string }) => (
  <svg viewBox='0 0 24 24' fill='currentColor' className={className} aria-hidden>
    <path d='M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.42-2.47V9.67a5.7 5.7 0 0 0-.82-.06A5.7 5.7 0 0 0 4.16 15.3 5.7 5.7 0 0 0 9.86 21a5.7 5.7 0 0 0 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48z' />
  </svg>
);

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox='0 0 24 24' fill='currentColor' className={className} aria-hidden>
    <path d='M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77L17.75 3zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2z' />
  </svg>
);

const ICONS = { instagram: Instagram, tiktok: TikTok, youtube: Youtube, x: XLogo, facebook: Facebook, linkedin: Linkedin, website: Globe } as const;

export type SocialIconPlatform = keyof typeof ICONS;

/** The logo of a social platform (a globe for websites). */
export const SocialIcon = ({ platform, className }: { platform: string; className?: string }) => {
  const Icon = ICONS[platform as SocialIconPlatform] ?? Globe;
  return <Icon className={cn('h-4 w-4', className)} aria-hidden />;
};

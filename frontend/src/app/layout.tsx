import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { DashboardLayout } from '@/containers/layout/DashboardLayout';
import { ToastProvider } from '@/providers/Toast';
import { AuthProvider } from '@/providers/Auth';
import { ThemeProvider } from '@/providers/Theme';
import { QueryProvider } from '@/providers/Query';
import { I18nProvider } from '@/i18n/provider';
import { LocaleSync } from '@/i18n/LocaleSync';
import { directionOf, isLocale, LOCALE_COOKIE, pickLocale } from '@/i18n/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  // Pages set their own title, e.g. "Timeline" -> "Timeline | WeGoViral"
  title: {
    default: 'WeGoViral',
    template: '%s | WeGoViral',
  },
  description: 'The WeGoViral creator community and workspace.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The saved choice, else the browser's languages (falling back to French)
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : pickLocale((await headers()).get('accept-language'));
  return (
    <html lang={locale} dir={directionOf(locale)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          <I18nProvider initialLocale={locale}>
            <ThemeProvider>
              <AuthProvider>
                <LocaleSync />
                <ToastProvider>{children}</ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

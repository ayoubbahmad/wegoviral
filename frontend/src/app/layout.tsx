import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Creator OS',
  description: 'Centralized dashboard for creators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

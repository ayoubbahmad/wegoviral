import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DashboardLayout } from '@/containers/layout/DashboardLayout';
import { ToastProvider } from '@/providers/Toast';
import { AuthProvider } from '@/providers/Auth';
import { ThemeProvider } from '@/providers/Theme';
import { QueryProvider } from '@/providers/Query';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // Pages set their own title, e.g. "Timeline" -> "Timeline | WeGoViral"
  title: {
    default: 'WeGoViral',
    template: '%s | WeGoViral',
  },
  description: 'The WeGoViral creator community and workspace.',
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
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

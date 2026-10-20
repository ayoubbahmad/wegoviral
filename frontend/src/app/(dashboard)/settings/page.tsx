'use client';

import { useAuth } from '@/providers/Auth';
import { Mail, User as UserIcon, Camera } from 'lucide-react';
import { ThemeToggle } from '@/containers/settings/ThemeToggle';
// import { SocialAccountsManager } from '@/containers/settings/SocialAccountsManager';
import { PageHeader } from '@/components/PageHeader';
import { useT } from '@/i18n/provider';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
// import { Button } from '@/components/Button';

export default function ProfilePage() {
  const t = useT();
  const { user, activeSocialAccount } = useAuth();

  if (!user) return null;

  return (
    <div className='space-y-12 pb-32 animate-in fade-in duration-500'>
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
      />

      <div className='p-8 rounded-2xl border border-border bg-card shadow-sm max-w-2xl'>
        <div className='flex flex-col items-center sm:flex-row gap-6'>
          <div className='relative group cursor-pointer'>
            <img
              src={
                user.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
              }
              alt={user.name}
              className='w-24 h-24 rounded-full border-4 border-background shadow-lg'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
              <Camera className='w-6 h-6 text-white' />
            </div>
          </div>

          <div className='flex-1 space-y-4 w-full text-center sm:text-start'>
            <div>
              <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block'>
                {t('settings.fullName')}
              </label>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border'>
                <UserIcon className='w-5 h-5 text-muted-foreground' />
                <span className='font-medium'>{user.name}</span>
              </div>
            </div>

            <div>
              <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block'>
                {t('settings.email')}
              </label>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border'>
                <Mail className='w-5 h-5 text-muted-foreground' />
                <span className='font-medium'>{user.email}</span>
              </div>
            </div>

            {activeSocialAccount && (
              <div className='grid grid-cols-3 gap-3 pt-2'>
                <div className='p-3 bg-secondary/20 rounded-lg border border-border text-center'>
                  <span className='block text-xl font-bold'>12.5k</span>
                  <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                    {t('settings.followers')}
                  </span>
                </div>
                <div className='p-3 bg-secondary/20 rounded-lg border border-border text-center'>
                  <span className='block text-xl font-bold'>4.2%</span>
                  <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                    {t('settings.engagement')}
                  </span>
                </div>
                <div className='p-3 bg-secondary/20 rounded-lg border border-border text-center'>
                  <span className='block text-xl font-bold'>892</span>
                  <span className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                    {t('settings.avgLikes')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='p-8 rounded-2xl border border-border bg-card shadow-sm max-w-2xl'>
        <h2 className='text-lg font-semibold mb-6'>{t('settings.accounts')}</h2>
        <div className='text-sm text-muted-foreground text-center py-8'>{t('settings.accountsSoon')}</div>
      </div>

      <div className='p-8 rounded-2xl border border-border bg-card shadow-sm max-w-2xl space-y-3'>
        <h2 className='text-lg font-semibold'>{t('settings.language')}</h2>
        <p className='text-sm text-muted-foreground'>{t('settings.languageHint')}</p>
        <LanguageSwitcher />
      </div>

      {/* <SocialAccountsManager /> */}

      <div className='p-8 rounded-2xl border border-border bg-card shadow-sm max-w-2xl'>
        <h2 className='text-lg font-semibold mb-6'>{t('settings.appearance')}</h2>
        <ThemeToggle />
      </div>
    </div>
  );
}

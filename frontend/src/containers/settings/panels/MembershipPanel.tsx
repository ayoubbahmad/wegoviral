'use client';

import Link from 'next/link';
import { BookOpen, Crown, Trophy } from 'lucide-react';
import { Switch } from '@/components/Switch';
import { ProgressBar } from '@/components/ProgressBar';
import { ReferralCard } from '@/containers/Onboarding/ReferralCard';
import { useToast } from '@/providers/Toast';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';
import { Privacy, SettingsData, useUpdatePrivacy } from '../api';
import { PanelHeader, SettingsCard } from '../components';

const PRIVACY: (keyof Privacy)[] = ['showOnLeaderboard', 'showBadges', 'showSocialLinks'];

export function MembershipPanel({ data }: { data: SettingsData }) {
  const t = useT();
  const { showToast } = useToast();
  const save = useUpdatePrivacy();
  const formatDate = (value: string) => new Date(value).toLocaleDateString(activeIntl(), { dateStyle: 'long' });
  const { level } = data;
  const progress = level.next ? ((data.points - level.minPoints) / (level.next.minPoints - level.minPoints)) * 100 : 100;
  const { currentVersion, acceptedVersion, acceptedAt } = data.guide;

  return (
    <div className='space-y-6'>
      <PanelHeader title={t('settings.membership.title')} description={t('settings.membership.description')} />

      <SettingsCard title={t('settings.membership.tier')}>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex items-center gap-3 rounded-xl border border-border p-4'>
            <span className='rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400'>
              <Crown className='h-5 w-5' aria-hidden />
            </span>
            <span>
              <span className='block font-semibold'>{data.tier?.name ?? t('settings.membership.defaultTier')}</span>
              <span className='block text-xs text-muted-foreground'>{t('settings.membership.memberSince', { date: formatDate(data.createdAt) })}</span>
            </span>
          </div>
          <div className='space-y-2 rounded-xl border border-border p-4'>
            <div className='flex items-center gap-3'>
              <span className='rounded-lg bg-primary/10 p-2 text-primary'>
                <Trophy className='h-5 w-5' aria-hidden />
              </span>
              <span>
                <span className='block font-semibold'>{t('settings.membership.level', { level: level.level, name: level.name })}</span>
                <span className='block text-xs text-muted-foreground'>{t('settings.membership.points', { count: data.points })}</span>
              </span>
            </div>
            <ProgressBar value={Math.max(0, Math.min(100, progress))} />
            <p className='text-xs text-muted-foreground'>
              {level.next
                ? t('settings.membership.toNext', { toGo: level.next.pointsToGo, level: level.next.level, name: level.next.name })
                : t('settings.membership.topLevel')}
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title={t('settings.membership.badges')}>
        {data.badges.length ? (
          <ul className='grid gap-3 sm:grid-cols-2'>
            {data.badges.map((badge) => (
              <li key={badge.id} className='flex items-center gap-3 rounded-xl border border-border p-3'>
                <span
                  role='img'
                  aria-hidden
                  className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg'
                  style={{ backgroundColor: `${badge.color}26` }}
                >
                  {badge.emoji}
                </span>
                <span className='min-w-0'>
                  <span className='block truncate text-sm font-semibold'>{badge.name}</span>
                  <span className='block truncate text-xs text-muted-foreground'>
                    {badge.description || t('settings.membership.earnedOn', { date: formatDate(badge.awardedAt) })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-muted-foreground'>{t('settings.membership.noBadges')}</p>
        )}
      </SettingsCard>

      <ReferralCard />

      <SettingsCard title={t('settings.membership.guide')}>
        <div className='flex flex-wrap items-center justify-between gap-3 text-sm'>
          <p className='text-muted-foreground'>
            {acceptedVersion && acceptedAt ? t('settings.membership.guideAccepted', { version: acceptedVersion, date: formatDate(acceptedAt) }) : null}
            {currentVersion > (acceptedVersion ?? 0) && <span className='ms-1 font-semibold text-amber-600 dark:text-amber-400'>{t('settings.membership.guideNew', { version: currentVersion })}</span>}
          </p>
          <Link href='/community/guide' className='inline-flex items-center gap-1.5 font-semibold text-primary hover:underline'>
            <BookOpen className='h-4 w-4' aria-hidden /> {t('settings.membership.readGuide')}
          </Link>
        </div>
      </SettingsCard>

      <SettingsCard title={t('settings.membership.privacy')}>
        <div className='space-y-5'>
          {PRIVACY.map((key) => (
            <Switch
              key={key}
              checked={data[key]}
              disabled={save.isPending}
              onChange={(value) => save.mutate({ [key]: value }, { onSuccess: () => showToast(t('settings.saved')), onError: (error) => showToast(error.message, 'error') })}
              label={t(`settings.membership.${key}`)}
              description={t(`settings.membership.${key}Hint`)}
            />
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

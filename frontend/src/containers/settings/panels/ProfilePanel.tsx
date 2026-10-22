'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Loader2, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { useToast } from '@/providers/Toast';
import { useT } from '@/i18n/provider';
import { checkUsername, ProfileInput, SettingsData, SOCIAL_PLATFORMS, SocialLink, uploadAvatar, useUpdateProfile } from '../api';
import { Field, PanelHeader, SettingsCard } from '../components';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const BIO_MAX = 300;

type UsernameState = 'idle' | 'checking' | 'free' | 'taken';

export function ProfilePanel({ data }: { data: SettingsData }) {
  const t = useT();
  const { showToast } = useToast();
  const save = useUpdateProfile();
  const initial = {
    name: data.name ?? '',
    username: data.username,
    bio: data.bio ?? '',
    niche: data.niche ?? '',
    socialLinks: data.socialLinks,
    avatarUrl: data.avatarUrl,
  };
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [usernameState, setUsernameState] = useState<UsernameState>('idle');
  const fileInput = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const update = (change: Partial<typeof form>) => setForm((current) => ({ ...current, ...change }));

  // Checks a new username while typing, once the member pauses
  useEffect(() => {
    if (form.username === data.username || !/^[a-z0-9_]{3,30}$/.test(form.username)) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setUsernameState('checking');
      const result = await checkUsername(form.username).catch(() => null);
      if (!cancelled) setUsernameState(result?.available ? 'free' : 'taken');
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.username, data.username]);

  const usernameUnchanged = form.username === data.username;
  const usernameValid = /^[a-z0-9_]{3,30}$/.test(form.username);
  const linksValid = form.socialLinks.every((link) => /^https?:\/\/\S+\.\S+/.test(link.url));
  const canSave = dirty && form.name.trim().length >= 2 && usernameValid && (usernameUnchanged || usernameState === 'free') && linksValid && !uploading;

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) return showToast(t('settings.profile.photoType'), 'error');
    if (file.size > MAX_PHOTO_BYTES) return showToast(t('settings.profile.photoTooBig'), 'error');
    setUploading(true);
    try {
      update({ avatarUrl: await uploadAvatar(file) });
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const handleSave = () => {
    const input: ProfileInput = {
      name: form.name.trim(),
      bio: form.bio.trim() || null,
      niche: form.niche.trim() || null,
      socialLinks: form.socialLinks.map((link) => ({ ...link, url: link.url.trim() })),
      avatarUrl: form.avatarUrl,
      ...(usernameUnchanged ? {} : { username: form.username }),
    };
    save.mutate(input, {
      onSuccess: () => showToast(t('settings.saved')),
      onError: (error) => showToast(error.message, 'error'),
    });
  };

  const setLink = (index: number, change: Partial<SocialLink>) =>
    update({ socialLinks: form.socialLinks.map((link, i) => (i === index ? { ...link, ...change } : link)) });
  const nextPlatform = SOCIAL_PLATFORMS.find((platform) => !form.socialLinks.some((link) => link.platform === platform)) ?? 'website';

  const avatar = form.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`;

  return (
    <div className='space-y-6'>
      <PanelHeader title={t('settings.profile.title')} description={t('settings.profile.description')} />

      <SettingsCard
        footer={
          <>
            {dirty && <span className='me-auto text-xs text-amber-600 dark:text-amber-400'>{t('settings.unsaved')}</span>}
            {dirty && (
              <Button variant='ghost' onClick={() => setForm(initial)}>
                {t('settings.discard')}
              </Button>
            )}
            <Button variant='primary' onClick={handleSave} disabled={!canSave || save.isPending}>
              {save.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : null}
              {save.isPending ? t('settings.saving') : t('settings.save')}
            </Button>
          </>
        }
      >
        {/* Photo */}
        <div className='flex flex-wrap items-center gap-5'>
          <div className='relative'>
            {/* eslint-disable-next-line @next/next/no-img-element -- avatars come from storage or Google */}
            <img src={avatar} alt={t('settings.profile.photo')} className='h-20 w-20 rounded-full border border-border object-cover' />
            {uploading && (
              <span className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50'>
                <Loader2 className='h-5 w-5 animate-spin text-white' />
              </span>
            )}
          </div>
          <div className='space-y-2'>
            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' size='sm' onClick={() => fileInput.current?.click()} disabled={uploading}>
                <Camera className='h-4 w-4' /> {uploading ? t('settings.profile.photoUploading') : t('settings.profile.changePhoto')}
              </Button>
              {form.avatarUrl && (
                <Button variant='ghost' size='sm' onClick={() => update({ avatarUrl: null })} disabled={uploading}>
                  <Trash2 className='h-4 w-4' /> {t('settings.profile.removePhoto')}
                </Button>
              )}
            </div>
            <p className='text-xs text-muted-foreground'>{t('settings.profile.photoHint')}</p>
            <input ref={fileInput} type='file' accept={PHOTO_TYPES.join(',')} className='hidden' onChange={(event) => pickPhoto(event.target.files?.[0])} />
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label={t('settings.profile.name')} htmlFor='profile-name'>
            <Input id='profile-name' value={form.name} maxLength={60} onChange={(event) => update({ name: event.target.value })} />
          </Field>
          <Field
            label={t('settings.profile.username')}
            htmlFor='profile-username'
            error={!usernameUnchanged && usernameState === 'taken' ? t('settings.profile.usernameTaken') : null}
            hint={
              !usernameUnchanged && usernameState === 'checking' ? (
                t('settings.profile.usernameChecking')
              ) : !usernameUnchanged && usernameState === 'free' ? (
                <span className='inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400'>
                  <Check className='h-3 w-3' /> {t('settings.profile.usernameFree')}
                </span>
              ) : (
                t('settings.profile.usernameHint', { username: form.username || '…' })
              )
            }
          >
            <Input
              id='profile-username'
              dir='ltr'
              value={form.username}
              maxLength={30}
              onChange={(event) => {
                setUsernameState('idle');
                update({ username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') });
              }}
            />
          </Field>
        </div>

        <Field label={t('settings.profile.bio')} htmlFor='profile-bio' hint={`${form.bio.length}/${BIO_MAX}`}>
          <Textarea
            id='profile-bio'
            value={form.bio}
            maxLength={BIO_MAX}
            rows={3}
            className='min-h-[90px]'
            placeholder={t('settings.profile.bioPlaceholder')}
            onChange={(event) => update({ bio: event.target.value })}
          />
        </Field>

        <Field label={t('settings.profile.niche')} htmlFor='profile-niche'>
          <Input id='profile-niche' value={form.niche} maxLength={60} placeholder={t('settings.profile.nichePlaceholder')} onChange={(event) => update({ niche: event.target.value })} />
        </Field>

        <Field label={t('settings.profile.links')} hint={t('settings.profile.linksHint')}>
          <div className='space-y-2'>
            {form.socialLinks.map((link, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div className='w-36 shrink-0'>
                  <Select
                    aria-label={t('settings.profile.links')}
                    value={link.platform}
                    onChange={(event) => setLink(index, { platform: event.target.value as SocialLink['platform'] })}
                    options={SOCIAL_PLATFORMS.map((platform) => ({ value: platform, label: t(`settings.profile.platforms.${platform}`) }))}
                  />
                </div>
                <Input dir='ltr' value={link.url} placeholder={t('settings.profile.linkPlaceholder')} onChange={(event) => setLink(index, { url: event.target.value })} />
                <button
                  type='button'
                  aria-label={t('settings.profile.removeLink')}
                  onClick={() => update({ socialLinks: form.socialLinks.filter((_, i) => i !== index) })}
                  className='rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ))}
            {form.socialLinks.length < SOCIAL_PLATFORMS.length && (
              <Button variant='ghost' size='sm' onClick={() => update({ socialLinks: [...form.socialLinks, { platform: nextPlatform, url: '' }] })}>
                <Plus className='h-4 w-4' /> {t('settings.profile.addLink')}
              </Button>
            )}
          </div>
        </Field>
      </SettingsCard>
    </div>
  );
}

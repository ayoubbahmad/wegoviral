'use client';

import { SettingsNav } from '@/containers/settings/SettingsNav';
import { SettingsPanel } from '@/containers/settings/SettingsPanel';

/** Phones get the menu to tap into; wider screens open on the profile panel. */
export default function SettingsPage() {
  return (
    <>
      <SettingsNav variant='list' className='md:hidden' />
      <div className='hidden md:block'>
        <SettingsPanel section='profile' />
      </div>
    </>
  );
}

'use client';

import { useT } from './provider';
import type { MessageKey } from './messages';
import type { Vars } from './types';

/** A translated string, for components that can render on the server (where hooks can't run). */
export function T({ k, vars }: { k: MessageKey; vars?: Vars }) {
  return <>{useT()(k, vars)}</>;
}

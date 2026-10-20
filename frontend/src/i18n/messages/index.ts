import type { Paths, Shape } from '../types';
import { common as enCommon } from './en/common';
import { nav as enNav } from './en/nav';
import { feed as enFeed } from './en/feed';
import { members as enMembers } from './en/members';
import { common as frCommon } from './fr/common';
import { nav as frNav } from './fr/nav';
import { feed as frFeed } from './fr/feed';
import { members as frMembers } from './fr/members';
import { common as arCommon } from './ar/common';
import { nav as arNav } from './ar/nav';
import { feed as arFeed } from './ar/feed';
import { members as arMembers } from './ar/members';

const en = { common: enCommon, nav: enNav, feed: enFeed, members: enMembers };

export type Messages = Shape<typeof en>;
export type MessageKey = Paths<typeof en>;

const fr: Messages = { common: frCommon, nav: frNav, feed: frFeed, members: frMembers };
const ar: Messages = { common: arCommon, nav: arNav, feed: arFeed, members: arMembers };

export const messages = { en: en as Messages, fr, ar };

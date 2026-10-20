import type { Paths, Shape } from '../types';
import { common as enCommon } from './en/common';
import { nav as enNav } from './en/nav';
import { challenges as enChallenges } from './en/challenges';
import { courses as enCourses } from './en/courses';
import { events as enEvents } from './en/events';
import { feed as enFeed } from './en/feed';
import { leaderboard as enLeaderboard } from './en/leaderboard';
import { members as enMembers } from './en/members';
import { common as frCommon } from './fr/common';
import { nav as frNav } from './fr/nav';
import { challenges as frChallenges } from './fr/challenges';
import { courses as frCourses } from './fr/courses';
import { events as frEvents } from './fr/events';
import { feed as frFeed } from './fr/feed';
import { leaderboard as frLeaderboard } from './fr/leaderboard';
import { members as frMembers } from './fr/members';
import { common as arCommon } from './ar/common';
import { nav as arNav } from './ar/nav';
import { challenges as arChallenges } from './ar/challenges';
import { courses as arCourses } from './ar/courses';
import { events as arEvents } from './ar/events';
import { feed as arFeed } from './ar/feed';
import { leaderboard as arLeaderboard } from './ar/leaderboard';
import { members as arMembers } from './ar/members';

const en = { common: enCommon, nav: enNav, challenges: enChallenges, courses: enCourses, events: enEvents, feed: enFeed, leaderboard: enLeaderboard, members: enMembers };

export type Messages = Shape<typeof en>;
export type MessageKey = Paths<typeof en>;

const fr: Messages = { common: frCommon, nav: frNav, challenges: frChallenges, courses: frCourses, events: frEvents, feed: frFeed, leaderboard: frLeaderboard, members: frMembers };
const ar: Messages = { common: arCommon, nav: arNav, challenges: arChallenges, courses: arCourses, events: arEvents, feed: arFeed, leaderboard: arLeaderboard, members: arMembers };

export const messages = { en: en as Messages, fr, ar };

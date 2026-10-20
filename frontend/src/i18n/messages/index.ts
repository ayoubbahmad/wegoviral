import type { Paths, Shape } from '../types';
import { common as enCommon } from './en/common';
import { nav as enNav } from './en/nav';
import { auth as enAuth } from './en/auth';
import { challenges as enChallenges } from './en/challenges';
import { courses as enCourses } from './en/courses';
import { events as enEvents } from './en/events';
import { feed as enFeed } from './en/feed';
import { help as enHelp } from './en/help';
import { leaderboard as enLeaderboard } from './en/leaderboard';
import { members as enMembers } from './en/members';
import { onboarding as enOnboarding } from './en/onboarding';
import { settings as enSettings } from './en/settings';
import { common as frCommon } from './fr/common';
import { nav as frNav } from './fr/nav';
import { auth as frAuth } from './fr/auth';
import { challenges as frChallenges } from './fr/challenges';
import { courses as frCourses } from './fr/courses';
import { events as frEvents } from './fr/events';
import { feed as frFeed } from './fr/feed';
import { help as frHelp } from './fr/help';
import { leaderboard as frLeaderboard } from './fr/leaderboard';
import { members as frMembers } from './fr/members';
import { onboarding as frOnboarding } from './fr/onboarding';
import { settings as frSettings } from './fr/settings';
import { common as arCommon } from './ar/common';
import { nav as arNav } from './ar/nav';
import { auth as arAuth } from './ar/auth';
import { challenges as arChallenges } from './ar/challenges';
import { courses as arCourses } from './ar/courses';
import { events as arEvents } from './ar/events';
import { feed as arFeed } from './ar/feed';
import { help as arHelp } from './ar/help';
import { leaderboard as arLeaderboard } from './ar/leaderboard';
import { members as arMembers } from './ar/members';
import { onboarding as arOnboarding } from './ar/onboarding';
import { settings as arSettings } from './ar/settings';

const en = { common: enCommon, nav: enNav, auth: enAuth, challenges: enChallenges, courses: enCourses, events: enEvents, feed: enFeed, help: enHelp, leaderboard: enLeaderboard, members: enMembers, onboarding: enOnboarding, settings: enSettings };

export type Messages = Shape<typeof en>;
export type MessageKey = Paths<typeof en>;

const fr: Messages = { common: frCommon, nav: frNav, auth: frAuth, challenges: frChallenges, courses: frCourses, events: frEvents, feed: frFeed, help: frHelp, leaderboard: frLeaderboard, members: frMembers, onboarding: frOnboarding, settings: frSettings };
const ar: Messages = { common: arCommon, nav: arNav, auth: arAuth, challenges: arChallenges, courses: arCourses, events: arEvents, feed: arFeed, help: arHelp, leaderboard: arLeaderboard, members: arMembers, onboarding: arOnboarding, settings: arSettings };

export const messages = { en: en as Messages, fr, ar };

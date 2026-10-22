import type { Shape } from '../../types';
import type { points as en } from '../en/points';

export const points: Shape<typeof en> = {
  actions: {
    POST_PUBLISHED: 'Publier une publication',
    COMMENT_ADDED: 'Commenter',
    LIKE_RECEIVED: 'Recevoir un j’aime sur sa publication',
    EVENT_JOINED: 'S’inscrire à un événement',
    POST_REVIEWED: 'Relire la publication d’un nouveau membre',
    GUIDE_ACCEPTED: 'Accepter le guide de la communauté',
    LESSON_COMPLETED: 'Terminer une leçon',
    COURSE_COMPLETED: 'Terminer une formation',
    CHALLENGE_CHECKIN: 'Pointer dans un défi',
    CHALLENGE_COMPLETED: 'Terminer un défi',
    CHALLENGE_WON: 'Gagner un défi',
    POST_REMOVED_BY_TEAM: 'Voir sa publication retirée par l’équipe',
    VOUCHED_POST_REMOVED: 'Une publication que vous avez validée est retirée',
    WARNING_RECEIVED: 'Recevoir un avertissement',
    MANUAL: 'Ajusté par l’équipe',
  },
  autoTypes: {
    POSTS: { one: '{count} publication', other: '{count} publications' },
    COMMENTS: { one: '{count} commentaire écrit', other: '{count} commentaires écrits' },
    LIKES_RECEIVED: { one: '{count} j’aime reçu', other: '{count} j’aime reçus' },
    EVENTS_JOINED: { one: '{count} événement rejoint', other: '{count} événements rejoints' },
    COURSES_COMPLETED: { one: '{count} formation terminée', other: '{count} formations terminées' },
    CHALLENGES_COMPLETED: { one: '{count} défi terminé', other: '{count} défis terminés' },
    CHALLENGES_WON: { one: '{count} défi gagné', other: '{count} défis gagnés' },
    POINTS: { one: '{count} point au total', other: '{count} points au total' },
  },
  autoTypeNames: {
    POSTS: 'publications',
    COMMENTS: 'commentaires écrits',
    LIKES_RECEIVED: 'j’aime reçus',
    EVENTS_JOINED: 'événements rejoints',
    COURSES_COMPLETED: 'formations terminées',
    CHALLENGES_COMPLETED: 'défis terminés',
    CHALLENGES_WON: 'défis gagnés',
    POINTS: 'points au total',
  },
  givenByTeam: 'Donné par l’équipe',
};

import type { Shape } from '../../types';
import type { leaderboard as en } from '../en/leaderboard';

export const leaderboard: Shape<typeof en> = {
  title: 'Classement',
  description: 'Gagnez des points en publiant, en commentant et en participant. Montez de niveau pour débloquer davantage de la communauté.',
  howPoints: 'Comment fonctionnent les points ?',
  periods: { '7d': '7 derniers jours', '30d': '30 derniers jours', all: 'Depuis le début' },
  period: 'Période',
  emptyTitle: 'Pas encore de points',
  emptyBody: 'Soyez le premier : publiez ou inscrivez-vous à un événement pour apparaître au classement.',
  levelChip: 'Niv. {level} · {name}',
  levelLine: 'Niveau {level} · {name}',
  progressNext: '{points} points · encore {toGo} pour atteindre le niveau {level} ({name})',
  progressTop: '{points} points · vous avez atteint le niveau maximum',
  myRank: 'Vous êtes n° {rank} avec {points} points sur cette période.',
  notRanked: 'Gagnez des points sur cette période pour apparaître au classement.',
  levels: 'Niveaux',
  pts: '{count} pts',
  rank: 'Rang {rank}',
  dialogTitle: 'Comment fonctionnent les points',
  earning: 'Gagner des points',
  upToPerDay: 'jusqu’à {count}/jour',
  earningNote: 'Supprimer une publication ou un commentaire, ou retirer un j’aime, retire aussi ses points. Les périodes du classement comptent les points gagnés sur cette durée.',
  levelsNote: 'Votre niveau dépend de votre total de points. Certains espaces et événements s’ouvrent à partir d’un niveau.',
  badges: 'Badges',
};

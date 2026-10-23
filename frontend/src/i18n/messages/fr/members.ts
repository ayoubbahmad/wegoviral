import type { Shape } from '../../types';
import type { members as en } from '../en/members';

export const members: Shape<typeof en> = {
  title: 'Membres',
  description: 'Les créateurs de la communauté. Trouvez des personnes de votre niche pour apprendre et collaborer.',
  search: 'Rechercher par nom, nom d’utilisateur ou niche…',
  sort: 'Trier',
  sorts: { recent: 'Les plus récents', points: 'Le plus de points', name: 'Nom' },
  count: { one: '{count} membre', other: '{count} membres' },
  emptyTitle: 'Aucun membre trouvé',
  emptyBody: 'Essayez un autre nom ou une autre niche.',
  previous: 'Précédent',
  next: 'Suivant',
  pageOf: 'Page {page} sur {pages}',
  level: 'Niveau {level} · {name}',
  profile: {
    notFoundTitle: 'Membre introuvable',
    notFoundBody: 'Ce membre n’existe pas, ou ne fait plus partie de la communauté.',
    back: 'Tous les membres',
    editProfile: 'Modifier votre profil',
    joined: 'Membre depuis le {date}',
    points: { one: '{count} point', other: '{count} points' },
    posts: { one: '{count} publication', other: '{count} publications' },
    comments: { one: '{count} commentaire', other: '{count} commentaires' },
    badges: 'Badges',
    noBio: 'Pas encore de bio.',
    recentPosts: 'Publications',
    noPosts: 'Pas encore de publication.',
    noPostsSelf: 'Vous n’avez encore rien publié. Partagez une victoire ou posez une question dans le fil.',
    loadMore: 'Voir plus',
    openLink: 'Ouvrir {platform}',
  },
};

import type { Shape } from '../../types';
import type { help as en } from '../en/help';

export const help: Shape<typeof en> = {
  titles: {
    community: { title: 'Aide de la communauté', description: 'Comment fonctionne la communauté : inscription, publications, événements, formations, défis et points.' },
    creator: { title: 'Aide de l’Espace créateur', description: 'Comment utiliser vos outils personnels de créateur.' },
    admin: { title: 'Guides de l’équipe', description: 'Comment animer la communauté, pour chaque rôle de l’équipe.' },
  },
  search: 'Rechercher dans les articles d’aide',
  nothingFound: 'Aucun résultat pour « {query} »',
  tryAnother: 'Essayez un autre mot.',
  noArticles: 'Pas encore d’article ici',
  audience: '{role}s',
  forRole: ' · pour les {role}s et plus',
  draft: ' · brouillon',
  notFoundTitle: 'Article introuvable',
  notFoundBody: 'Il a peut-être été déplacé, ou il ne concerne pas votre rôle.',
  updated: 'Mis à jour le {date}',
  editArticle: 'Modifier cet article',
  moreIn: 'Aussi dans {section}',
};

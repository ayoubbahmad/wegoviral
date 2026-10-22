import type { Shape } from '../../types';
import type { landing as en } from '../en/landing';

export const landing: Shape<typeof en> = {
  nav: { features: 'Fonctionnalités', join: 'Comment rejoindre' },
  logIn: 'Se connecter',
  join: 'Rejoindre',
  eyebrow: 'La communauté des créateurs de contenu',
  titleStart: 'Grandissez plus vite,',
  titleHighlight: 'ensemble.',
  intro: 'WeGoViral réunit des créateurs pour partager leurs victoires, recevoir des retours honnêtes, apprendre avec des sessions en direct et des formations, et se motiver avec des défis. Avec en plus des outils personnels pour planifier et écrire votre contenu.',
  apply: 'Demander à rejoindre',
  seeFeatures: 'Découvrir',
  featuresTitle: 'Tout au même endroit',
  featuresBody: 'Une communauté pensée pour les créateurs qui prennent leur croissance au sérieux.',
  features: {
    community: { title: 'Une vraie communauté', body: 'Publiez dans des espaces par thème, partagez vos victoires et posez vos questions. Chaque membre est un créateur validé.' },
    events: { title: 'Événements en direct', body: 'Ateliers, questions-réponses et rencontres, à l’heure de votre fuseau, avec les enregistrements ensuite.' },
    courses: { title: 'Formations', body: 'Des formations pas à pas par les formateurs de la communauté, avec des ressources à télécharger.' },
    challenges: { title: 'Défis', body: 'Pointez chaque jour, gardez votre série et gagnez des prix avec d’autres créateurs.' },
    points: { title: 'Points et niveaux', body: 'Gagnez des points en participant, montez au classement et collectionnez les badges.' },
    tools: { title: 'Outils de créateur', body: 'Écrivez des scripts à partir de hooks qui marchent, organisez vos projets et suivez vos chiffres.' },
  },
  joinTitle: 'Comment rejoindre',
  joinBody: 'Quelques étapes courtes, pour que chaque personne ici soit un créateur qui connaît les règles de la maison.',
  steps: {
    apply: { title: 'Faites votre demande', body: 'Dites-nous qui vous êtes, ce que vous créez et où. L’équipe examine chaque demande.' },
    guide: { title: 'Lisez le guide', body: 'Acceptez le guide de la communauté : notre façon de travailler ensemble.' },
    post: { title: 'Dites bonjour', body: 'Présentez-vous et commencez à publier. Invité par un membre ? Vous entrez tout de suite.' },
  },
  ctaTitle: 'Prêt à grandir avec d’autres créateurs ?',
  ctaPoints: { feedback: 'Des retours honnêtes sur vos hooks et vos vidéos', learn: 'Des sessions en direct et des formations chaque mois', friends: 'Des créateurs avec qui collaborer' },
  rights: '© {year} WeGoViral. Tous droits réservés.',
};

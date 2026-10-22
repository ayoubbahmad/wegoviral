/** French version of the starter help articles (prisma/help-articles.ts), by slug. */
export interface ArticleTranslation {
  category: string;
  title: string;
  summary: string;
  body: string;
}

export const HELP_ARTICLES_FR: Record<string, ArticleTranslation> = {
  // ─── Community: getting started ────────────────────────────────────────────
  'joining-wegoviral': {
    category: 'Bien démarrer',
    title: 'Comment se passe l’inscription',
    summary: 'Du formulaire d’inscription au statut de membre : validation, guide et premières publications.',
    body: `Rejoindre WeGoViral se fait en quelques étapes courtes, pour que chaque personne ici soit un vrai créateur qui connaît les règles de la maison.

## Les étapes
1. **Formulaire d’inscription** : votre nom, votre numéro de téléphone, ce que vous créez et où. Seule l’équipe voit votre téléphone et votre e-mail.
2. **Validation** : l’équipe examine votre demande. En attendant, vous pouvez déjà lire le guide de la communauté.
3. **Guide de la communauté** : lisez-le et cochez « J’ai lu et j’accepte ». Quand le guide change, on vous demande d’accepter la nouvelle version.
4. **Quiz** (seulement si l’équipe l’a activé) : quelques questions sur le guide. Vous pouvez réessayer.
5. **Vos premières publications** : vos premières publications sont vérifiées avant d’être visibles. Voir [Vos premières publications](/community/help/your-first-posts).

## Invité par un ami ?
Si quelqu’un de la communauté vous a envoyé son lien d’invitation, vous êtes accepté tout de suite. Cette personne est notée comme celle qui vous a invité.

## Membres spéciaux
Les invités, formateurs et partenaires peuvent être marqués comme membres spéciaux par l’équipe. Ils passent la validation, le guide et la vérification des premières publications.`,
  },
  'community-guide': {
    category: 'Bien démarrer',
    title: 'Le guide de la communauté',
    summary: 'Pourquoi vous l’acceptez, et ce qui se passe quand il change.',
    body: `Le guide de la communauté, ce sont nos règles de la maison et notre façon de travailler ensemble. Votre acceptation est enregistrée avec la version et la date.

- Vous pouvez le lire pendant que votre demande attend d’être validée.
- Tant que vous ne l’avez pas accepté, vous pouvez lire la communauté mais pas publier, commenter ni réagir.
- Quand l’équipe publie une nouvelle version, tout le monde doit l’accepter à nouveau. Rien d’autre ne change entre-temps.`,
  },
  'your-first-posts': {
    category: 'Bien démarrer',
    title: 'Vos premières publications sont relues',
    summary: 'Pourquoi vos premières publications attendent une vérification rapide, et ce que vous voyez en attendant.',
    body: `Pour garder un fil d’actualité de qualité, les premières publications (en général 3) de chaque nouveau membre sont vérifiées avant d’apparaître.

- Votre publication affiche **En attente de relecture** en haut de votre fil. Vous seul la voyez.
- Une fois acceptée, elle est mise en ligne en haut du fil.
- Si elle n’est pas acceptée, vous voyez la note de la personne qui l’a relue pour savoir quoi changer.
- Après assez de publications acceptées, vos publications sont en ligne tout de suite.

Les relectures sont faites par l’équipe et par des membres de confiance : des personnes qui ont terminé leur propre relecture, sont là depuis plus de 30 jours et n’ont pas de restriction.`,
  },
  'invite-creators': {
    category: 'Bien démarrer',
    title: 'Inviter d’autres créateurs',
    summary: 'Votre lien d’invitation personnel, et ce que veut dire se porter garant.',
    body: `Chaque membre accepté a un lien d’invitation personnel dans la carte **Inviter des créateurs** du fil d’actualité.

- Les personnes qui s’inscrivent avec votre lien sont **acceptées automatiquement**.
- Vous apparaissez comme la personne qui les a invitées : invitez des créateurs dont vous vous portez garant.
- La carte indique combien de personnes vous ont rejoint grâce à vous.`,
  },

  // ─── Community: posting ────────────────────────────────────────────────────
  'posting-and-spaces': {
    category: 'Publier',
    title: 'Publier et les espaces',
    summary: 'Rédigez une publication avec une couverture, des images ou un sondage, dans le bon espace.',
    body: `Cliquez sur **Créer une publication** dans le fil d’actualité pour partager une victoire, poser une question ou lancer une discussion.

## Ce qu’une publication peut contenir
- Un titre et un texte
- Une image de couverture et jusqu’à 8 images (5 Mo chacune)
- Un sondage à plusieurs options

## Les espaces
Chaque publication est rangée dans un espace (Victoires, Questions, Présentez-vous…). Utilisez les pastilles sous l’en-tête du fil pour n’afficher qu’un espace. Certains espaces sont réservés à l’équipe, et d’autres s’ouvrent à partir d’un niveau, d’une offre ou après quelques jours dans la communauté : ils affichent un cadenas et la raison.

## Modifier et supprimer
Vous pouvez modifier ou supprimer vos propres publications et commentaires. Quand l’équipe modifie une publication, elle est marquée « modifiée par l’équipe ».`,
  },
  'likes-comments-polls': {
    category: 'Publier',
    title: 'J’aime, commentaires et sondages',
    summary: 'Comment réagir, répondre et voter.',
    body: `- **Aimez** une publication avec le cœur. Les j’aime reçus sur vos publications vous rapportent des points (pas les vôtres).
- **Commentez** sous n’importe quelle publication. Certains mots font que votre commentaire est retenu pour vérification par l’équipe avant d’apparaître.
- **Votez** une seule fois dans les sondages ; les résultats s’affichent après votre vote.
- **Enregistrez** des publications avec le signet pour les retrouver plus tard.`,
  },
  'reporting-content': {
    category: 'Publier',
    title: 'Signaler une publication ou un commentaire',
    summary: 'Signalez le spam, le harcèlement et tout ce qui va contre le guide.',
    body: `Ouvrez le menu **…** d’une publication ou d’un commentaire et choisissez **Signaler**. Choisissez une raison (spam, harcèlement, haine, contenu pour adultes, désinformation, autopromotion ou autre) et ajoutez une note si cela aide.

- Vous pouvez signaler chaque élément une seule fois, et pas votre propre contenu.
- L’équipe voit les signalements regroupés par publication et décide quoi faire. L’auteur ne sait pas qui l’a signalé.
- Même les membres en sourdine peuvent signaler.`,
  },
  'warnings-and-restrictions': {
    category: 'Publier',
    title: 'Avertissements, sourdines et suspensions',
    summary: 'Ce que chacun veut dire et combien de temps il dure.',
    body: `Quand quelque chose va contre le guide, l’équipe peut :

- Vous **avertir** : vous verrez le message une fois, la prochaine fois que vous ouvrez l’application.
- Vous **mettre en sourdine** : vous pouvez tout lire mais pas publier, commenter ni réagir, jusqu’à la date indiquée.
- Vous **suspendre** : vous ne pouvez pas utiliser la communauté jusqu’à la date indiquée.
- Vous **bannir** : votre accès est retiré.

La raison et la date de fin vous sont toujours indiquées. Les restrictions se terminent d’elles-mêmes à cette date.`,
  },

  // ─── Community: learning & events ──────────────────────────────────────────
  events: {
    category: 'Événements, formations et défis',
    title: 'Les événements',
    summary: 'Trouvez les sessions en direct, inscrivez-vous et ajoutez-les à votre agenda.',
    body: `Communauté → **Événements** liste les sessions en direct, ateliers et rencontres. Passez des **cartes** au **calendrier** en haut à droite, et filtrez par catégorie.

- Cliquez sur **Je participe** pour vous inscrire. Le lien du direct apparaît une fois inscrit.
- Ajoutez-le à **Google Agenda** ou téléchargez un fichier **.ics**.
- Les horaires sont affichés dans votre fuseau horaire.
- Après l’événement, un bouton **Voir l’enregistrement** peut apparaître.
- Certains événements ont un nombre de places limité, ou s’ouvrent à partir d’un niveau ou d’une offre.`,
  },
  courses: {
    category: 'Événements, formations et défis',
    title: 'Suivre une formation',
    summary: 'Commencez une formation, suivez votre progression et gagnez votre badge de diplômé.',
    body: `Communauté → **Formations** réunit les formations et méthodes des formateurs de la communauté.

- Ouvrez une formation et cliquez sur **Commencer la formation**. Vous trouverez toujours **Reprendre là où vous en étiez** en haut de la page Formations.
- Regardez la vidéo ou lisez la leçon, téléchargez les ressources, puis cliquez sur **Terminer et continuer**.
- Certains modules s’ouvrent quelques jours après votre début (le sommaire indique quand).
- Chaque leçon vous rapporte des points ; terminer la formation en rapporte davantage, avec le badge **Diplômé**.
- Les formations verrouillées indiquent ce qu’il faut pour les ouvrir, par exemple un niveau.`,
  },
  challenges: {
    category: 'Événements, formations et défis',
    title: 'Défis, pointages et séries',
    summary: 'Rejoignez un défi, pointez chaque jour et gardez votre série en vie.',
    body: `Communauté → **Défis** liste ce qui se passe maintenant, ce qui arrive bientôt et les défis passés.

## Participer
1. Ouvrez un défi et cliquez sur **Rejoindre le défi**.
2. Chaque jour, **pointez** avec ce que vous avez fait, plus une image ou un lien si vous voulez. Les défis ponctuels demandent une seule participation.
3. Votre **série** grandit à chaque jour d’affilée. Si vous manquez un jour, elle repart de zéro (votre meilleure série est gardée).

Les jours suivent le fuseau horaire du défi, indiqué en bas du défi.

## Terminer et gagner
- Atteignez le nombre de pointages indiqué pour **terminer** : vous gagnez des points et le badge Défi relevé.
- À la fin, l’équipe choisit les **gagnants** (souvent le haut du classement du défi). Les gagnants reçoivent des points en plus et le badge Vainqueur de défi.`,
  },

  // ─── Community: points ─────────────────────────────────────────────────────
  'points-levels-badges': {
    category: 'Points et badges',
    title: 'Points, niveaux et badges',
    summary: 'Comment gagner des points, ce que les niveaux débloquent et comment obtenir des badges.',
    body: `Vous gagnez des points en participant : publier, commenter, recevoir des j’aime, participer à des événements, terminer des leçons et pointer dans les défis. Certaines actions ont une limite par jour, et annuler une action (supprimer une publication, retirer un j’aime) retire aussi ses points.

Les chiffres exacts sont dans **Classement → Comment fonctionnent les points ?**

## Niveaux
Votre niveau dépend de votre total de points, de Débutant jusqu’à Légende. Certains espaces, événements, formations et défis s’ouvrent à partir d’un niveau, et indiquent combien de points il vous manque.

## Badges
Vos trois derniers badges s’affichent à côté de votre nom. Certains arrivent automatiquement (première publication, diplômé, défi relevé…), d’autres sont donnés par l’équipe (comme Ambassadeur ou Membre du mois).`,
  },
  leaderboard: {
    category: 'Points et badges',
    title: 'Le classement',
    summary: '7 derniers jours, 30 derniers jours et depuis le début.',
    body: `Communauté → **Classement** range les membres selon les points gagnés sur les 7 derniers jours, les 30 derniers jours ou depuis le début. Votre carte sur le côté montre votre niveau, votre progression vers le suivant et votre rang sur la période.

Les membres qui ont autant de points partagent le même rang.`,
  },

  // ─── Community: instructors ────────────────────────────────────────────────
  'creating-a-course': {
    category: 'Pour les formateurs',
    title: 'Créer une formation',
    summary: 'Construisez des modules et des leçons, ajoutez des ressources, ouvrez les modules au fil du temps et publiez.',
    body: `Allez dans Communauté → **Formations** → **Nouvelle formation**. Elle commence en brouillon, visible seulement par vous et les admins.

## Onglet Contenu
- Ajoutez des **modules** (chapitres), puis des **leçons** dans chacun.
- Une leçon est une **vidéo** (YouTube, Vimeo, Loom ou lien vers un fichier vidéo) ou un **texte**, avec des notes et des ressources (fichiers jusqu’à 50 Mo, ou liens). Les fichiers restent privés, réservés aux membres qui peuvent ouvrir la formation.
- **Faites glisser** les modules et les leçons pour les réordonner, y compris d’un module à l’autre.
- Réglez **S’ouvre … jours après le début du membre** sur un module pour l’ouvrir au fil du temps.

## Détails et accès
Titre, description, couverture, un badge facultatif pour la fin de la formation, et qui peut la suivre (niveau, jours dans la communauté ; les offres sont réglées par les Super Admins).

## Publier
Passez le statut sur **Publiée** (une formation doit avoir au moins une leçon). **Archivée** la retire du catalogue mais la garde pour les membres qui l’ont commencée.

## Statistiques
L’onglet **Statistiques** montre qui a commencé et terminé, le taux de réussite et combien de membres ont terminé chaque leçon.`,
  },
  'hosting-events': {
    category: 'Pour les formateurs',
    title: 'Organiser un événement',
    summary: 'Créez, publiez et animez un événement, et voyez qui vient.',
    body: `Cliquez sur **Nouvel événement** dans la page Événements.

- Saisissez les horaires dans votre propre fuseau horaire : les membres les voient dans le leur.
- Ajoutez le lien du direct : il n’est montré qu’aux membres inscrits.
- Fixez un nombre de places s’il est limité, et qui peut participer.
- Enregistrez en brouillon, puis **publiez** quand c’est prêt.
- Depuis l’événement, consultez les **participants** et exportez-les en CSV.
- Après l’événement, ajoutez le **lien de l’enregistrement**.`,
  },

  // ─── Creator Space ─────────────────────────────────────────────────────────
  'creator-space': {
    category: 'Bien démarrer',
    title: 'Qu’est-ce que l’Espace créateur ?',
    summary: 'Vos outils personnels pour planifier, écrire et suivre votre contenu.',
    body: `L’Espace créateur est rien qu’à vous : rien ici n’est partagé avec la communauté. Passez-y depuis le menu du logo, en haut de la barre latérale.

Il réunit des outils pour planifier votre contenu, écrire des scripts, organiser des projets et suivre vos chiffres. Certains outils sont encore en cours de connexion à vos réseaux sociaux ; d’ici là, ils affichent des données d’exemple.`,
  },
  'scripts-and-projects': {
    category: 'Outils',
    title: 'Scripts et projets',
    summary: 'Écrivez des scripts à partir de hooks et de modèles, et regroupez votre travail en projets.',
    body: `- **Scripts** : écrivez des scripts vidéo, en partant des hooks et des modèles de la **Bibliothèque**.
- **Projets** : regroupez vidéos et scripts pour une campagne ou une série, et suivez où en est chaque élément.
- **Bibliothèque** : vos hooks et modèles de scripts enregistrés, à réutiliser.`,
  },
  'performance-and-followers': {
    category: 'Outils',
    title: 'Performances, abonnés et concurrents',
    summary: 'Suivez les résultats de votre contenu et ce que publient les autres dans votre niche.',
    body: `- **Performances** : vues et engagement par publication, et vos meilleurs moments pour publier.
- **Abonnés** : l’évolution de votre audience.
- **Concurrents** : gardez un œil sur les créateurs de votre niche.
- **Automatisations** : les automatisations Instagram et Facebook arrivent ; les écrans montrent ce qu’elles feront.

Connectez vos comptes dans **Paramètres** au fur et à mesure qu’ils deviennent disponibles.`,
  },

  // ─── Admin: everyone on the team ───────────────────────────────────────────
  'admin-space': {
    category: 'Bien démarrer',
    title: 'L’espace Admin et les rôles de l’équipe',
    summary: 'Ce que chaque rôle peut faire, et où trouver chaque chose.',
    body: `L’espace Admin est réservé à l’équipe. Ouvrez-le depuis le menu du logo. Vous ne voyez que les pages que votre rôle permet.

## Rôles
- **Modérateur** : traite les signalements et le contenu retenu, valide les nouveaux membres, met en sourdine ou suspend jusqu’à 7 jours, anime les défis, voit les membres, les statistiques et le journal d’activité.
- **Formateur** : crée des formations et des événements, et gère les siens.
- **Admin** : tout ce que font les modérateurs, plus les bannissements, les rôles (jusqu’à modérateur), les espaces, l’intégration, les liens d’invitation, les points et badges, et le centre d’aide.
- **Super Admin** : tout, y compris nommer des admins et décider ce que chaque offre débloque.

Vous ne pouvez agir que sur les membres d’un rang inférieur au vôtre, et personne ne peut changer son propre rôle.

## Vue d’ensemble
La **Vue d’ensemble** montre ce qui demande de l’attention : validations en attente, publications à relire, signalements ouverts et contenu retenu.`,
  },
  'approving-members': {
    category: 'Membres',
    title: 'Valider les nouveaux membres',
    summary: 'Lisez les réponses d’inscription et acceptez ou refusez les demandes.',
    body: `Admin → **Validations** liste les personnes en attente, avec leurs réponses d’inscription (niche, plateformes, nombre d’abonnés), la personne qui les a invitées et leurs coordonnées.

- **Validez** pour les faire entrer, ou **refusez** avec un message facultatif qu’elles verront.
- Chaque décision est enregistrée dans le journal d’activité.
- Les personnes inscrites avec le lien d’invitation d’un membre sont acceptées automatiquement. Les liens d’invitation de l’équipe peuvent aussi accepter automatiquement.`,
  },
  'member-panel': {
    category: 'Membres',
    title: 'La fiche membre',
    summary: 'Tout sur un membre, et les actions possibles.',
    body: `Cliquez sur un membre dans Admin → **Membres** pour ouvrir sa fiche : compteurs d’activité, statut d’inscription (version du guide acceptée, période d’essai, qui l’a invité), points et badges, et son historique.

Selon votre rôle, vous pouvez changer son rôle, le marquer comme membre spécial, l’avertir, le mettre en sourdine, le suspendre ou le bannir, changer son offre, lui donner des badges et ajuster ses points.`,
  },
  'restricting-members': {
    category: 'Membres',
    title: 'Avertir, mettre en sourdine et suspendre',
    summary: 'Choisissez l’étape la plus légère qui suffit, avec une raison claire.',
    body: `Depuis la fiche membre :

1. **Avertissez** d’abord : le membre voit votre message une fois.
2. **Mettez en sourdine** si cela continue : il peut encore lire, mais pas publier ni réagir.
3. **Suspendez** pour les problèmes graves ou répétés : il ne peut pas utiliser la communauté.
4. **Bannissez** (admins seulement) quand quelqu’un ne doit pas revenir.

Les modérateurs peuvent mettre en sourdine ou suspendre jusqu’à **7 jours** ; les admins peuvent choisir n’importe quelle durée ou aucune date de fin. Écrivez toujours la raison : le membre la voit, et elle est gardée dans le journal.`,
  },
  'handling-reports': {
    category: 'Modération',
    title: 'Traiter les signalements et le contenu retenu',
    summary: 'Classer, retirer et agir sur l’auteur en une seule étape.',
    body: `Admin → **Modération** regroupe les signalements ouverts par publication ou commentaire, avec chaque raison et chaque note.

- **Classez** si tout va bien : les signalements sont fermés et le contenu reste.
- **Retirez** le contenu, et si besoin avertissez, mettez en sourdine ou suspendez l’auteur en même temps.
- **Retenus par le filtre** montre les publications et commentaires bloqués par le filtre de mots : libérez-les ou retirez-les.
- **Supprimés récemment** permet de restaurer ce qui a été retiré par erreur.
- L’onglet **Filtre de mots** est l’endroit où les admins gèrent les mots signalés.

Tout est enregistré dans le journal d’activité.`,
  },
  'reviewing-posts': {
    category: 'Modération',
    title: 'Relire les publications des nouveaux membres',
    summary: 'Acceptez ou refusez les premières publications, avec une note pour l’auteur.',
    body: `Communauté → **Relire les publications** liste les publications des nouveaux membres qui attendent une vérification, les plus anciennes d’abord.

- **Acceptez** pour mettre la publication en ligne en haut du fil.
- **Refusez** avec une note courte et bienveillante : l’auteur la voit et peut réessayer.
- Votre nom est enregistré avec la publication. Si une publication que vous avez acceptée est retirée plus tard, cela apparaît dans votre historique.

Les membres de confiance peuvent aussi relire.`,
  },
  'running-challenges': {
    category: 'Contenu',
    title: 'Animer un défi',
    summary: 'Créez un défi, gardez des pointages propres et choisissez les gagnants.',
    body: `Cliquez sur **Nouveau défi** dans Communauté → Défis.

- Choisissez des pointages **quotidiens** (avec le nombre nécessaire pour terminer) ou une participation **unique**.
- Ajoutez les règles, les prix, une couverture et qui peut participer. Enregistrez en brouillon, puis publiez.
- Retirez du fil les pointages qui ne respectent pas les règles : le membre perd ces points, et c’est enregistré.
- À la fin, ouvrez le défi et **choisissez les gagnants** : prenez le haut du classement ou choisissez à la main, dans l’ordre. Vous pouvez les changer ou les effacer plus tard.`,
  },
  stats: {
    category: 'Analyses',
    title: 'Lire les statistiques',
    summary: 'Membres, engagement et contenu sur 30 jours, 90 jours ou 12 mois.',
    body: `Admin → **Statistiques** a trois onglets (quatre pour les Super Admins) :

- **Membres** : actifs aujourd’hui, cette semaine, ce mois-ci, inscriptions et membres actifs dans le temps, le parcours d’inscription et la fidélité par mois d’inscription.
- **Engagement** : publications, commentaires et j’aime dans le temps, par espace, les plus actifs et les meilleurs moments pour publier.
- **Contenu** : les résultats des formations, des événements et des défis.

« Actif » veut dire que le membre a publié, commenté, aimé, voté, s’est inscrit à un événement, a terminé une leçon ou a pointé. Les horaires suivent votre fuseau horaire. Chaque tableau a un bouton **CSV**.`,
  },
  'activity-log': {
    category: 'Analyses',
    title: 'Le journal d’activité',
    summary: 'Qui a fait quoi, et quand.',
    body: `Admin → **Journal d’activité** enregistre chaque action de l’équipe : validations, restrictions, changements de rôle, contenu supprimé ou restauré, réglages, événements, formations, défis, badges et plus encore. Filtrez-le par type.`,
  },

  // ─── Admin: admins ─────────────────────────────────────────────────────────
  spaces: {
    category: 'Configuration de la communauté',
    title: 'Gérer les espaces',
    summary: 'Créer, réordonner, archiver et verrouiller les espaces.',
    body: `Admin → **Espaces** : créez des espaces avec une icône, une description et une couverture, faites-les glisser pour les ordonner, réservez-en certains à **l’équipe**, ou archivez ceux dont vous n’avez plus besoin.

Ouvrez un espace pour choisir **qui peut l’ouvrir** : un rôle minimum, des jours dans la communauté ou un niveau. Les Super Admins peuvent aussi le limiter à certaines offres. Les membres qui ne remplissent pas les conditions voient l’espace avec un cadenas et la raison.`,
  },
  'onboarding-settings': {
    category: 'Configuration de la communauté',
    title: 'L’intégration, le guide et le quiz',
    summary: 'Activez ou désactivez la validation, le guide et le quiz, et publiez un nouveau guide.',
    body: `Admin → **Intégration** :

- Activez ou désactivez : **validation obligatoire**, **acceptation du guide obligatoire**, **quiz obligatoire**.
- Choisissez combien de premières publications sont **relues** (3 par défaut).
- Modifiez le **guide de la communauté** par sections (texte, image ou vidéo). **Publier** crée une nouvelle version que tout le monde doit accepter à nouveau : publiez quand il change vraiment.
- Écrivez les questions du **quiz** et la note de réussite.

Les **mots signalés** qui retiennent les publications et commentaires pour vérification sont dans Admin → Modération.`,
  },
  'invite-links': {
    category: 'Configuration de la communauté',
    title: 'Les liens d’invitation de l’équipe',
    summary: 'Des liens pour vos campagnes, avec une date d’expiration et un nombre maximum d’utilisations.',
    body: `Admin → **Liens d’invitation** crée des liens comme « Abonnés Instagram, 7 jours, 100 premiers ».

- Choisissez si les personnes qui l’utilisent sont **acceptées automatiquement** et/ou deviennent **membres spéciaux**.
- Fixez une **date d’expiration** et un **nombre maximum d’utilisations**.
- Désactivez un lien à tout moment.`,
  },
  'points-and-badges-admin': {
    category: 'Configuration de la communauté',
    title: 'Points, niveaux et badges',
    summary: 'Ajustez les règles de points et les plafonds, renommez les niveaux et créez des badges.',
    body: `Admin → **Points et badges** :

- **Règles de points** : points par action et plafonds par jour. Les pénalités (points négatifs) sont désactivées tant que vous ne les activez pas. Les changements ne s’appliquent qu’aux nouvelles actions.
- **Niveaux** : noms et seuils. Le premier commence à 0 point.
- **Badges** : icône, couleur et description. Les badges automatiques sont donnés à une étape, et à tous ceux qui la remplissent déjà au moment où vous en créez un. Les autres sont donnés à la main depuis la fiche membre, avec une note facultative.

Vous pouvez aussi **ajuster les points d’un membre** depuis sa fiche, avec une raison.`,
  },
  roles: {
    category: 'Membres',
    title: 'Changer les rôles',
    summary: 'Nommer des formateurs et des modérateurs.',
    body: `Depuis la fiche membre, changez le rôle d’un membre. Les admins peuvent choisir Membre, Formateur ou Modérateur ; seuls les Super Admins peuvent nommer des admins et d’autres Super Admins. Le dernier Super Admin ne peut pas être rétrogradé, et personne ne peut changer son propre rôle.`,
  },
  'editing-help': {
    category: 'Configuration de la communauté',
    title: 'Modifier le centre d’aide',
    summary: 'Rédigez, publiez et ordonnez les articles d’aide pour chaque espace et chaque public.',
    body: `Admin → **Articles d’aide** : choisissez un espace, puis créez ou modifiez des articles.

- **Public** : le rôle le plus bas qui voit l’article (par exemple Modérateur = modérateurs, admins et Super Admins).
- **Rubrique** : le titre sous lequel il est rangé.
- Le texte accepte une mise en forme simple : \`## Titre\`, listes avec \`-\` ou \`1.\`, \`**gras**\` et \`[liens](https://…)\`.
- Les brouillons ne sont visibles que par les admins. Utilisez les flèches pour changer l’ordre.
- Choisissez la langue en haut de l’éditeur pour écrire la version française ou arabe ; un champ laissé vide affiche le texte anglais.`,
  },

  // ─── Admin: Super Admins ───────────────────────────────────────────────────
  'tiers-and-access': {
    category: 'Abonnements',
    title: 'Les offres et ce qu’elles débloquent',
    summary: 'Créez des offres, attribuez-les aux membres et réservez du contenu à certaines offres.',
    body: `Admin → **Niveaux d’abonnement** (Super Admins seulement) : créez des offres comme Gratuit et Pro, choisissez l’offre par défaut, renommez-les ou supprimez-les.

- Réservez des **espaces, événements, formations et défis** à certaines offres depuis leurs réglages d’accès. Seuls les Super Admins peuvent changer les conditions d’offre.
- Tant que les paiements ne sont pas connectés, attribuez les offres à la main dans la fiche membre. Avec Stripe (plus tard), les abonnements payants les attribueront automatiquement.`,
  },
};

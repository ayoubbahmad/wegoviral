import type { Shape } from '../../types';
import type { settings as en } from '../en/settings';

export const settings: Shape<typeof en> = {
  title: 'Votre profil',
  description: 'Gérez votre compte et vos préférences.',
  fullName: 'Nom complet',
  email: 'Adresse e-mail',
  followers: 'Abonnés',
  engagement: 'Taux d’engag.',
  avgLikes: 'J’aime moyens',
  accounts: 'Comptes connectés',
  accountsSoon: 'La connexion de vos réseaux sociaux arrive bientôt.',
  language: 'Langue',
  languageHint: 'Toute l’application utilise cette langue. Elle vous suit sur tous les appareils où vous vous connectez.',
  appearance: 'Apparence',
  light: 'Clair',
  dark: 'Sombre',
  system: 'Système',
  usingSystem: 'Selon les préférences de votre appareil',
  usingLight: 'Mode clair',
  usingDark: 'Mode sombre',
};

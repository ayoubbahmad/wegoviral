import type { Shape } from '../../types';
import type { contentLanguage as en } from '../en/contentLanguage';

export const contentLanguage: Shape<typeof en> = {
  label: 'Langue du texte',
  main: 'principale',
  missing: 'Pas encore traduit',
  hint: 'Laissez un champ vide pour afficher le texte anglais en {language}.',
  names: { fr: 'français', ar: 'arabe' },
};

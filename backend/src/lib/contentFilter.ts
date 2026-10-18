/**
 * Flagged-words filter: posts and comments containing a listed word or phrase
 * are held for staff review instead of being published.
 */

// Accents don't matter ("arnaque" also catches "arnaqué")
const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ').toLowerCase();

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The first flagged word or phrase found as a whole word, or null. */
export function findFlaggedWord(text: string, flaggedWords: string[]): string | null {
  if (!flaggedWords.length || !text) return null;
  const haystack = normalize(text);
  for (const word of flaggedWords) {
    const needle = normalize(word.trim());
    if (!needle) continue;
    // Whole words only, so "class" doesn't match "ass"
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(needle)}($|[^\\p{L}\\p{N}])`, 'u');
    if (pattern.test(haystack)) return word.trim();
  }
  return null;
}

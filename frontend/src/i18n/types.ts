/** A message whose wording depends on a number; Arabic uses every form. */
export type Plural = { zero?: string; one?: string; two?: string; few?: string; many?: string; other: string };

/** The same tree as the English messages, with any wording. */
export type Shape<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends { other: string } ? Plural : Shape<T[K]>;
};

/** "feed.composer.title"-style keys for every message. */
export type Paths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string | { other: string } ? `${Prefix}${K}` : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type Vars = Record<string, string | number>;

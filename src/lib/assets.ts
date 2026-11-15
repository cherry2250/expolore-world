import credits from '../data/credits.json';
import type { CultureKind } from '../types';

export interface Credit {
  file: string;
  author: string;
  license: string;
  source: string;
}

const creditMap = credits as Record<string, Credit>;

export function imageUrl(countryId: string, kind: CultureKind): string {
  return `${import.meta.env.BASE_URL}images/${countryId}/${kind}.jpg`;
}

export function creditFor(countryId: string, kind: CultureKind): Credit | undefined {
  return creditMap[`${countryId}/${kind}`];
}

export const allCredits = creditMap;

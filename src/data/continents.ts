import type { Continent, ContinentId } from '../types';

export const continents: Continent[] = [
  {
    id: 'asia', nameKo: '아시아', neName: 'Asia', color: '#F25C7F', soft: '#F9C3CF',
    bounds: [64, 2, 146, 54], labelAt: [92, 46],
    countryIds: ['korea', 'japan', 'china', 'india', 'thailand', 'vietnam'],
  },
  {
    id: 'europe', nameKo: '유럽', neName: 'Europe', color: '#8571E8', soft: '#D3CAF7',
    bounds: [-11, 35, 30, 60], labelAt: [16, 53],
    countryIds: ['france', 'uk', 'italy', 'germany', 'spain', 'greece'],
  },
  {
    id: 'africa', nameKo: '아프리카', neName: 'Africa', color: '#E9A21C', soft: '#F7DDA4',
    bounds: [-18, -35, 51, 37], labelAt: [20, 4],
    countryIds: ['egypt', 'kenya', 'south-africa', 'morocco', 'nigeria'],
  },
  {
    id: 'north-america', nameKo: '북아메리카', neName: 'North America', color: '#F27A45', soft: '#F9CDB6',
    bounds: [-135, 14, -60, 70], labelAt: [-102, 47],
    countryIds: ['usa', 'canada', 'mexico', 'cuba'],
  },
  {
    id: 'south-america', nameKo: '남아메리카', neName: 'South America', color: '#3DAE69', soft: '#B9E3C6',
    bounds: [-82, -55, -35, 12], labelAt: [-60, -14],
    countryIds: ['brazil', 'argentina', 'peru', 'chile', 'colombia'],
  },
  {
    id: 'oceania', nameKo: '오세아니아', neName: 'Oceania', color: '#1FADA0', soft: '#AEE3DD',
    bounds: [112, -47, 180, -10], labelAt: [134, -24],
    countryIds: ['australia', 'new-zealand', 'fiji'],
  },
];

export const continentById = Object.fromEntries(continents.map((c) => [c.id, c])) as Record<ContinentId, Continent>;

export const continentByNeName: Record<string, Continent> = Object.fromEntries(continents.map((c) => [c.neName, c]));

export function isContinentId(id: string | undefined): id is ContinentId {
  return !!id && id in continentById;
}

/**
 * 대륙 화면에서 좌우로 넘길 때의 순서 (서 → 동).
 * 지도는 손가락을 따라 움직이므로, 손가락을 왼쪽으로 밀면 동쪽 이웃이, 오른쪽으로 밀면 서쪽 이웃이 나타납니다.
 * 예) 북아메리카에서 오른쪽으로 밀면 태평양 건너 아시아, 왼쪽으로 밀면 남아메리카.
 */
export const CONTINENT_RING: ContinentId[] = ['europe', 'africa', 'oceania', 'asia', 'north-america', 'south-america'];

export function neighborsOf(id: ContinentId): { west: ContinentId; east: ContinentId } {
  const i = CONTINENT_RING.indexOf(id);
  const n = CONTINENT_RING.length;
  return { west: CONTINENT_RING[(i - 1 + n) % n], east: CONTINENT_RING[(i + 1) % n] };
}

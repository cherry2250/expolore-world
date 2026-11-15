import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { geoContains, geoDistance } from 'd3-geo';
import { continents } from '../src/data/continents';
import { countries, countryById } from '../src/data/countries';
import { geoByIso } from '../src/lib/geo';
import credits from '../src/data/credits.json';

const KINDS = ['food', 'landmark', 'highlight'] as const;

describe('콘텐츠 데이터', () => {
  it('대륙마다 3~6개 나라, 모두 존재하고 대륙이 일치', () => {
    for (const c of continents) {
      expect(c.countryIds.length).toBeGreaterThanOrEqual(3);
      expect(c.countryIds.length).toBeLessThanOrEqual(6);
      for (const id of c.countryIds) expect(countryById[id]?.continentId, id).toBe(c.id);
    }
    expect(continents.flatMap((c) => c.countryIds).sort()).toEqual(countries.map((c) => c.id).sort());
  });

  it.each(countries.map((c) => [c.id, c] as const))('%s: 필수 항목·사진·출처가 모두 있음', (id, c) => {
    expect(c.greeting.native && c.greeting.pronunciationKo && c.greeting.how && c.greeting.lang).toBeTruthy();
    for (const k of KINDS) {
      expect(c[k].name, `${id}.${k}.name`).toBeTruthy();
      expect(c[k].description, `${id}.${k}.description`).toBeTruthy();
      expect(c[k].description.length, `${id}.${k} 설명이 패널에 들어가는 길이`).toBeLessThanOrEqual(60);
      expect(existsSync(resolve(__dirname, `../public/images/${id}/${k}.jpg`)), `${id}/${k}.jpg`).toBe(true);
      expect((credits as Record<string, unknown>)[`${id}/${k}`], `credit ${id}/${k}`).toBeTruthy();
    }
  });

  it.each(countries.map((c) => [c.id, c] as const))('%s: 지도 핀이 실제 국경 안(또는 섬나라는 30km 이내)에 있음', (id, c) => {
    const f = geoByIso[c.iso];
    expect(f, `geo feature for ${c.iso}`).toBeTruthy();
    const inside = geoContains(f, c.pin);
    if (!inside) {
      // 피지처럼 작은 섬은 단순화된 해안선 밖일 수 있으므로 거리로 확인
      const coords = (f.geometry as GeoJSON.MultiPolygon | GeoJSON.Polygon).coordinates.flat(2) as unknown as [number, number][];
      const near = Math.min(...coords.map((p) => geoDistance(p, c.pin))) * 6371;
      expect(near, `${id} pin distance km`).toBeLessThan(30);
    }
  });

  it('사진이 모두 800×600 규격', async () => {
    const sharp = (await import('sharp')).default;
    for (const c of countries)
      for (const k of KINDS) {
        const m = await sharp(resolve(__dirname, `../public/images/${c.id}/${k}.jpg`)).metadata();
        expect([m.width, m.height], `${c.id}/${k}`).toEqual([800, 600]);
      }
  });

  it('핀이 대륙 화면 범위 안에 있음', () => {
    for (const c of countries) {
      const [w, s, e, n] = continents.find((x) => x.id === c.continentId)!.bounds;
      expect(c.pin[0] >= w && c.pin[0] <= e && c.pin[1] >= s && c.pin[1] <= n, c.id).toBe(true);
    }
  });
});
